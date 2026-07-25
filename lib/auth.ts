import { cookies } from 'next/headers';
import { AdminSession } from '@/types/admin';

export const SESSION_COOKIE_NAME = 'hiring_admin_session';
export const SESSION_MAX_AGE = 60 * 60 * 8; // 8 hours

export async function getAdminSession(): Promise<AdminSession | null> {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME);

    if (!sessionCookie?.value) return null;

    const session = JSON.parse(
      Buffer.from(sessionCookie.value, 'base64').toString('utf-8')
    ) as AdminSession;

    return session;
  } catch {
    return null;
  }
}

export function encodeSession(session: AdminSession): string {
  return Buffer.from(JSON.stringify(session)).toString('base64');
}

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
