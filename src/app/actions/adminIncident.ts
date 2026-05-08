"use server";

import connectToDatabase from "@/lib/db";
import Incident from "@/models/Incident";
import { revalidatePath } from "next/cache";

export async function updateIncidentStatus(id: string, status: string) {
  await connectToDatabase();
  try {
    await Incident.findByIdAndUpdate(id, { status });
    revalidatePath("/admin/incidents");
    revalidatePath("/chaos-map");
    return { success: "Incident status updated." };
  } catch (e: any) {
    return { error: e.message };
  }
}

export async function deleteIncident(id: string) {
  await connectToDatabase();
  try {
    await Incident.findByIdAndDelete(id);
    revalidatePath("/admin/incidents");
    revalidatePath("/chaos-map");
    return { success: "Incident deleted." };
  } catch (e: any) {
    return { error: e.message };
  }
}
