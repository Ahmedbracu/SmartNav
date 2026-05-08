import mongoose, { Schema, Document } from 'mongoose';

export interface IRouteSegment {
  transport: mongoose.Types.ObjectId; // References TransportMode
  start_location: mongoose.Types.ObjectId; // References Location
  end_location: mongoose.Types.ObjectId;
  distance: number;
  time: number;
  cost: number;
}

export interface IRoute extends Document {
  source_location: mongoose.Types.ObjectId;
  destination_location: mongoose.Types.ObjectId;
  total_distance: number;
  estimated_time: number;
  estimated_cost: number;
  segments: IRouteSegment[];
}

const RouteSegmentSchema = new Schema({
  transport: { type: Schema.Types.ObjectId, ref: 'TransportMode', required: true },
  start_location: { type: Schema.Types.ObjectId, ref: 'Location', required: true },
  end_location: { type: Schema.Types.ObjectId, ref: 'Location', required: true },
  distance: { type: Number, required: true },
  time: { type: Number, required: true },
  cost: { type: Number, required: true },
});

const RouteSchema: Schema = new Schema({
  source_location: { type: Schema.Types.ObjectId, ref: 'Location', required: true },
  destination_location: { type: Schema.Types.ObjectId, ref: 'Location', required: true },
  total_distance: { type: Number, required: true },
  estimated_time: { type: Number, required: true },
  estimated_cost: { type: Number, required: true },
  segments: [RouteSegmentSchema], // Embedded subdocuments
});

export default mongoose.models.Route || mongoose.model<IRoute>('Route', RouteSchema);
