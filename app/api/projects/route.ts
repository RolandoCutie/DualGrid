import Project from '@/database/project.model';
import connectDB from '@/lib/mongodb';
import { NextResponse } from 'next/server';

// Public route — no auth required
export async function GET() {
  await connectDB();
  const projects = await Project.find({}).sort({ order: 1, createdAt: -1 }).lean();
  return NextResponse.json(projects);
}
