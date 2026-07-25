'use client';

import { useEffect, useState, useCallback } from 'react';
import { toast } from 'sonner';
import { 
  Search, SlidersHorizontal, Trash2, Download, 
  Mail, Phone, MapPin, Globe, Link2, GraduationCap, Code2, BookOpen, User 
} from 'lucide-react';
import { formatDate, formatDateRelative, APPLICATION_STATUSES } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

const STATUS_CLASS: Record<string, string> = {
  'Pending': 'badge-pending',
  'Shortlisted': 'badge-short',
  'Interview Scheduled': 'badge-interview',
  'Selected': 'badge-selected',
  'Rejected': 'badge-rejected',
};

const Section = ({ title, icon: Icon, children }: { title: string; icon: any; children: React.ReactNode }) => (
  <div className="bg-white border-2 border-[#111111]" style={{ boxShadow: '4px 4px 0 0 rgba(0,0,0,0.75)' }}>
    <div className="flex items-center gap-2 px-6 py-4 border-b-4 border-[#8B0000] bg-[#FFF8F8]">
      <Icon className="w-4 h-4 text-[#8B0000]" />
      <h2 className="font-black text-[#111111] uppercase tracking-wider text-xs">{title}</h2>
    </div>
    <div className="p-6">{children}</div>
  </div>
);

