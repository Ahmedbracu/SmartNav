"use server";

import connectToDatabase from "@/lib/db";
import Location from "@/models/Location";
import { revalidatePath } from "next/cache";

export async function addLocation(formData: FormData) {
  await connectToDatabase();

  const name = formData.get("name") as string;
  const area_zone = formData.get("area_zone") as string;

  if (!name || !area_zone) {
    return { error: "Location name and area zone are required." };
  }

  try {
    await Location.create({
      name,
      area_zone
    });
    
    revalidatePath("/admin/locations");
    return { success: "Location added successfully." };
  } catch (e: any) {
    return { error: e.message };
  }
}

export async function deleteLocation(id: string) {
  await connectToDatabase();
  try {
    await Location.findByIdAndDelete(id);
    revalidatePath("/admin/locations");
    return { success: "Location deleted." };
  } catch (e: any) {
    return { error: e.message };
  }
}
