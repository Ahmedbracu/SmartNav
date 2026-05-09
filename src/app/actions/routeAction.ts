"use server";

import connectToDatabase from "@/lib/db";
import RouteModel from "@/models/Route";
import Traffic from "@/models/Traffic";
import Incident from "@/models/Incident";
import Location from "@/models/Location";
import TransportMode from "@/models/TransportMode";

export async function findRoutes(sourceId: string, destId: string, budget: number) {
  await connectToDatabase();

  if (sourceId === destId) {
    return { error: "Source and destination cannot be the same." };
  }

  const sourceLoc = await Location.findById(sourceId);
  const destLoc = await Location.findById(destId);

  if (!sourceLoc || !destLoc) {
    return { error: "Invalid locations." };
  }

  // Fetch real distance from OSRM
  let distanceKm = 0;
  let durationMin = 0;

  try {
    const res = await fetch(`http://router.project-osrm.org/route/v1/driving/${sourceLoc.longitude},${sourceLoc.latitude};${destLoc.longitude},${destLoc.latitude}?overview=false`, { next: { revalidate: 3600 } });
    const data = await res.json();
    if (data.routes && data.routes[0]) {
      distanceKm = data.routes[0].distance / 1000;
      durationMin = data.routes[0].duration / 60;
    }
  } catch (e) {
    console.error("OSRM failed", e);
  }

  // Fallback Haversine if OSRM fails
  if (distanceKm === 0) {
    const R = 6371; // km
    const dLat = (destLoc.latitude - sourceLoc.latitude) * Math.PI / 180;
    const dLon = (destLoc.longitude - sourceLoc.longitude) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(sourceLoc.latitude * Math.PI / 180) * Math.cos(destLoc.latitude * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    distanceKm = R * c * 1.4; // 1.4 winding factor
    durationMin = distanceKm * 3; // roughly 20km/h
  }

  // Fetch Traffic Data to adjust duration
  const trafficData = await Traffic.find({ location: { $in: [sourceId, destId] } }).lean();
  let trafficMultiplier = 1.0;
  
  trafficData.forEach((t: any) => {
    let m = 1.0;
    if (t.congestion_level === 'Gridlock') m = 2.2;
    else if (t.congestion_level === 'Heavy') m = 1.6;
    else if (t.congestion_level === 'Moderate') m = 1.2;
    if (m > trafficMultiplier) trafficMultiplier = m;
  });

  // Dynamic Transport Options
  const baseOptions = [
    { type: "Bike", baseFare: 40, perKm: 12, timeMult: 0.8 },
    { type: "CNG Auto", baseFare: 50, perKm: 15, timeMult: 1.0 },
    { type: "Car (Uber X)", baseFare: 80, perKm: 25, timeMult: 1.2 },
    { type: "Local Bus", baseFare: 10, perKm: 2.5, timeMult: 1.6 },
    { type: "Metro Rail", baseFare: 20, perKm: 5, timeMult: 0.5 }, // Faster and avoids traffic
  ];

  const generatedRoutes = baseOptions.map((opt, index) => {
    const cost = Math.round(opt.baseFare + (distanceKm * opt.perKm));
    const time = Math.round(durationMin * opt.timeMult * trafficMultiplier);
    
    return {
      _id: `dynamic_${index}`,
      source_name: sourceLoc.name,
      dest_name: destLoc.name,
      total_distance: Math.round(distanceKm * 10) / 10,
      adjusted_time: time,
      min_seg_cost: cost,
      max_seg_cost: cost,
      is_over_budget: cost > budget,
      transport_type: opt.type,
      segments: [
        {
          _id: `seg_${index}`,
          transport_type: opt.type,
          cost: cost
        }
      ]
    };
  });

  // Filter out those over budget if budget is strict (optional, but requested)
  // Actually, let's keep them but flag them as is_over_budget so user can still see them
  const validRoutes = generatedRoutes;

  // Find Cheapest and Fastest
  validRoutes.sort((a, b) => a.adjusted_time - b.adjusted_time);
  const fastestRoute = validRoutes[0];
  
  const affordableRoutes = [...validRoutes].sort((a, b) => a.min_seg_cost - b.min_seg_cost);
  const cheapestRoute = affordableRoutes[0];

  validRoutes.forEach(r => {
    (r as any).is_fastest = r._id === fastestRoute._id;
    (r as any).is_cheapest = r._id === cheapestRoute._id;
  });

  // AI Recommendation Engine
  let aiInsight = "";
  if (fastestRoute._id === cheapestRoute._id) {
    aiInsight = `✨ AI Insight: Taking a ${fastestRoute.transport_type} is a no-brainer. It is both the fastest (${fastestRoute.adjusted_time} mins) and cheapest (৳${fastestRoute.min_seg_cost}) option available.`;
  } else {
    const timeSaved = cheapestRoute.adjusted_time - fastestRoute.adjusted_time;
    const extraCost = fastestRoute.min_seg_cost - cheapestRoute.min_seg_cost;
    
    if (timeSaved > 15 && extraCost < 100) {
      aiInsight = `✨ AI Insight: Taking a ${fastestRoute.transport_type} saves you ${timeSaved} minutes for an extra ৳${extraCost}. Given the current traffic, this is highly recommended for urgent travel.`;
    } else if (timeSaved < 10 && extraCost > 50) {
      aiInsight = `✨ AI Insight: The fastest option (${fastestRoute.transport_type}) only saves you ${timeSaved} minutes but costs ৳${extraCost} more. Save your money and take the ${cheapestRoute.transport_type} instead.`;
    } else {
      aiInsight = `✨ AI Insight: The ${cheapestRoute.transport_type} is the most economical choice at ৳${cheapestRoute.min_seg_cost}, but if you are in a rush, switch to a ${fastestRoute.transport_type} to save ${timeSaved} mins.`;
    }
  }

  return { routes: validRoutes, ai_insight: aiInsight };
}
