import connectToDatabase from "@/lib/db";
import Location from "@/models/Location";
import Incident from "@/models/Incident";
import ChaosMapClient from "./ChaosMapClient";

export default async function ChaosMapPage() {
  await connectToDatabase();

  const locations = await Location.find().lean();
  const serializedLocations = locations.map((l: any) => ({
    _id: l._id.toString(),
    name: l.name,
    latitude: l.latitude,
    longitude: l.longitude,
    area_zone: l.area_zone,
  }));

  const incidents = await Incident.find({ status: "Active" })
    .populate("location", "name latitude longitude")
    .sort({ reported_at: -1 })
    .lean();

  const serializedIncidents = incidents.map((i: any) => ({
    _id: i._id.toString(),
    type: i.type,
    severity: i.severity,
    status: i.status,
    location_name: i.location?.name || "Unknown",
    latitude: i.location?.latitude || 23.7806,
    longitude: i.location?.longitude || 90.3964,
  }));

  return (
    <ChaosMapClient
      locations={serializedLocations}
      incidents={serializedIncidents}
    />
  );
}
