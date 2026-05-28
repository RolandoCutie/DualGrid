import type { InvoiceStatus } from '@/types';
import mongoose, { Document, Schema } from 'mongoose';

export type PaymentMethod = 'cash' | 'bank_transfer' | 'paypal' | 'card' | 'crypto' | 'other';

export interface IInvoiceDoc extends Document {
  invoiceNumber: string;
  clientId: mongoose.Types.ObjectId;
  contractId?: mongoose.Types.ObjectId;
  items: Array<{ description: string; quantity: number; unitPrice: number; total: number }>;
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  totalAmount: number;
  status: InvoiceStatus;
  issueDate: Date;
  dueDate: Date;
  paidAt?: Date;
  paymentMethod?: PaymentMethod;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const InvoiceItemSchema = new Schema(
  {
    description: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    unitPrice: { type: Number, required: true, min: 0 },
    total: { type: Number, required: true, min: 0 },
  },
  { _id: false },
);

const InvoiceSchema = new Schema<IInvoiceDoc>(
  {
    invoiceNumber: { type: String, required: true, unique: true },
    clientId: { type: Schema.Types.ObjectId, ref: 'Client', required: true },
    contractId: { type: Schema.Types.ObjectId, ref: 'Contract' },
    items: [InvoiceItemSchema],
    subtotal: { type: Number, required: true, min: 0 },
    taxRate: { type: Number, default: 0, min: 0, max: 100 },
    taxAmount: { type: Number, default: 0 },
    totalAmount: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: ['draft', 'sent', 'paid', 'overdue', 'cancelled'],
      default: 'draft',
    },
    issueDate: { type: Date, required: true },
    dueDate: { type: Date, required: true },
    paidAt: { type: Date },
    paymentMethod: {
      type: String,
      enum: ['cash', 'bank_transfer', 'paypal', 'card', 'crypto', 'other'],
    },
    notes: { type: String },
  },
  { timestamps: true },
);

const Invoice =
  mongoose.models.Invoice ||
  mongoose.model<IInvoiceDoc>('Invoice', InvoiceSchema, 'dualgrid_invoices');

export default Invoice;
