import { auth } from "@/auth";
import connectToDatabase from "@/lib/db";
import Location from "@/models/Location";
import Traffic from "@/models/Traffic";
import TrafficClient from "./TrafficClient";

export default async function TrafficPage() {
  const session = await auth();
  await connectToDatabase();

  const locations = await Location.find().sort({ name: 1 }).lean();
  const serializedLocations = locations.map(l => ({ _id: l._id.toString(), name: l.name }));

  const recentTraffic = await Traffic.find()
    .populate("location", "name")
    .sort({ date: -1 })
    .limit(20)
    .lean();

  const serializedTraffic = recentTraffic.map((t: any) => ({
    _id: t._id.toString(),
    location_name: t.location?.name || "Unknown",
    congestion_level: t.congestion_level,
    avg_speed: t.avg_speed,
    time_slot: t.time_slot || "",
    recorded_at: t.date ? new Date(t.date).toISOString() : new Date().toISOString()
  }));

  // Worst roads — aggregate by location, lowest avg speed
  const worstRoads = await Traffic.aggregate([
    {
      $group: {
        _id: "$location",
        avg_spd: { $avg: "$avg_speed" },
        congestion_level: { $first: "$congestion_level" }
      }
    },
    { $sort: { avg_spd: 1 } },
    { $limit: 5 }
  ]);

  const populatedWorstRoads = await Location.populate(worstRoads, { path: "_id", select: "name" });
  const serializedWorstRoads = populatedWorstRoads.map((w: any) => ({
    location_name: w._id?.name || "Unknown",
    avg_spd: w.avg_spd,
    congestion_level: w.congestion_level
  }));

  return (
    <TrafficClient 
      isLoggedIn={!!session?.user?.id}
      userId={session?.user?.id}
      locations={serializedLocations}
      recentTraffic={serializedTraffic}
      worstRoads={serializedWorstRoads}
    />
  );
}
