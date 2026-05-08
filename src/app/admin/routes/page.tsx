import connectToDatabase from "@/lib/db";
import RouteModel from "@/models/Route";
import Location from "@/models/Location";
import TransportMode from "@/models/TransportMode";
import AdminRoutesClient from "./AdminRoutesClient";

export default async function AdminRoutesPage() {
  await connectToDatabase();

  const locations = await Location.find().sort({ name: 1 }).lean();
  const transports = await TransportMode.find().sort({ type: 1 }).lean();
  
  const routes = await RouteModel.find()
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
    .sort({ _id: -1 })
    .lean();

  // Serialize to pass to Client Component
  const serializedLocations = locations.map(l => ({ _id: l._id.toString(), name: l.name }));
  const serializedTransports = transports.map(t => ({ _id: t._id.toString(), type: t.type }));
  
  const serializedRoutes = routes.map(r => ({
    _id: r._id.toString(),
    source_name: r.source_location.name,
    dest_name: r.destination_location.name,
    total_distance: r.total_distance,
    estimated_time: r.estimated_time,
    estimated_cost: r.estimated_cost,
    segments: r.segments.map((s: any) => ({
      _id: s._id.toString(),
      transport_type: s.transport.type,
      start_name: s.start_location.name,
      end_name: s.end_location.name,
      distance: s.distance,
      time: s.time,
      cost: s.cost
    }))
  }));

  return <AdminRoutesClient locations={serializedLocations} transports={serializedTransports} routes={serializedRoutes} />;
}
