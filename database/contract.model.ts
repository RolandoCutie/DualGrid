import type { ContractStatus } from '@/types';
import mongoose, { Document, Schema } from 'mongoose';

export interface IContractDoc extends Document {
  clientId: mongoose.Types.ObjectId;
  planId: string;
  services: Array<{ name: string; description: string; price: number }>;
  totalAmount: number;
  advanceAmount: number;
  paidAmount: number;
  status: ContractStatus;
  startDate: Date;
  deliveryDate: Date;
  revisionsIncluded: number;
  revisionsUsed: number;
  excludedItems: string[];
  contractTerms?: string;
  notes?: string;
  signedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ServiceSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, default: '' },
    price: { type: Number, required: true, min: 0 },
  },
  { _id: false },
);

const ContractSchema = new Schema<IContractDoc>(
  {
    clientId: { type: Schema.Types.ObjectId, ref: 'Client', required: true },
    planId: {
      type: String,
      enum: [
        'landing',
        'portfolio',
        'menu_qr',
        'restaurant',
        'wp_business',
        'ecommerce_store',
        'blog',
        'custom',
        'essential',
        'corporate',
        'global',
      ],
      required: true,
    },
    services: [ServiceSchema],
    totalAmount: { type: Number, required: true, min: 0 },
    advanceAmount: { type: Number, required: true, min: 0 },
    paidAmount: { type: Number, default: 0, min: 0 },
    status: {
      type: String,
      enum: ['draft', 'pending', 'active', 'completed', 'cancelled'],
      default: 'draft',
    },
    startDate: { type: Date, required: true },
    deliveryDate: { type: Date, required: true },
    revisionsIncluded: { type: Number, default: 0, min: 0 },
    revisionsUsed: { type: Number, default: 0, min: 0 },
    excludedItems: [{ type: String }],
    contractTerms: { type: String },
    notes: { type: String },
    signedAt: { type: Date },
  },
  { timestamps: true },
);

const Contract =
  mongoose.models.Contract ||
  mongoose.model<IContractDoc>('Contract', ContractSchema, 'dualgrid_contracts');

export default Contract;
