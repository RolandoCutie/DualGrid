import Project from '@/database/project.model';
import { isAdminSessionTokenValid } from '@/lib/admin-auth';
import connectDB from '@/lib/mongodb';
import { NextRequest, NextResponse } from 'next/server';

// Admin-only: create project
export async function POST(req: NextRequest) {
  const token = req.cookies.get('admin_session')?.value;
  if (!token || !isAdminSessionTokenValid(token)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    await connectDB();
    const project = await Project.create(body);
    return NextResponse.json(project, { status: 201 });
  } catch (err) {
    console.error('[projects POST]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
