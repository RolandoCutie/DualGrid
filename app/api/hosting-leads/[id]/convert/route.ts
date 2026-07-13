import Client from '@/database/client.model';
import HostingLead from '@/database/hosting-lead.model';
import { isAdminSessionTokenValid } from '@/lib/admin-auth';
import connectDB from '@/lib/mongodb';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

const PLAN_LABELS: Record<string, string> = {
  annual: 'Hosting Anual ($120 USD)',
  biennial: 'Hosting Bianual ($110 USD/año)',
  triennial: 'Hosting Trienal ($100 USD/año)',
  domain_only: 'Solo dominio ($25 USD/año)',
  hosting_domain: 'Hosting + Dominio',
};

/**
 * POST /api/hosting-leads/[id]/convert
 * Creates a Client record from a hosting lead and marks it as 'converted'.
 */
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const jar = await cookies();
  const token = jar.get('admin_session')?.value ?? '';
  if (!isAdminSessionTokenValid(token)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await connectDB();
  const { id } = await params;

  const lead = await HostingLead.findOne({ _id: id, deletedAt: null }).lean();
  if (!lead) {
    return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
  }

  // Check for duplicate email
  const existing = await Client.findOne({ email: lead.email }).lean();
  if (existing) {
    return NextResponse.json(
      {
        error: 'Ya existe un cliente con este email',
        clientId: String((existing as { _id: unknown })._id),
      },
      { status: 409 },
    );
  }

  const planLabel = PLAN_LABELS[lead.planId] ?? lead.planId;
  const notesExtra = [
    `Plan de hosting solicitado: ${planLabel}`,
    lead.hasWebsite ? 'Tiene sitio web actualmente.' : 'No tiene sitio web actualmente.',
    lead.hasDomain ? 'Tiene dominio propio.' : 'No tiene dominio propio.',
    lead.notes ? `Notas del cliente: ${lead.notes}` : '',
  ]
    .filter(Boolean)
    .join(' | ');

  const client = await Client.create({
    name: lead.fullName,
    email: lead.email,
    phone: lead.phone || '',
    notes: notesExtra,
  });

  // Mark lead as converted
  await HostingLead.findByIdAndUpdate(id, { $set: { status: 'converted' } });

  return NextResponse.json({ clientId: client._id.toString() }, { status: 201 });
}
