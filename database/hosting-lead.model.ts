import mongoose, { Document, Schema } from 'mongoose';

export type HostingPlanId = 'annual' | 'biennial' | 'triennial' | 'domain_only' | 'hosting_domain';
export type HostingLeadStatus = 'new' | 'contacted' | 'converted';

export interface IHostingLeadDoc extends Document {
  fullName: string;
  email: string;
  phone: string;
  hasWebsite: boolean;
  hasDomain: boolean;
  planId: HostingPlanId;
  notes?: string;
  status: HostingLeadStatus;
  adminNotes?: string;
  deletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const HostingLeadSchema = new Schema<IHostingLeadDoc>(
  {
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, trim: true, default: '' },
    hasWebsite: { type: Boolean, required: true },
    hasDomain: { type: Boolean, required: true },
    planId: {
      type: String,
      required: true,
      enum: ['annual', 'biennial', 'triennial', 'domain_only', 'hosting_domain'],
    },
    notes: { type: String, trim: true },
    status: {
      type: String,
      enum: ['new', 'contacted', 'converted'],
      default: 'new',
    },
    adminNotes: { type: String },
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true },
);

HostingLeadSchema.index({ status: 1 });
HostingLeadSchema.index({ createdAt: -1 });
HostingLeadSchema.index({ deletedAt: 1 });

const HostingLead =
  mongoose.models.HostingLead ||
  mongoose.model<IHostingLeadDoc>('HostingLead', HostingLeadSchema, 'dualgrid_hosting_leads');

export default HostingLead;
