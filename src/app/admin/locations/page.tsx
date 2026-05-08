import { auth } from "@/auth";
import { redirect } from "next/navigation";
import connectToDatabase from "@/lib/db";
import Location from "@/models/Location";
import AdminLocationClient from "./AdminLocationClient";

export default async function AdminLocationPage() {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "admin") {
    redirect("/");
  }

  await connectToDatabase();

  const locations = await Location.find().sort({ name: 1 }).lean();
  const serializedLocations = locations.map((l: any) => ({
    _id: l._id.toString(),
    name: l.name,
    area_zone: l.area_zone
  }));

  return <AdminLocationClient locations={serializedLocations} />;
}
