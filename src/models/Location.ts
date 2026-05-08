import mongoose, { Schema, Document } from 'mongoose';

export interface ILocation extends Document {
  name: string;
  latitude: number;
  longitude: number;
  area_zone: string;
}

const LocationSchema: Schema = new Schema({
  name: { type: String, required: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  area_zone: { type: String, required: true },
});

export default mongoose.models.Location || mongoose.model<ILocation>('Location', LocationSchema);
