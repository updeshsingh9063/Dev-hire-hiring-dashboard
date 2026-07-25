'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import {
  ArrowLeft, Mail, Phone, MapPin, Globe, Link2,
  Download, Trash2, GraduationCap, Code2, BookOpen, User
} from 'lucide-react';
import { formatDate, formatDateRelative, APPLICATION_STATUSES } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';

const STATUS_CLASS: Record<string, string> = {
  'Pending': 'badge-pending',
  'Shortlisted': 'badge-short',
  'Interview Scheduled': 'badge-interview',
  'Selected': 'badge-selected',
  'Rejected': 'badge-rejected',
};

export default function ApplicantProfilePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [applicant, setApplicant] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`/api/applicants/${id}`);
        const data = await res.json();
        if (data.success) setApplicant(data.data);
        else toast.error('Applicant not found');
      } catch { toast.error('Failed to load'); }
      finally { setLoading(false); }
    })();
  }, [id]);

  const updateStatus = async (status: string) => {
    setSaving(true);
    try {
      const res = await fetch(`/api/applicants/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (data.success) { setApplicant((p: any) => ({ ...p, status })); toast.success('Status updated'); }
    } catch { toast.error('Update failed'); }
    finally { setSaving(false); }
  };

  const deleteApplicant = async () => {
    if (!confirm('Delete this application? This cannot be undone.')) return;
    try {
      const res = await fetch(`/api/applicants/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) { toast.success('Deleted'); router.push('/admin/applicants'); }
    } catch { toast.error('Delete failed'); }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-6 w-40 bg-[#E4E4E7]" />
        <Skeleton className="h-56 bg-[#E4E4E7]" />
        <div className="grid grid-cols-2 gap-6">
          <Skeleton className="h-44 bg-[#E4E4E7]" />
          <Skeleton className="h-44 bg-[#E4E4E7]" />
        </div>
      </div>
    );
  }

  if (!applicant) {
    return (
      <div className="text-center py-24">
        <p className="text-[#71717A] font-bold uppercase tracking-wider mb-4">Applicant not found</p>
        <Link href="/admin/applicants" className="btn-primary text-xs px-5 py-2">← Back to list</Link>
      </div>
    );
  }

  const Section = ({ title, icon: Icon, children }: { title: string; icon: any; children: React.ReactNode }) => (
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
      {/* Back */}
      <Link
        href="/admin/applicants"
        className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#8B0000] hover:underline"
      >
        ← Back to Applicants
      </Link>

      {/* Profile Hero Card */}
      <div
        className="bg-white border-2 border-[#111111] overflow-hidden"
        style={{ boxShadow: '6px 6px 0 0 rgba(0,0,0,0.85)' }}
      >
        <div className="border-b-4 border-[#8B0000] bg-[#8B0000] px-8 py-6">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            {/* Avatar */}
            <div
              className="w-20 h-20 md:w-24 md:h-24 bg-white border-4 border-white overflow-hidden shrink-0"
              style={{ boxShadow: '4px 4px 0 0 rgba(0,0,0,0.7)' }}
            >
              {applicant.profile_picture_url ? (
                <img
                  src={applicant.profile_picture_url}
                  alt={applicant.full_name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-[#6B0000] flex items-center justify-center">
                  <span className="text-white font-black text-3xl">
                    {applicant.full_name?.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1">
              <h1 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tight leading-none">
                {applicant.full_name}
              </h1>
              <div className="flex flex-wrap gap-4 mt-3">
                <span className="flex items-center gap-1.5 text-red-200 text-sm font-medium">
                  <Mail className="w-3.5 h-3.5" /> {applicant.email}
                </span>
                <span className="flex items-center gap-1.5 text-red-200 text-sm font-medium">
                  <Phone className="w-3.5 h-3.5" /> {applicant.phone}
                </span>
                <span className="flex items-center gap-1.5 text-red-200 text-sm font-medium">
                  <MapPin className="w-3.5 h-3.5" /> {applicant.city}
                </span>
              </div>
              <div className="flex flex-wrap gap-2 mt-4">
                <span className={`badge ${STATUS_CLASS[applicant.status] || 'badge-pending'}`}>
                  {applicant.status}
                </span>
                <span className="badge" style={{ background: '#FFF0F0', color: '#8B0000', borderColor: '#FFB3B3' }}>
                  Applied {formatDateRelative(applicant.created_at)}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3 shrink-0">
              <select
                value={applicant.status}
                onChange={(e) => updateStatus(e.target.value)}
                disabled={saving}
                className="input-field text-xs font-bold uppercase tracking-wider bg-white border-white"
                style={{ minWidth: 160 }}
              >
                {APPLICATION_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <div className="flex gap-2">
                {applicant.resume_url && (
                  <a href={applicant.resume_url} target="_blank" rel="noreferrer" className="btn-secondary text-xs px-3 py-2 flex items-center gap-1.5">
                    <Download className="w-3.5 h-3.5" /> Resume
                  </a>
                )}
                <button onClick={deleteApplicant} className="btn-danger text-xs px-3 py-2 flex items-center gap-1.5">
                  <Trash2 className="w-3.5 h-3.5" /> Delete
                </button>
              </div>
              <div className="flex gap-2">
                {applicant.github && (
                  <a href={applicant.github} target="_blank" rel="noreferrer" className="btn-secondary text-xs px-3 py-2 flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5" /> GitHub
                  </a>
                )}
                {applicant.linkedin && (
                  <a href={applicant.linkedin} target="_blank" rel="noreferrer" className="btn-secondary text-xs px-3 py-2 flex items-center gap-1.5">
                    <Link2 className="w-3.5 h-3.5" /> LinkedIn
                  </a>
                )}
                {applicant.portfolio && (
                  <a href={applicant.portfolio} target="_blank" rel="noreferrer" className="btn-secondary text-xs px-3 py-2 flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5" /> Portfolio
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Education */}
        <Section title="Education" icon={GraduationCap}>
          <dl className="space-y-3">
            {[
              { label: 'College', value: applicant.college },
              { label: 'University', value: applicant.university },
              { label: 'Degree', value: `${applicant.degree} · ${applicant.branch}` },
              { label: 'Year', value: `Year ${applicant.current_year}` },
              { label: 'Graduation', value: String(applicant.graduation_year) },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between items-start gap-3 border-b border-[#F4F4F5] pb-2 last:border-0 last:pb-0">
                <dt className="text-xs font-black uppercase tracking-wider text-[#71717A] shrink-0">{label}</dt>
                <dd className="text-sm font-semibold text-[#111111] text-right">{value}</dd>
              </div>
            ))}
          </dl>
        </Section>

        {/* Contact */}
        <Section title="Contact Details" icon={User}>
          <dl className="space-y-3">
            {[
              { label: 'WhatsApp', value: applicant.whatsapp },
              { label: 'City', value: applicant.city },
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
        <p className="text-sm text-[#3F3F46] leading-relaxed whitespace-pre-wrap">{applicant.about}</p>
      </Section>

      {/* Project */}
      <Section title="Best Project" icon={Code2}>
        <div className="space-y-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-lg font-black text-[#111111] uppercase tracking-tight">{applicant.project_name}</h3>
              <div
                className="inline-flex mt-2 bg-[#FFF0F0] border-2 border-[#FFB3B3] px-3 py-1 text-xs font-bold text-[#8B0000] uppercase tracking-wider"
              >
                {applicant.tech_stack}
              </div>
            </div>
          </div>
          <div>
            <p className="text-xs font-black uppercase tracking-wider text-[#71717A] mb-1.5">Description</p>
            <p className="text-sm text-[#3F3F46] leading-relaxed whitespace-pre-wrap">{applicant.project_description}</p>
          </div>
          <div>
            <p className="text-xs font-black uppercase tracking-wider text-[#71717A] mb-1.5">Contribution</p>
            <p className="text-sm text-[#3F3F46] leading-relaxed whitespace-pre-wrap">{applicant.explain_contribution}</p>
          </div>
        </div>
      </Section>

      {/* Resume Preview */}
      {applicant.resume_url && (
        <Section title="Resume" icon={Download}>
          <iframe
            src={applicant.resume_url}
            className="w-full border-2 border-[#E4E4E7]"
            style={{ height: 680 }}
            title="Resume Preview"
          />
        </Section>
      )}
    </div>
  );
}
