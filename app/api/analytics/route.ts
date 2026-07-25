import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { getAdminSession } from '@/lib/auth';

export async function GET(request: NextRequest) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }

  const supabase = createAdminClient();

  const { data: appsRaw, error } = await supabase
    .from('applicants')
    .select('status, college, current_year, created_at')
    .order('created_at', { ascending: true });

  if (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }

  // Cast to any[] — Supabase TS types can't infer partial column selects
  const allApps = (appsRaw || []) as any[];

  // Status distribution
  const statusCounts = allApps.reduce<Record<string, number>>((acc, a) => {
    acc[a.status] = (acc[a.status] || 0) + 1;
    return acc;
  }, {});

  // Applications per month
  const monthlyMap: Record<string, number> = {};
  allApps.forEach((a) => {
    const month = a.created_at.slice(0, 7);
    monthlyMap[month] = (monthlyMap[month] || 0) + 1;
  });
  const monthly = Object.entries(monthlyMap)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, count]) => ({ month, count }));

  // Top colleges
  const collegeMap: Record<string, number> = {};
  allApps.forEach((a) => {
    if (a.college) collegeMap[a.college] = (collegeMap[a.college] || 0) + 1;
  });
  const topColleges = Object.entries(collegeMap)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([college, count]) => ({ college, count }));

  // Year distribution
  const yearMap: Record<string, number> = {};
  allApps.forEach((a) => {
    if (a.current_year) {
      const yr = `Year ${a.current_year}`;
      yearMap[yr] = (yearMap[yr] || 0) + 1;
    }
  });

  return NextResponse.json({
    success: true,
    data: {
      total: allApps.length,
      statusDistribution: statusCounts,
      monthly,
      topColleges,
      yearDistribution: Object.entries(yearMap).map(([year, count]) => ({ year, count })),
    },
  });
}
