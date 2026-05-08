"use server";

import connectToDatabase from "@/lib/db";
import TransportMode from "@/models/TransportMode";
import { revalidatePath } from "next/cache";

export async function addTransport(formData: FormData) {
  await connectToDatabase();

  const type = formData.get("transport_type") as string;
  const average_speed = Number(formData.get("average_speed"));
  const base_fare = Number(formData.get("base_fare"));

  if (!type || isNaN(average_speed) || isNaN(base_fare)) {
    return { error: "All fields are required and must be valid numbers." };
  }

  try {
    await TransportMode.create({
      type,
      average_speed,
      base_fare
    });
    
    revalidatePath("/admin/transport");
    return { success: "Transport mode added successfully." };
  } catch (e: any) {
    return { error: e.message };
  }
}

export async function deleteTransport(id: string) {
  await connectToDatabase();
  try {
    await TransportMode.findByIdAndDelete(id);
    revalidatePath("/admin/transport");
    return { success: "Transport mode deleted." };
  } catch (e: any) {
    return { error: e.message };
  }
}
