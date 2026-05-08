import mongoose, { Schema, Document } from 'mongoose';

export interface ITraffic extends Document {
  location: mongoose.Types.ObjectId;
  congestion_level: 'Gridlock' | 'Heavy' | 'Moderate' | 'Light';
  avg_speed: number;
  date: Date;
  time_slot: string;
}

const TrafficSchema: Schema = new Schema({
  location: { type: Schema.Types.ObjectId, ref: 'Location', required: true },
  congestion_level: { type: String, enum: ['Gridlock', 'Heavy', 'Moderate', 'Light'], required: true },
  avg_speed: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  time_slot: { type: String, required: true }, // e.g. "08:00-09:00"
});

export default mongoose.models.Traffic || mongoose.model<ITraffic>('Traffic', TrafficSchema);
