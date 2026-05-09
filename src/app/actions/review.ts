"use server";

import connectToDatabase from "@/lib/db";
import Review from "@/models/Review";
import RouteModel from "@/models/Route";
import { revalidatePath } from "next/cache";

export async function submitReview(userId: string, formData: FormData) {
  await connectToDatabase();

  const transport = formData.get("transport_id") as string;
  const source_id = formData.get("source_id") as string;
  const dest_id = formData.get("dest_id") as string;
  const rating = Number(formData.get("rating"));
  const comment = formData.get("comment") as string;

  if (!transport || !rating || isNaN(rating) || rating < 1 || rating > 5) {
    return { error: "Please provide a valid rating and transport mode." };
  }

  if (source_id === dest_id) {
    return { error: "Source and Destination cannot be the same." };
  }

  try {
    let routeId = null;

    if (source_id && dest_id) {
      // Find existing route
      let route = await RouteModel.findOne({
        source_location: source_id,
        destination_location: dest_id
      });

      // Create new route dynamically if it doesn't exist
      if (!route) {
        route = await RouteModel.create({
          source_location: source_id,
          destination_location: dest_id,
          total_distance: 10, // Generic default distance
          estimated_time: 30, // Generic default time
          segments: [] 
        });
      }
      routeId = route._id;
    }

    const payload: any = {
      user: userId,
      transport,
      rating,
      comment,
      timestamp: new Date()
    };
    
    if (routeId) payload.route = routeId;

    await Review.create(payload);

    revalidatePath("/ratings");
    return { success: "Review submitted! Thank you." };
  } catch (e) {
    console.error(e);
    return { error: "Failed to submit review." };
  }
}
