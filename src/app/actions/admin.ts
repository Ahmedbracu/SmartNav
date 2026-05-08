"use server";

import connectToDatabase from "@/lib/db";
import RouteModel from "@/models/Route";
import { revalidatePath } from "next/cache";

export async function addRoute(formData: FormData) {
  await connectToDatabase();
  
  const source_location = formData.get("source_location_id") as string;
  const destination_location = formData.get("destination_location_id") as string;
  const total_distance = Number(formData.get("total_distance"));
  const estimated_time = Number(formData.get("estimated_time"));
  const estimated_cost = Number(formData.get("estimated_cost"));

  if (source_location === destination_location) {
    return { error: "Source and destination cannot be the same." };
  }

  try {
    await RouteModel.create({
      source_location,
      destination_location,
      total_distance,
      estimated_time,
      estimated_cost,
      segments: []
    });
    
    revalidatePath("/admin/routes");
    return { success: "Route added successfully." };
  } catch (e: any) {
    return { error: e.message };
  }
}

export async function addSegment(formData: FormData) {
  await connectToDatabase();
  
  const route_id = formData.get("route_id") as string;
  const transport = formData.get("transport_id") as string;
  const start_location = formData.get("start_location_id") as string;
  const end_location = formData.get("end_location_id") as string;
  const distance = Number(formData.get("segment_distance"));
  const time = Number(formData.get("segment_time"));
  const cost = Number(formData.get("segment_cost"));

  try {
    // In Mongoose, we push the segment into the Route document's segments array
    await RouteModel.findByIdAndUpdate(route_id, {
      $push: {
        segments: {
          transport,
          start_location,
          end_location,
          distance,
          time,
          cost
        }
      }
    });
    
    revalidatePath("/admin/routes");
    return { success: "Segment added successfully." };
  } catch (e: any) {
    return { error: e.message };
  }
}

export async function deleteRoute(routeId: string) {
  await connectToDatabase();
  await RouteModel.findByIdAndDelete(routeId);
  revalidatePath("/admin/routes");
}

export async function deleteSegment(routeId: string, segmentId: string) {
  await connectToDatabase();
  await RouteModel.findByIdAndUpdate(routeId, {
    $pull: { segments: { _id: segmentId } }
  });
  revalidatePath("/admin/routes");
}

export async function addTrafficRecord(formData: FormData) {
  const Traffic = (await import("@/models/Traffic")).default;
  await connectToDatabase();

  const location = formData.get("location_id") as string;
  const congestion_level = formData.get("congestion_level") as string;
  const avg_speed = Number(formData.get("avg_speed"));
  const time_slot = formData.get("time_slot") as string;

  try {
    await Traffic.create({
      location,
      congestion_level,
      avg_speed,
      date: new Date(),
      time_slot,
    });
    revalidatePath("/admin/traffic");
    return { success: "Traffic record added." };
  } catch (e: any) {
    return { error: e.message };
  }
}

export async function deleteTrafficRecord(recordId: string) {
  const Traffic = (await import("@/models/Traffic")).default;
  await connectToDatabase();
  await Traffic.findByIdAndDelete(recordId);
  revalidatePath("/admin/traffic");
}

