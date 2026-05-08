import { auth } from "@/auth";
import { redirect } from "next/navigation";
import connectToDatabase from "@/lib/db";
import Location from "@/models/Location";
import Incident from "@/models/Incident";
import ReportIncidentClient from "./ReportIncidentClient";

export default async function ReportIncidentPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  await connectToDatabase();
  
  const locations = await Location.find().sort({ name: 1 }).lean();
  const serializedLocations = locations.map(l => ({ _id: l._id.toString(), name: l.name, area_zone: l.area_zone }));

  const recentReports = await Incident.find({ reported_by: session.user.id })
    .populate("location", "name")
    .sort({ reported_at: -1 })
    .limit(5)
    .lean();

  const serializedReports = recentReports.map((r: any) => ({
    _id: r._id.toString(),
    type: r.type,
    severity: r.severity,
    status: r.status,
    location_name: r.location?.name,
    reported_at: r.reported_at.toISOString()
  }));

  return (
    <ReportIncidentClient 
      userId={session.user.id} 
      locations={serializedLocations} 
      recentReports={serializedReports} 
    />
  );
}