export default function ApplicantsMasterDetailPage() {
  const [applicants, setApplicants] = useState<any[]>([]);
  const [loadingList, setLoadingList] = useState(true);
  
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedApplicant, setSelectedApplicant] = useState<any>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [saving, setSaving] = useState(false);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // 1. Fetch List
  const fetchApplicants = useCallback(async () => {
    setLoadingList(true);
    try {
      const res = await fetch('/api/applicants?perPage=1000&sortBy=created_at&sortOrder=desc'); // Fetch all for easy filtering client side, or just pass search
      const data = await res.json();
      setApplicants(data.data || []);
    } catch { 
      toast.error('Failed to load applicants'); 
    } finally { 
      setLoadingList(false); 
    }
  }, []);

  useEffect(() => { fetchApplicants(); }, [fetchApplicants]);

  // 2. Fetch Detail when selectedId changes
  useEffect(() => {
    if (!selectedId) {
      setSelectedApplicant(null);
      return;
    }
    const fetchDetail = async () => {
      setLoadingDetail(true);
      try {
        const res = await fetch(`/api/applicants/${selectedId}`);
        const data = await res.json();
        if (data.success) setSelectedApplicant(data.data);
        else { toast.error('Applicant not found'); setSelectedId(null); }
      } catch { 
        toast.error('Failed to load details'); 
      } finally { 
        setLoadingDetail(false); 
      }
    };
    fetchDetail();
  }, [selectedId]);

  // 3. Actions
  const updateStatus = async (id: string, status: string) => {
    setSaving(true);
    try {
      const res = await fetch(`/api/applicants/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (data.success) { 
        toast.success('Status updated');
        // Update list
        setApplicants(prev => prev.map(a => a.id === id ? { ...a, status } : a));
        // Update detail if open
        if (selectedApplicant?.id === id) {
          setSelectedApplicant((p: any) => ({ ...p, status }));
        }
      }
    } catch { toast.error('Update failed'); }
    finally { setSaving(false); }
  };

  const deleteApplicant = async (id: string, name: string) => {
    if (!confirm(`Delete ${name}'s application? This cannot be undone.`)) return;
    try {
      const res = await fetch(`/api/applicants/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) { 
        toast.success('Deleted'); 
        setApplicants(prev => prev.filter(a => a.id !== id));
        if (selectedId === id) setSelectedId(null);
      } else {
        toast.error(data.message);
      }
    } catch { toast.error('Delete failed'); }
  };

  // Derived filtered list
  const filteredApplicants = applicants.filter(a => {
    const matchSearch = (a.full_name || '').toLowerCase().includes(search.toLowerCase()) || 
                        (a.email || '').toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter ? a.status === statusFilter : true;
    return matchSearch && matchStatus;
  });

  return (
    <div className="flex gap-6" style={{ height: 'calc(100vh - 80px)' }}>
      
      {/* ── LEFT PANE: LIST ── */}
      <div className="w-80 lg:w-96 flex flex-col shrink-0 bg-white border-2 border-[#111111]" style={{ boxShadow: '4px 4px 0 0 rgba(0,0,0,0.75)' }}>
        <div style={{ padding: '16px', borderBottom: '4px solid #8B0000', backgroundColor: '#FFF8F8', display: 'flex', flexDirection: 'column', gap: '10px', flexShrink: 0 }}>
          <h2 className="font-black text-[#111111] uppercase tracking-tight text-xl">Applicants</h2>
          {/* Search Input */}
          <div style={{ position: 'relative' }}>
            <Search style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', width: 16, height: 16, color: '#8B0000', pointerEvents: 'none' }} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              style={{
                width: '100%',
                paddingLeft: 34,
                paddingRight: 10,
                paddingTop: 7,
                paddingBottom: 7,
                border: '2px solid #E4E4E7',
                fontSize: 12,
                fontWeight: 600,
                outline: 'none',
                backgroundColor: '#fff',
              }}
            />
          </div>
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{
              width: '100%',
              padding: '7px 10px',
              border: '2px solid #E4E4E7',
              fontSize: 12,
              fontWeight: 600,
              backgroundColor: '#fff',
              cursor: 'pointer',
            }}
          >
            <option value="">All Statuses</option>
            {APPLICATION_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        <div className="flex-1 overflow-y-auto divide-y-2 divide-[#F4F4F5]">
          {loadingList ? (
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="p-4"><Skeleton className="h-12 w-full bg-[#E4E4E7]" /></div>
            ))
          ) : filteredApplicants.length === 0 ? (
            <div className="p-8 text-center text-[#71717A] text-xs font-bold uppercase tracking-wider">No applicants found</div>
          ) : (
            filteredApplicants.map(app => (
              <div 
                key={app.id} 
                onClick={() => setSelectedId(app.id)}
                className={`p-4 cursor-pointer transition-colors hover:bg-[#F9F9F9] ${selectedId === app.id ? 'bg-[#FFF0F0] border-l-4 border-l-[#8B0000]' : 'border-l-4 border-l-transparent'}`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#8B0000] flex items-center justify-center border-2 border-[#111111] shrink-0 overflow-hidden" style={{ boxShadow: '2px 2px 0 0 rgba(0,0,0,0.6)' }}>
                    {app.profile_picture_url ? (
                      <img src={app.profile_picture_url} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-white font-black text-sm">{app.full_name?.charAt(0).toUpperCase()}</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-[#111111] text-sm truncate">{app.full_name}</div>
                    <div className="text-xs text-[#71717A] font-medium truncate">{app.email}</div>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-3">
                  <span className={`badge ${STATUS_CLASS[app.status] || 'badge-pending'}`}>{app.status}</span>
                  <span className="text-[10px] font-bold text-[#71717A] uppercase">{formatDate(app.created_at)}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* ── RIGHT PANE: DETAIL ── */}
      <div className="flex-1 bg-[#F4F4F5] border-2 border-[#E4E4E7] overflow-y-auto">
        {!selectedId ? (
          <div className="h-full flex flex-col items-center justify-center text-[#71717A]">
            <User className="w-12 h-12 mb-4 opacity-20" />
            <p className="font-bold uppercase tracking-wider text-sm">Select an applicant to view details</p>
          </div>
        ) : loadingDetail ? (
          <div className="p-8 space-y-6">
            <Skeleton className="h-32 w-full bg-[#E4E4E7]" />
            <Skeleton className="h-48 w-full bg-[#E4E4E7]" />
          </div>
        ) : !selectedApplicant ? (
          <div className="p-8 text-center text-[#71717A] font-bold">Applicant not found</div>
        ) : (
          <div className="p-6 md:p-8 space-y-8">
            
            {/* Profile Hero Card */}
            <div className="bg-white border-2 border-[#111111] overflow-hidden" style={{ boxShadow: '6px 6px 0 0 rgba(0,0,0,0.85)' }}>
              <div className="border-b-4 border-[#8B0000] bg-[#8B0000] px-8 py-6">
                <div className="flex flex-col xl:flex-row gap-6 items-start">
                  
                  <div className="w-24 h-24 bg-white border-4 border-white overflow-hidden shrink-0" style={{ boxShadow: '4px 4px 0 0 rgba(0,0,0,0.7)' }}>
                    {selectedApplicant.profile_picture_url ? (
                      <img src={selectedApplicant.profile_picture_url} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-[#6B0000] flex items-center justify-center">
                        <span className="text-white font-black text-4xl">{selectedApplicant.full_name?.charAt(0).toUpperCase()}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex-1">
                    <h1 className="text-3xl font-black text-white uppercase tracking-tight leading-none">{selectedApplicant.full_name}</h1>
                    <div className="flex flex-wrap gap-4 mt-3">
                      <span className="flex items-center gap-1.5 text-red-200 text-sm font-medium"><Mail className="w-3.5 h-3.5" /> {selectedApplicant.email}</span>
                      <span className="flex items-center gap-1.5 text-red-200 text-sm font-medium"><Phone className="w-3.5 h-3.5" /> {selectedApplicant.phone}</span>
                      <span className="flex items-center gap-1.5 text-red-200 text-sm font-medium"><MapPin className="w-3.5 h-3.5" /> {selectedApplicant.city}</span>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-4">
                      <span className={`badge ${STATUS_CLASS[selectedApplicant.status] || 'badge-pending'}`}>{selectedApplicant.status}</span>
                      <span className="badge" style={{ background: '#FFF0F0', color: '#8B0000', borderColor: '#FFB3B3' }}>Applied {formatDateRelative(selectedApplicant.created_at)}</span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 shrink-0 w-full xl:w-auto">
                    <select
                      value={selectedApplicant.status}
                      onChange={(e) => updateStatus(selectedApplicant.id, e.target.value)}
                      disabled={saving}
                      className="input-field text-xs font-bold uppercase tracking-wider bg-white border-white w-full xl:w-40"
                    >
                      {APPLICATION_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <div className="flex gap-2">
                      {selectedApplicant.resume_url && (
                        <a href={selectedApplicant.resume_url} target="_blank" rel="noreferrer" className="btn-secondary flex-1 text-xs px-3 py-2 flex items-center justify-center gap-1.5">
                          <Download className="w-3.5 h-3.5" /> Resume
                        </a>
                      )}
                      <button onClick={() => deleteApplicant(selectedApplicant.id, selectedApplicant.full_name)} className="btn-danger flex-1 text-xs px-3 py-2 flex items-center justify-center gap-1.5">
                        <Trash2 className="w-3.5 h-3.5" /> Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Links strip */}
              <div className="bg-[#FFF8F8] flex items-center gap-6 px-8 py-3 overflow-x-auto">
                {selectedApplicant.github && (
                  <a href={selectedApplicant.github} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#8B0000] hover:underline">
                    <Globe className="w-3.5 h-3.5" /> GitHub
                  </a>
                )}
                {selectedApplicant.linkedin && (
                  <a href={selectedApplicant.linkedin} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#8B0000] hover:underline">
                    <Link2 className="w-3.5 h-3.5" /> LinkedIn
                  </a>
                )}
                {selectedApplicant.portfolio && (
                  <a href={selectedApplicant.portfolio} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#8B0000] hover:underline">
                    <Globe className="w-3.5 h-3.5" /> Portfolio
                  </a>
                )}
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 2xl:grid-cols-2 gap-6">
              <Section title="Education" icon={GraduationCap}>
                <dl className="space-y-3">
                  {[
                    { label: 'College', value: selectedApplicant.college },
                    { label: 'University', value: selectedApplicant.university },
                    { label: 'Degree', value: `${selectedApplicant.degree} · ${selectedApplicant.branch}` },
                    { label: 'Year', value: `Year ${selectedApplicant.current_year}` },
                    { label: 'Graduation', value: String(selectedApplicant.graduation_year) },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex justify-between items-start gap-3 border-b border-[#F4F4F5] pb-2 last:border-0 last:pb-0">
                      <dt className="text-xs font-black uppercase tracking-wider text-[#71717A] shrink-0">{label}</dt>
                      <dd className="text-sm font-semibold text-[#111111] text-right">{value}</dd>
                    </div>
                  ))}
                </dl>
              </Section>
              <Section title="Contact Details" icon={User}>
                <dl className="space-y-3">
                  {[
                    { label: 'WhatsApp', value: selectedApplicant.whatsapp },
                    { label: 'City', value: selectedApplicant.city },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex justify-between items-start gap-3 border-b border-[#F4F4F5] pb-2 last:border-0 last:pb-0">
                      <dt className="text-xs font-black uppercase tracking-wider text-[#71717A] shrink-0">{label}</dt>
                      <dd className="text-sm font-semibold text-[#111111] text-right">{value}</dd>
                    </div>
                  ))}
                </dl>
              </Section>
            </div>

            {/* About */}
            <Section title="About" icon={BookOpen}>
              <p className="text-sm text-[#3F3F46] leading-relaxed whitespace-pre-wrap">{selectedApplicant.about}</p>
            </Section>

            {/* Project */}
            <Section title="Best Project" icon={Code2}>
              <div className="space-y-5">
                <div>
                  <h3 className="text-lg font-black text-[#111111] uppercase tracking-tight">{selectedApplicant.project_name}</h3>
                  <div className="inline-flex mt-2 bg-[#FFF0F0] border-2 border-[#FFB3B3] px-3 py-1 text-xs font-bold text-[#8B0000] uppercase tracking-wider">
                    {selectedApplicant.tech_stack}
                  </div>
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-wider text-[#71717A] mb-1.5">Description</p>
                  <p className="text-sm text-[#3F3F46] leading-relaxed whitespace-pre-wrap">{selectedApplicant.project_description}</p>
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-wider text-[#71717A] mb-1.5">Contribution</p>
                  <p className="text-sm text-[#3F3F46] leading-relaxed whitespace-pre-wrap">{selectedApplicant.explain_contribution}</p>
                </div>
              </div>
            </Section>

            {/* Resume Preview */}
            {selectedApplicant.resume_url && (
              <Section title="Resume" icon={Download}>
                <iframe
                  src={selectedApplicant.resume_url}
                  className="w-full border-2 border-[#E4E4E7]"
                  style={{ height: 680 }}
                  title="Resume Preview"
                />
              </Section>
            )}
            
          </div>
        )}
      </div>

    </div>
  );
}
