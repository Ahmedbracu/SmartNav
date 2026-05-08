import { auth } from "@/auth";
import { redirect } from "next/navigation";
import connectToDatabase from "@/lib/db";
import TransportMode from "@/models/TransportMode";
import AdminTransportClient from "./AdminTransportClient";

export default async function AdminTransportPage() {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "admin") {
    redirect("/");
  }

  await connectToDatabase();

  const transports = await TransportMode.find().sort({ type: 1 }).lean();
  const serializedTransports = transports.map((t: any) => ({
    _id: t._id.toString(),
    type: t.type,
    average_speed: t.average_speed,
    base_fare: t.base_fare
  }));

  return <AdminTransportClient transports={serializedTransports} />;
}
