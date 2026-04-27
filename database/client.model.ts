import type { BusinessType } from '@/types';
import mongoose, { Document, Schema } from 'mongoose';

export interface IClientDoc extends Document {
  name: string;
  email: string;
  phone: string;
  businessName?: string;
  businessType?: BusinessType;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ClientSchema = new Schema<IClientDoc>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, trim: true, default: '' },
    businessName: { type: String, trim: true },
    businessType: {
      type: String,
      enum: ['creative', 'restaurant', 'entrepreneur', 'professional', 'ecommerce', 'other'],
    },
    notes: { type: String },
  },
  { timestamps: true },
);

const Client = mongoose.models.Client || mongoose.model<IClientDoc>('Client', ClientSchema);

export default Client;
