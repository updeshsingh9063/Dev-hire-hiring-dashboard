import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { getAdminSession } from '@/lib/auth';
import { APPLICATION_STATUSES } from '@/lib/utils';

type Params = { params: Promise<{ id: string }> };

// GET /api/applicants/[id]
export async function GET(request: NextRequest, { params }: Params) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from('applicants')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) {
    return NextResponse.json(
      { success: false, message: 'Applicant not found' },
      { status: 404 }
    );
  }

  const applicant = { ...(data as any) };
  if (applicant.resume_url) {
    const { data: signed } = await supabase.storage
      .from('resumes')
      .createSignedUrl(applicant.resume_url, 60 * 15);
    applicant.resume_url = signed?.signedUrl || '';
  }

  return NextResponse.json({ success: true, data: applicant });
}

// PATCH /api/applicants/[id] — update status
export async function PATCH(request: NextRequest, { params }: Params) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const { status } = await request.json();

  if (!APPLICATION_STATUSES.includes(status)) {
    return NextResponse.json(
      { success: false, message: 'Invalid status' },
      { status: 400 }
    );
  }

  const supabase = createAdminClient();
  const { data, error } = await (supabase.from('applicants') as any)
    .update({ status: status as string })
    .eq('id', id)
    .select('id, status')
    .single();

  if (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, data });
}

// DELETE /api/applicants/[id]
export async function DELETE(request: NextRequest, { params }: Params) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const supabase = createAdminClient();

  // Get file URLs before deleting
  const { data: applicant } = await supabase
    .from('applicants')
    .select('resume_url, profile_picture_url')
    .eq('id', id)
    .single();

  // Delete from DB
  const { error } = await supabase
    .from('applicants')
    .delete()
    .eq('id', id);

  if (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }

  // Clean up storage files (non-critical)
  if (applicant) {
    const app = applicant as any;
    const extractPath = (url: string) => {
      try {
        const u = new URL(url);
        const parts = u.pathname.split('/');
        return parts.slice(parts.indexOf('object') + 2).join('/');
      } catch { return null; }
    };

    if (app.resume_url) {
      const path = extractPath(app.resume_url);
      if (path) await supabase.storage.from('resumes').remove([path]);
    }
    if (app.profile_picture_url) {
      const path = extractPath(app.profile_picture_url);
      if (path) await supabase.storage.from('avatars').remove([path]);
    }
  }

  return NextResponse.json({ success: true, message: 'Applicant deleted' });
}
