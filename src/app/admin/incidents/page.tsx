import { auth } from "@/auth";
import { redirect } from "next/navigation";
import connectToDatabase from "@/lib/db";
import Incident from "@/models/Incident";
import Location from "@/models/Location";
import AdminIncidentClient from "./AdminIncidentClient";

export default async function AdminIncidentPage() {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "admin") {
    redirect("/");
  }

  await connectToDatabase();

  const incidents = await Incident.find()
    .populate("location", "name")
    .populate("user", "name email")
    .sort({ reported_at: -1 })
    .lean();

  const serializedIncidents = incidents.map((i: any) => ({
    _id: i._id.toString(),
    type: i.type,
    severity: i.severity,
    description: i.description,
    status: i.status,
    location_name: i.location?.name || "Unknown",
    reporter_name: i.user?.name || "Unknown",
    reporter_email: i.user?.email || "Unknown",
    reported_at: i.reported_at.toISOString()
  }));

  return <AdminIncidentClient incidents={serializedIncidents} />;
}
