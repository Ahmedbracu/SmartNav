"use server";

import connectToDatabase from "@/lib/db";
import User from "@/models/User";
import Trip from "@/models/Trip";
import Incident from "@/models/Incident";
import Review from "@/models/Review";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";

export async function updatePreferences(userId: string, formData: FormData) {
  await connectToDatabase();
  
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const newPassword = formData.get("new_password") as string;
  const confirmPassword = formData.get("confirm_password") as string;

  if (!name || !email) {
    return { error: "Name and email are required" };
  }

  const updateData: any = { name, email };

  if (newPassword) {
    if (newPassword !== confirmPassword) {
      return { error: "Passwords do not match" };
    }
    updateData.password_hash = await bcrypt.hash(newPassword, 10);
  }

  try {
    await User.findByIdAndUpdate(userId, updateData);
    return { success: "Preferences saved successfully." };
  } catch {
    return { error: "Failed to update preferences" };
  }
}

export async function getAccountSummary(userId: string) {
  await connectToDatabase();
  
  const objectId = new mongoose.Types.ObjectId(userId);
  
  const trips = await Trip.countDocuments({ user: objectId });
  const incidents = await Incident.countDocuments({ user: objectId });
  const reviews = await Review.countDocuments({ user: objectId });
  const totalSpentAgg = await Trip.aggregate([
    { $match: { user: objectId } },
    { $group: { _id: null, total: { $sum: "$travel_cost" } } }
  ]);
  const totalSpent = totalSpentAgg[0]?.total || 0;

  return { trips, incidents, reviews, totalSpent };
}
