import {
  ADMIN_SESSION_COOKIE,
  areAdminCredentialsValid,
  createAdminSessionToken,
  getAdminSessionMaxAge,
} from '@/lib/admin-auth';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { username, password } = (await request.json()) as {
      username?: string;
      password?: string;
    };

    const normalizedUsername = username?.trim() ?? '';
    const normalizedPassword = password?.trim() ?? '';

    if (!normalizedUsername || !normalizedPassword) {
      return NextResponse.json({ message: 'Username and password are required.' }, { status: 400 });
    }

    if (!areAdminCredentialsValid(normalizedUsername, normalizedPassword)) {
      return NextResponse.json({ message: 'Invalid credentials.' }, { status: 401 });
    }

    const token = createAdminSessionToken(normalizedUsername);
    const response = NextResponse.json({ message: 'Login successful.' }, { status: 200 });

    response.cookies.set({
      name: ADMIN_SESSION_COOKIE,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: getAdminSessionMaxAge(),
    });

    return response;
  } catch {
    return NextResponse.json({ message: 'Invalid request payload.' }, { status: 400 });
  }
}
