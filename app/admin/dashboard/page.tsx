'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDate, APPLICATION_STATUSES } from '@/lib/utils';
import { Users, Clock, CalendarCheck, CheckCircle2, XCircle, ListFilter, TrendingUp, Trash2 } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [recent, setRecent] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      const [a, b] = await Promise.all([
        fetch('/api/analytics'),
        fetch('/api/applicants?perPage=5&sortBy=created_at&sortOrder=desc'),
      ]);
      const analytics = await a.json();
      const applicants = await b.json();

      setStats(analytics.data);
      setRecent(applicants.data || []);
    } catch {}
    finally { setLoading(false); }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete ${name}'s application? This cannot be undone.`)) return;
    try {
      const res = await fetch(`/api/applicants/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) { 
        toast.success('Deleted'); 
        fetchDashboardData(); 
      }
      else toast.error(data.message);
    } catch { toast.error('Delete failed'); }
  };

  const handleStatusChange = async (id: string, status: string) => {
    try {
      const res = await fetch(`/api/applicants/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Status updated');
        setRecent((prev) => prev.map((a) => a.id === id ? { ...a, status } : a));
        // Refresh analytics as well since status changed
        fetch('/api/analytics').then(r => r.json()).then(analytics => setStats(analytics.data));
      }
    } catch { toast.error('Update failed'); }
  };

  const statCards = [
    { label: 'Total', value: stats?.total ?? 0, icon: Users, color: '#8B0000', light: '#FFF0F0' },
    { label: 'Pending', value: stats?.statusDistribution?.['Pending'] ?? 0, icon: Clock, color: '#C2410C', light: '#FFF7ED' },
    { label: 'Interview', value: stats?.statusDistribution?.['Interview Scheduled'] ?? 0, icon: CalendarCheck, color: '#6D28D9', light: '#F5F3FF' },
    { label: 'Selected', value: stats?.statusDistribution?.['Selected'] ?? 0, icon: CheckCircle2, color: '#15803D', light: '#F0FDF4' },
    { label: 'Rejected', value: stats?.statusDistribution?.['Rejected'] ?? 0, icon: XCircle, color: '#9F1239', light: '#FFF1F2' },
  ];

  const statusClass: Record<string, string> = {
    'Pending': 'badge-pending',
    'Shortlisted': 'badge-short',
    'Interview Scheduled': 'badge-interview',
    'Selected': 'badge-selected',
    'Rejected': 'badge-rejected',
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-[#8B0000] mb-1">Overview</p>
          <h1 className="text-3xl font-black text-[#111111] uppercase tracking-tight">Dashboard</h1>
        </div>
        <Link href="/admin/applicants" className="btn-secondary flex items-center gap-2 text-xs px-4 py-2 self-start sm:self-auto">
          <ListFilter className="w-3.5 h-3.5" /> All Applicants
        </Link>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {loading
          ? Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-28 bg-[#E4E4E7]" />
            ))
          : statCards.map((card, i) => (
              <div
                key={i}
                className="bg-white border-2 border-[#111111] p-5"
                style={{ boxShadow: '4px 4px 0 0 rgba(0,0,0,0.75)' }}
              >
                <div
                  className="w-9 h-9 flex items-center justify-center mb-3 border-2 border-[#111111]"
                  style={{ background: card.light, boxShadow: '2px 2px 0 0 rgba(0,0,0,0.6)' }}
                >
                  <card.icon className="w-4 h-4" style={{ color: card.color }} />
                </div>
                <div className="text-3xl font-black text-[#111111]">{card.value}</div>
                <div className="text-xs font-bold uppercase tracking-widest text-[#71717A] mt-1">{card.label}</div>
              </div>
            ))}
      </div>

      {/* Recent Applications */}
      <div
        className="bg-white border-2 border-[#111111] overflow-hidden"
        style={{ boxShadow: '4px 4px 0 0 rgba(0,0,0,0.75)' }}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b-4 border-[#8B0000] bg-[#FFF8F8]">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-[#8B0000]" />
            <h2 className="font-black text-[#111111] uppercase tracking-wider text-sm">Recent Applications</h2>
          </div>
          <Link href="/admin/applicants" className="text-xs font-bold uppercase tracking-wider text-[#8B0000] hover:underline">
            View All →
          </Link>
        </div>

        {loading ? (
          <div className="p-6 space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-14 bg-[#F4F4F5]" />
            ))}
          </div>
        ) : recent.length === 0 ? (
          <div className="p-12 text-center text-[#71717A] font-bold uppercase tracking-wider text-sm">
            No applications yet
          </div>
        ) : (
          <div className="divide-y-2 divide-[#F4F4F5]">
            {recent.map((app) => (
              <div key={app.id} className="flex flex-col sm:flex-row sm:items-center justify-between px-6 py-4 hover:bg-[#F9F9F9] transition-colors gap-4">
                <div className="flex items-center gap-4">
                  {/* Avatar square */}
                  <div
                    className="w-10 h-10 bg-[#8B0000] flex items-center justify-center border-2 border-[#111111] shrink-0 overflow-hidden"
                    style={{ boxShadow: '2px 2px 0 0 rgba(0,0,0,0.6)' }}
                  >
                    {app.profile_picture_url ? (
                      <img src={app.profile_picture_url} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-white font-black text-sm">
                        {app.full_name?.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div>
                    <Link href={`/admin/applicants/${app.id}`} className="font-bold text-[#111111] hover:text-[#8B0000] text-sm uppercase tracking-wide">
                      {app.full_name}
                    </Link>
                    <p className="text-xs text-[#71717A] font-medium">{app.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 sm:gap-5 justify-between sm:justify-end w-full sm:w-auto">
                  <select
                    value={app.status}
                    onChange={(e) => handleStatusChange(app.id, e.target.value)}
                    className="input-field py-1 px-2 text-xs font-bold uppercase tracking-wide w-auto"
                    style={{ minWidth: 130 }}
                  >
                    {APPLICATION_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <span className="text-xs text-[#71717A] font-bold hidden sm:block">{formatDate(app.created_at)}</span>
                  <button
                    onClick={() => handleDelete(app.id, app.full_name)}
                    className="btn-icon btn-icon-danger"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
