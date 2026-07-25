import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { createAdminClient } from '@/lib/supabase/admin';
import { loginSchema } from '@/lib/validations/authSchema';
import { encodeSession, SESSION_COOKIE_NAME, SESSION_MAX_AGE } from '@/lib/auth';

// ─── DEV BYPASS ───────────────────────────────────────────────
// Allows logging in without a connected Supabase instance.
// Remove or disable this block before deploying to production.
const DEV_ADMIN_EMAIL = 'admin@devhire.com';
const DEV_ADMIN_PASSWORD = 'admin1234';
const IS_DEV = process.env.NODE_ENV === 'development';
// ──────────────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: 'Invalid email or password format' },
        { status: 400 }
      );
    }

    const { email, password } = parsed.data;

    // ── DEV BYPASS: skip DB lookup in development ──
    if (IS_DEV && email === DEV_ADMIN_EMAIL && password === DEV_ADMIN_PASSWORD) {
      const session = { id: 'dev-admin-id', email: DEV_ADMIN_EMAIL };
      const encodedSession = encodeSession(session);
      const response = NextResponse.json({ success: true, message: 'Login successful (dev)', admin: session });
      response.cookies.set(SESSION_COOKIE_NAME, encodedSession, {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        maxAge: SESSION_MAX_AGE,
        path: '/',
      });
      return response;
    }

    // ── PRODUCTION: query from Supabase DB ──
    const supabase = createAdminClient();
    const { data: admin, error } = await supabase
      .from('admins')
      .select('id, email, password_hash')
      .eq('email', email.toLowerCase().trim())
      .single();

    if (error || !admin) {
      return NextResponse.json(
        { success: false, message: 'Invalid email or password' },
        { status: 401 }
      );
    }

    const adm = admin as any;
    const isValid = await bcrypt.compare(password, adm.password_hash);
    if (!isValid) {
      return NextResponse.json(
        { success: false, message: 'Invalid email or password' },
        { status: 401 }
      );
    }

    const session = { id: adm.id, email: adm.email };
    const encodedSession = encodeSession(session);
    const response = NextResponse.json({ success: true, message: 'Login successful', admin: session });
    response.cookies.set(SESSION_COOKIE_NAME, encodedSession, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: SESSION_MAX_AGE,
      path: '/',
    });
    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
