import mongoose, { Schema, Document } from 'mongoose';

export interface ITrip extends Document {
  user: mongoose.Types.ObjectId;
  route: mongoose.Types.ObjectId;
  travel_time: number;
  travel_cost: number;
  trip_date: Date;
}

const TripSchema: Schema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  route: { type: Schema.Types.ObjectId, ref: 'Route', required: true },
  travel_time: { type: Number, required: true },
  travel_cost: { type: Number, required: true },
  trip_date: { type: Date, default: Date.now },
});

export default mongoose.models.Trip || mongoose.model<ITrip>('Trip', TripSchema);
