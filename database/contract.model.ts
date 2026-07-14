import type { ContractStatus } from '@/types';
import mongoose, { Document, Schema } from 'mongoose';
import './client.model';

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
  currency: string;
  // ── Recurring service / renewal fields ─────────────────────
  isRecurring: boolean;
  renewalDate?: Date;
  renewalPeriodMonths?: number; // 1, 3, 6, 12, 24, 36
  renewalNotificationDays: number; // days before renewalDate to notify (default 30)
  lastRenewalNotificationAt?: Date;
  // ────────────────────────────────────────────────────────────
  deletedAt?: Date;
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
        // Hosting & Domain recurring services
        'hosting_annual',
        'hosting_biennial',
        'hosting_triennial',
        'domain',
        'hosting_domain',
        // Diseño personalizado
        'custom_design',
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
    currency: { type: String, default: 'USD' },
    // ── Recurring / renewal ───────────────────────────────────
    isRecurring: { type: Boolean, default: false },
    renewalDate: { type: Date },
    renewalPeriodMonths: { type: Number, min: 1 },
    renewalNotificationDays: { type: Number, default: 30, min: 1 },
    lastRenewalNotificationAt: { type: Date },
    // ─────────────────────────────────────────────────────────
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true },
);

// Performance indexes
ContractSchema.index({ clientId: 1 });
ContractSchema.index({ status: 1 });
ContractSchema.index({ createdAt: -1 });
ContractSchema.index({ deletedAt: 1 });
ContractSchema.index({ isRecurring: 1, renewalDate: 1 }); // for cron query

const Contract =
  mongoose.models.Contract ||
  mongoose.model<IContractDoc>('Contract', ContractSchema, 'dualgrid_contracts');

export default Contract;
