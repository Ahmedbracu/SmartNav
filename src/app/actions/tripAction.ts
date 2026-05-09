"use server";

import connectToDatabase from "@/lib/db";
import Trip from "@/models/Trip";
import RouteModel from "@/models/Route";
import { auth } from "@/auth";

export async function createTrip(
  sourceId: string,
  destId: string,
  cost: number,
  time: number
) {
  try {
    const session = await auth();
    if (!session || !session.user || !session.user.id) {
      return { error: "You must be logged in to store a trip." };
    }

    await connectToDatabase();

    // Find or create route dynamically
    let route = await RouteModel.findOne({ source_location: sourceId, destination_location: destId });
    
    if (!route) {
      route = await RouteModel.create({
        source_location: sourceId,
        destination_location: destId,
        total_distance: 10, // Placeholder
        estimated_time: time,
        estimated_cost: cost,
        segments: []
      });
    }

    await Trip.create({
      user: session.user.id,
      route: route._id,
      travel_time: time,
      travel_cost: cost,
    });

    return { success: true };
  } catch (error: any) {
    return { error: error.message || "Failed to create trip" };
  }
}
