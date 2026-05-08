import mongoose, { Schema, Document } from 'mongoose';

export interface ITransportMode extends Document {
  type: string; // e.g. Bus, Metro, CNG
  base_fare: number;
  cost_per_km: number;
  average_speed: number;
  time_multiplier: number;
}

const TransportModeSchema: Schema = new Schema({
  type: { type: String, required: true, unique: true },
  base_fare: { type: Number, required: true },
  cost_per_km: { type: Number, required: true },
  average_speed: { type: Number, required: true },
  time_multiplier: { type: Number, required: true, default: 1.0 },
});

export default mongoose.models.TransportMode || mongoose.model<ITransportMode>('TransportMode', TransportModeSchema);
