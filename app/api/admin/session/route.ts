import { ADMIN_SESSION_COOKIE, isAdminSessionTokenValid } from '@/lib/admin-auth';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const token = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;

  return NextResponse.json(
    {
      authenticated: isAdminSessionTokenValid(token),
    },
    { status: 200 },
  );
}
