"use server";

import connectToDatabase from "@/lib/db";
import Traffic from "@/models/Traffic";
import { revalidatePath } from "next/cache";

export async function submitTrafficData(userId: string, formData: FormData) {
  await connectToDatabase();

  const location = formData.get("location_id") as string;
  const congestion_level = formData.get("congestion_level") as string;
  const avg_speed = Number(formData.get("avg_speed"));
  const description = formData.get("description") as string;

  if (!location || !congestion_level || isNaN(avg_speed)) {
    return { error: "Please fill in all required fields." };
  }

  try {
    await Traffic.create({
      location,
      congestion_level,
      avg_speed,
      description,
      recorded_by: userId,
      recorded_at: new Date()
    });

    revalidatePath("/traffic");
    revalidatePath("/route-finder"); // Revalidate routes since traffic affects it
    return { success: "Traffic data submitted successfully!" };
  } catch {
    return { error: "Failed to submit traffic data." };
  }
}
