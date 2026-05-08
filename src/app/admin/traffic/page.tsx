/* eslint-disable @typescript-eslint/no-explicit-any */
import connectToDatabase from "@/lib/db";
import Traffic from "@/models/Traffic";
import Location from "@/models/Location";
import AdminTrafficClient from "./AdminTrafficClient";

export default async function AdminTrafficPage() {
  await connectToDatabase();

  const locations = await Location.find().sort({ name: 1 }).lean();
  const trafficRecords = await Traffic.find()
    .populate("location")
    .sort({ date: -1 })
    .limit(100)
    .lean();

  const serializedLocations = locations.map((l: any) => ({ _id: l._id.toString(), name: l.name }));
  const serializedTraffic = trafficRecords.map((t: any) => ({
    _id: t._id.toString(),
    location_name: t.location?.name || "Unknown",
    congestion_level: t.congestion_level,
    avg_speed: t.avg_speed,
    date: new Date(t.date).toLocaleDateString(),
    time_slot: t.time_slot,
  }));

  return <AdminTrafficClient locations={serializedLocations} records={serializedTraffic} />;
}
