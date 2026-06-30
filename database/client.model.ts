import type { BusinessType } from '@/types';
import mongoose, { Document, Schema } from 'mongoose';

export interface IClientDoc extends Document {
  name: string;
  email: string;
  phone: string;
  businessName?: string;
  businessType?: BusinessType;
  notes?: string;
  deletedAt?: Date;
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
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true },
);

// Performance indexes
ClientSchema.index({ createdAt: -1 });
ClientSchema.index({ email: 1 });
ClientSchema.index({ deletedAt: 1 });

const Client =
  mongoose.models.Client || mongoose.model<IClientDoc>('Client', ClientSchema, 'dualgrid_clients');

export default Client;
