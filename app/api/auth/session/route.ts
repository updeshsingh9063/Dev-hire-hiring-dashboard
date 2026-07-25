import { NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/auth';

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ email: null }, { status: 401 });
  }
  return NextResponse.json({ email: session.email, id: session.id });
}
