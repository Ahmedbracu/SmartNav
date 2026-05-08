import mongoose, { Schema, Document } from 'mongoose';

export interface IIncident extends Document {
  user: mongoose.Types.ObjectId;
  location: mongoose.Types.ObjectId;
  type: string;
  severity: 'High' | 'Medium' | 'Low';
  description: string;
  status: 'Active' | 'Resolved';
  reported_at: Date;
}

const IncidentSchema: Schema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  location: { type: Schema.Types.ObjectId, ref: 'Location', required: true },
  type: { type: String, required: true },
  severity: { type: String, enum: ['High', 'Medium', 'Low'], required: true },
  description: { type: String },
  status: { type: String, enum: ['Active', 'Resolved'], default: 'Active' },
  reported_at: { type: Date, default: Date.now },
});

export default mongoose.models.Incident || mongoose.model<IIncident>('Incident', IncidentSchema);
