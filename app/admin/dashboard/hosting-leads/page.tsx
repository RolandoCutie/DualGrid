import AdminBackButton from '@/components/admin/AdminBackButton';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import AdminPageLayout from '@/components/admin/AdminPageLayout';
import HostingLeadListClient, {
  type HostingLeadRow,
} from '@/components/admin/HostingLeadListClient';
import HostingLead from '@/database/hosting-lead.model';
import connectDB from '@/lib/mongodb';
import { requireAdminSession } from '@/lib/require-admin-session';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Leads de Hosting' };

export default async function HostingLeadsPage() {
  await requireAdminSession('/admin/dashboard/hosting-leads');
  await connectDB();

  const raw = await HostingLead.find({ deletedAt: null }).sort({ createdAt: -1 }).lean();

  const newCount = raw.filter((r) => r.status === 'new').length;

  const leads: HostingLeadRow[] = raw.map((r) => ({
    _id: String(r._id),
    fullName: String(r.fullName),
    email: String(r.email),
    phone: r.phone ? String(r.phone) : '',
    hasWebsite: Boolean(r.hasWebsite),
    hasDomain: Boolean(r.hasDomain),
    planId: String(r.planId),
    notes: r.notes ? String(r.notes) : undefined,
    status: String(r.status),
    adminNotes: r.adminNotes ? String(r.adminNotes) : undefined,
    createdAt: String(r.createdAt),
  }));

  return (
    <AdminPageLayout>
      <AdminBackButton href="/admin/dashboard" />
      <AdminPageHeader
        title="Solicitudes de Hosting"
        description={`${raw.length} solicitudes totales · ${newCount} nuevas sin contactar`}
      />
      <div className="mt-6">
        <HostingLeadListClient leads={leads} />
      </div>
    </AdminPageLayout>
  );
}
