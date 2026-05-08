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

  // Find routes matching source and destination
  const routes = await RouteModel.find({
    source_location: sourceId,
    destination_location: destId,
  })
    .populate("source_location")
    .populate("destination_location")
    .populate({
      path: "segments.transport",
      model: TransportMode,
    })
    .populate({
      path: "segments.start_location",
      model: Location,
    })
    .populate({
      path: "segments.end_location",
      model: Location,
    })
    .lean();

  if (!routes || routes.length === 0) {
    return { routes: [] };
  }

  const currentHour = new Date().getHours() + ":00-00:00"; // Simplified for porting

  // Dynamic Calculation
  const processedRoutes = await Promise.all(
    routes.map(async (route: any) => {
      let adjustedTime = 0;
      let minCost = Infinity;
      let maxCost = 0;
      let hasSegments = false;
      let isOverBudget = false;

      // Extract all unique location IDs in the route to fetch traffic/incidents
      const locationIds = new Set<string>();
      route.segments.forEach((seg: any) => {
        locationIds.add(seg.start_location._id.toString());
        locationIds.add(seg.end_location._id.toString());
        
        hasSegments = true;
        const c = seg.cost;
        if (c < minCost) minCost = c;
        if (c > maxCost) maxCost = c;
      });

      if (!hasSegments) {
        return null;
      }

      // Fetch Traffic Data for these locations
      const trafficData = await Traffic.find({
        location: { $in: Array.from(locationIds) },
        // In real app: match current date and time_slot
      }).lean();

      const trafficByLoc = trafficData.reduce((acc: any, t: any) => {
        acc[t.location.toString()] = t;
        return acc;
      }, {});

      // Calculate adjusted time per segment
      route.segments.forEach((seg: any) => {
        let multiplier = 1.0;
        [seg.start_location._id.toString(), seg.end_location._id.toString()].forEach(lid => {
          if (trafficByLoc[lid]) {
            const cong = trafficByLoc[lid].congestion_level;
            let m = 1.0;
            if (cong === 'Gridlock') m = 2.5;
            else if (cong === 'Heavy') m = 1.8;
            else if (cong === 'Moderate') m = 1.3;
            if (m > multiplier) multiplier = m;
          }
        });
        
        // Apply multiplier
        seg.adjusted_time = Math.round(seg.time * multiplier);
        adjustedTime += seg.adjusted_time;
      });

      // Budget check: If even the minimum possible cost is higher than budget
      if (minCost > budget) {
        isOverBudget = true;
      }

      return {
        _id: route._id.toString(),
        source_name: route.source_location.name,
        dest_name: route.destination_location.name,
        total_distance: route.total_distance,
        estimated_time: route.estimated_time,
        adjusted_time: adjustedTime,
        min_seg_cost: minCost,
        max_seg_cost: maxCost,
        is_over_budget: isOverBudget,
        segments: route.segments.map((s:any) => ({
          ...s,
          _id: s._id.toString(),
          transport_type: s.transport.type
        }))
      };
    })
  );

  const validRoutes = processedRoutes.filter(r => r !== null);
  
  // Sort by adjusted time
  validRoutes.sort((a, b) => (a?.adjusted_time || 0) - (b?.adjusted_time || 0));

  return { routes: validRoutes };
}
