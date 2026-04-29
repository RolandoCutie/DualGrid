import type { ContractStatus, PlanId } from '@/types';
import mongoose, { Document, Schema } from 'mongoose';

export interface IContractDoc extends Document {
  clientId: mongoose.Types.ObjectId;
  planId: PlanId;
  services: Array<{ name: string; description: string; price: number }>;
  totalAmount: number;
  advanceAmount: number;
  status: ContractStatus;
  startDate: Date;
  deliveryDate: Date;
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
      enum: ['landing', 'portfolio', 'menu_qr', 'restaurant', 'custom'],
      required: true,
    },
    services: [ServiceSchema],
    totalAmount: { type: Number, required: true, min: 0 },
    advanceAmount: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: ['draft', 'pending', 'active', 'completed', 'cancelled'],
      default: 'draft',
    },
    startDate: { type: Date, required: true },
    deliveryDate: { type: Date, required: true },
    notes: { type: String },
    signedAt: { type: Date },
  },
  { timestamps: true },
);

const Contract =
  mongoose.models.Contract ||
  mongoose.model<IContractDoc>('Contract', ContractSchema, 'dualgrid_contracts');

export default Contract;
