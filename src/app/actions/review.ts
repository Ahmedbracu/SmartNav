"use server";

import connectToDatabase from "@/lib/db";
import Review from "@/models/Review";
import { revalidatePath } from "next/cache";

export async function submitReview(userId: string, formData: FormData) {
  await connectToDatabase();

  const transport = formData.get("transport_id") as string;
  const route = formData.get("route_id") as string;
  const rating = Number(formData.get("rating"));
  const comment = formData.get("comment") as string;

  if (!transport || !rating || isNaN(rating) || rating < 1 || rating > 5) {
    return { error: "Please provide a valid rating and transport mode." };
  }

  try {
    const payload: any = {
      user: userId,
      transport,
      rating,
      comment,
      timestamp: new Date()
    };
    if (route) payload.route = route;

    await Review.create(payload);

    revalidatePath("/ratings");
    return { success: "Review submitted! Thank you." };
  } catch {
    return { error: "Failed to submit review." };
  }
}
