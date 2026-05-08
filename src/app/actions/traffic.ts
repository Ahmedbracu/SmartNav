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

  // Validate congestion level matches schema enum
  const validLevels = ["Gridlock", "Heavy", "Moderate", "Light"];
  // Map user-friendly "Clear" to "Light"
  const mappedLevel = congestion_level === "Clear" ? "Light" : congestion_level;
  if (!validLevels.includes(mappedLevel)) {
    return { error: "Invalid congestion level." };
  }

  // Generate time slot from current time
  const now = new Date();
  const hour = now.getHours();
  const timeSlot = `${String(hour).padStart(2, '0')}:00-${String(hour + 1).padStart(2, '0')}:00`;

  try {
    await Traffic.create({
      location,
      congestion_level: mappedLevel,
      avg_speed,
      date: now,
      time_slot: timeSlot,
    });

    revalidatePath("/traffic");
    revalidatePath("/route-finder");
    return { success: "Traffic data submitted successfully!" };
  } catch (err: any) {
    console.error("Traffic submit error:", err);
    return { error: `Failed to submit: ${err.message}` };
  }
}
