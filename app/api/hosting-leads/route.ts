import HostingLead from '@/database/hosting-lead.model';
import { isAdminSessionTokenValid } from '@/lib/admin-auth';
import connectDB from '@/lib/mongodb';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const HostingLeadSubmitSchema = z.object({
  fullName: z.string().min(1, 'El nombre es requerido').max(200),
  email: z.string().email('Email inválido'),
  phone: z.string().max(30).optional().default(''),
  hasWebsite: z.boolean(),
  hasDomain: z.boolean(),
  planId: z.enum(['annual', 'biennial', 'triennial', 'domain_only', 'hosting_domain']),
  notes: z.string().max(500).optional(),
});

// POST — public submission from landing page
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = HostingLeadSubmitSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues }, { status: 422 });
    }
    await connectDB();
    const lead = await HostingLead.create(parsed.data);
    return NextResponse.json({ id: lead._id.toString() }, { status: 201 });
  } catch (err) {
    console.error('[hosting-leads POST]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// GET — admin list with pagination
export async function GET(req: NextRequest) {
  const token = req.cookies.get('admin_session')?.value;
  if (!token || !isAdminSessionTokenValid(token)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = req.nextUrl;
  const page = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10));
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') ?? '50', 10)));
  const skip = (page - 1) * limit;

  await connectDB();
  const [leads, total] = await Promise.all([
    HostingLead.find({ deletedAt: null }).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    HostingLead.countDocuments({ deletedAt: null }),
  ]);
  return NextResponse.json({ data: leads, total, page, limit });
}
