"use server";

import connectToDatabase from "@/lib/db";
import Incident from "@/models/Incident";
import { revalidatePath } from "next/cache";

export async function reportIncident(userId: string, formData: FormData) {
  await connectToDatabase();

  const location = formData.get("location_id") as string;
  const type = formData.get("incident_type") as string;
  const severity = formData.get("severity") as string;
  const description = formData.get("description") as string;

  if (!location || !type || !severity) {
    return { error: "Please fill in all required fields." };
  }

  const validSeverities = ["Low", "Medium", "High"];
  if (!validSeverities.includes(severity)) {
    return { error: "Invalid severity level." };
  }

  try {
    await Incident.create({
      user: userId,
      location,
      type,
      severity,
      description: description || "",
      status: "Active",
      reported_at: new Date()
    });

    revalidatePath("/chaos-map");
    revalidatePath("/report");
    revalidatePath("/");
    return { success: "Incident reported successfully! It is now visible on the Chaos Map." };
  } catch (err: any) {
    console.error("Report incident error:", err);
    return { error: `Failed to submit report: ${err.message}` };
  }
}
