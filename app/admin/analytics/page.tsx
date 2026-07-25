'use client';

import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { TrendingUp, Building2 } from 'lucide-react';

export default function AnalyticsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/analytics');
        const json = await res.json();
        setData(json.data);
      } catch {}
      finally { setLoading(false); }
    })();
  }, []);

  const formatMonth = (m: string) => {
    const [y, mo] = m.split('-');
    return new Date(parseInt(y), parseInt(mo) - 1).toLocaleString('default', { month: 'short' });
  };

  const ChartCard = ({ title, icon: Icon, children }: { title: string; icon: any; children: React.ReactNode }) => (
    <div
      className="bg-white border-2 border-[#111111]"
      style={{ boxShadow: '4px 4px 0 0 rgba(0,0,0,0.75)' }}
    >
      <div className="flex items-center gap-2 px-6 py-4 border-b-4 border-[#8B0000] bg-[#FFF8F8]">
        <Icon className="w-4 h-4 text-[#8B0000]" />
        <h2 className="font-black text-[#111111] uppercase tracking-wider text-xs">{title}</h2>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-[#8B0000] mb-1">Reports</p>
        <h1 className="text-3xl font-black text-[#111111] uppercase tracking-tight">Analytics</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ChartCard title="Applications per Month" icon={TrendingUp}>
          {loading ? (
            <Skeleton className="h-[260px] w-full bg-[#F4F4F5]" />
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={data?.monthly?.map((m: any) => ({ ...m, month: formatMonth(m.month) })) || []}>
                <CartesianGrid strokeDasharray="2 4" vertical={false} stroke="#E4E4E7" />
                <XAxis dataKey="month" stroke="#71717A" fontSize={11} fontWeight={700} tickLine={false} axisLine={false} />
                <YAxis stroke="#71717A" fontSize={11} fontWeight={700} tickLine={false} axisLine={false} />
                <Tooltip
                  cursor={{ fill: '#FFF0F0' }}
                  contentStyle={{ border: '2px solid #111', borderRadius: 0, boxShadow: '3px 3px 0 rgba(0,0,0,0.7)', fontWeight: 700 }}
                />
                <Bar dataKey="count" radius={0}>
                  {(data?.monthly || []).map((_: any, i: number) => (
                    <Cell key={i} fill="#8B0000" />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </ChartCard>

        <ChartCard title="Top Colleges" icon={Building2}>
          {loading ? (
            <Skeleton className="h-[260px] w-full bg-[#F4F4F5]" />
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart
                data={data?.topColleges?.slice(0, 6) || []}
                layout="vertical"
                margin={{ left: 8 }}
              >
                <CartesianGrid strokeDasharray="2 4" horizontal={false} stroke="#E4E4E7" />
                <XAxis type="number" stroke="#71717A" fontSize={11} fontWeight={700} tickLine={false} axisLine={false} />
                <YAxis
                  type="category"
                  dataKey="college"
                  stroke="#71717A"
                  fontSize={10}
                  fontWeight={700}
                  tickLine={false}
                  axisLine={false}
                  width={110}
                />
                <Tooltip
                  cursor={{ fill: '#FFF0F0' }}
                  contentStyle={{ border: '2px solid #111', borderRadius: 0, boxShadow: '3px 3px 0 rgba(0,0,0,0.7)', fontWeight: 700 }}
                />
                <Bar dataKey="count" radius={0}>
                  {(data?.topColleges || []).map((_: any, i: number) => (
                    <Cell key={i} fill={i === 0 ? '#8B0000' : '#B91C1C'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </ChartCard>
      </div>
    </div>
  );
}
