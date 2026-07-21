import type { BusinessType } from '@/types';
import mongoose, { Document, Schema } from 'mongoose';

export type ClientStatus = 'prospect' | 'active' | 'inactive' | 'churned';

export interface IClientDoc extends Document {
  name: string;
  email: string;
  phone: string;
  businessName?: string;
  businessType?: BusinessType;
  notes?: string;
  // Extended CRM fields
  status: ClientStatus;
  website?: string;
  instagram?: string;
  facebook?: string;
  twitter?: string;
  linkedin?: string;
  tiktok?: string;
  youtube?: string;
  city?: string;
  country?: string;
  referralSource?: string;
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
    // Extended CRM fields
    status: {
      type: String,
      enum: ['prospect', 'active', 'inactive', 'churned'],
      default: 'prospect',
    },
    website: { type: String, trim: true },
    instagram: { type: String, trim: true },
    facebook: { type: String, trim: true },
    twitter: { type: String, trim: true },
    linkedin: { type: String, trim: true },
    tiktok: { type: String, trim: true },
    youtube: { type: String, trim: true },
    city: { type: String, trim: true },
    country: { type: String, trim: true },
    referralSource: { type: String, trim: true },
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
