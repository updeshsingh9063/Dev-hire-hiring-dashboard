import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { getAdminSession } from '@/lib/auth';

export async function GET(request: NextRequest) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const search = searchParams.get('search') || '';
  const status = searchParams.get('status') || '';
  const sortBy = searchParams.get('sortBy') || 'created_at';
  const sortOrder = searchParams.get('sortOrder') || 'desc';
  const page = parseInt(searchParams.get('page') || '1');
  const perPage = parseInt(searchParams.get('perPage') || '10');

  const supabase = createAdminClient();

  let query = supabase
    .from('applicants')
    .select('*', { count: 'exact' });

  if (search) {
    query = query.or(`full_name.ilike.%${search}%,email.ilike.%${search}%,college.ilike.%${search}%`);
  }
  if (status) {
    query = query.eq('status', status);
  }

  const validSortColumns = ['created_at', 'full_name', 'college', 'status'];
  const safeSortBy = validSortColumns.includes(sortBy) ? sortBy : 'created_at';
  query = query.order(safeSortBy, { ascending: sortOrder === 'asc' });

  const from = (page - 1) * perPage;
  const to = from + perPage - 1;
  query = query.range(from, to);

  const { data, error, count } = await query;

  if (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }

  return NextResponse.json({
    success: true,
    data: data || [],
    total: count || 0,
    page,
    perPage,
    totalPages: Math.ceil((count || 0) / perPage),
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      full_name, email, phone, whatsapp, city,
      college, university, degree, branch, current_year, graduation_year,
      github, linkedin, portfolio,
      about,
      project_name, tech_stack, project_description, explain_contribution,
      resume_url, resume_file_name, profile_picture_url,
    } = body;

    if (!resume_url || !resume_file_name) {
      return NextResponse.json({ success: false, message: 'Resume is required' }, { status: 400 });
    }

    const supabase = createAdminClient();

    const { data, error } = await (supabase.from('applicants') as any)
      .insert({
        full_name,
        email,
        phone,
        whatsapp,
        city,
        college,
        university,
        degree,
        branch,
        current_year: parseInt(current_year),
        graduation_year: parseInt(graduation_year),
        github,
        linkedin,
        portfolio,
        about,
        project_name,
        tech_stack,
        project_description,
        explain_contribution,
        resume_url,
        profile_picture_url: profile_picture_url || null,
        status: 'Pending',
      })
      .select('id')
      .single();

    if (error) {
      console.error('Insert error:', error);
      return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Application submitted successfully!',
      id: data.id,
    });
  } catch (error) {
    console.error('Application submission error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
