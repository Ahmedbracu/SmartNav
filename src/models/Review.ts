import mongoose, { Document, Model } from "mongoose";

export interface IReview extends Document {
  user: mongoose.Types.ObjectId;
  transport: mongoose.Types.ObjectId;
  route?: mongoose.Types.ObjectId;
  rating: number;
  comment: string;
  timestamp: Date;
}

const ReviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  transport: { type: mongoose.Schema.Types.ObjectId, ref: "TransportMode", required: true },
  route: { type: mongoose.Schema.Types.ObjectId, ref: "Route" },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, default: "" },
  timestamp: { type: Date, default: Date.now }
});

const Review: Model<IReview> = mongoose.models.Review || mongoose.model<IReview>("Review", ReviewSchema);

export default Review;
