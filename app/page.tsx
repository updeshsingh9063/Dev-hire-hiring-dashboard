'use client';

import Link from 'next/link';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Loader2, CheckCircle2, Code2, Users, ArrowRight, Shield, Zap } from 'lucide-react';
import { applicationSchema, ApplicationFormData, validateResumeFile } from '@/lib/validations/applicationSchema';
import { ResumeUpload } from '@/components/ResumeUpload';
import { AvatarUpload } from '@/components/AvatarUpload';
import { createClient } from '@/lib/supabase/client';

export default function ApplicationPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeError, setResumeError] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const supabase = createClient();

  const { register, handleSubmit, formState: { errors } } = useForm<ApplicationFormData>({
    resolver: zodResolver(applicationSchema) as any,
  });

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const onSubmit = async (data: ApplicationFormData) => {
    const resumeErr = validateResumeFile(resumeFile);
    if (resumeErr) { setResumeError(resumeErr); return; }
    setResumeError(null);
    setIsSubmitting(true);

    try {
      const timestamp = Date.now();

      // 1. Upload resume to Supabase Storage
      const resumeFileName = `${timestamp}_${resumeFile!.name.replace(/\s+/g, '_')}`;
      const { error: resumeUploadError } = await supabase.storage
        .from('resumes')
        .upload(resumeFileName, resumeFile!, { contentType: 'application/pdf', upsert: false });

      if (resumeUploadError) throw new Error(`Resume upload failed: ${resumeUploadError.message}`);

      // Store the filename/key in the DB (resumes bucket is private; admin API will sign URLs on the fly)
      const resumeUrl = resumeFileName;

      // 2. Upload avatar to Supabase Storage (public bucket)
      let profilePictureUrl: string | undefined;
      if (avatarFile) {
        const avatarFileName = `${timestamp}_${avatarFile.name.replace(/\s+/g, '_')}`;
        const { error: avatarUploadError } = await supabase.storage
          .from('avatars')
          .upload(avatarFileName, avatarFile, { contentType: avatarFile.type, upsert: false });

        if (!avatarUploadError) {
          const { data: avatarPublic } = supabase.storage
            .from('avatars')
            .getPublicUrl(avatarFileName);
          profilePictureUrl = avatarPublic?.publicUrl;
        }
      }

      // 3. Submit to our API (saves to Supabase DB)
      const res = await fetch('/api/applicants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          resume_url: resumeUrl,
          resume_file_name: resumeFile!.name,
          profile_picture_url: profilePictureUrl,
        }),
      });
      const result = await res.json();
      if (!res.ok || !result.success) throw new Error(result.message || 'Failed to submit');
      setIsSuccess(true);
    } catch (err: any) {
      toast.error(err.message || 'Something went wrong.');
    } finally {
      setIsSubmitting(false);
    }
  };


  if (isSuccess) {
    return (
      <div className="min-h-screen bg-[#F4F4F5] flex items-center justify-center p-6">
        <div className="bg-white border-2 border-[#111111] p-10 max-w-md w-full text-center" style={{ boxShadow: '6px 6px 0 0 rgba(0,0,0,0.85)' }}>
          <div className="w-14 h-14 bg-[#8B0000] flex items-center justify-center mx-auto mb-5" style={{ boxShadow: '3px 3px 0 0 rgba(0,0,0,0.7)' }}>
            <CheckCircle2 className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-black text-[#111111] mb-2 uppercase tracking-tight">Application Submitted</h1>
          <p className="text-sm text-[#71717A] mb-8 leading-relaxed">We've received your application and will review it shortly.</p>
          <button onClick={() => window.location.reload()} className="btn-primary w-full">Submit Another Application</button>
        </div>
      </div>
    );
  }

  const Field = ({ label, id, error, textarea = false, ...props }: any) => (
    <div>
      <label htmlFor={id} className="input-label">{label} <span className="text-[#8B0000]">*</span></label>
      {textarea ? (
        <textarea id={id} className={`input-field min-h-[100px] resize-y ${error ? 'error' : ''}`} {...props} />
      ) : (
        <input id={id} className={`input-field ${error ? 'error' : ''}`} {...props} />
      )}
      {error && <p className="text-xs text-red-500 mt-1.5 font-medium">{error.message}</p>}
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      
      {/* Admin Login Button */}
      <Link href="/admin/login" className="fixed top-6 right-6 z-50 flex items-center gap-2 px-4 py-2 bg-white text-[#111111] font-bold text-xs uppercase tracking-widest border-2 border-[#111111] transition-transform hover:-translate-y-0.5 hover:-translate-x-0.5" style={{ boxShadow: '4px 4px 0 0 #111111' }}>
        <Shield className="w-3.5 h-3.5 text-[#8B0000]" /> Admin Login
      </Link>

      {/* ── LEFT PANEL (Desktop only) ── */}
      <div 
        className="hidden lg:flex flex-col justify-between w-[280px] xl:w-[320px] shrink-0 bg-[#8B0000] border-r-4 border-[#111111] p-8 sticky top-0 h-screen z-10"
        style={{ boxShadow: '8px 0px 0 0 #ffffff' }}
      >
        {/* Logo */}
        <div>
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 bg-white flex items-center justify-center" style={{ boxShadow: '3px 3px 0 0 rgba(0,0,0,0.5)' }}>
              <Code2 className="w-5 h-5 text-[#8B0000]" />
            </div>
            <div>
              <p className="font-black text-white text-lg uppercase tracking-widest leading-none">DevHire</p>
              <p className="text-red-300 text-[10px] uppercase tracking-widest font-bold">Hiring Portal</p>
            </div>
          </div>

          <div className="space-y-2 mb-10">
            <p className="text-red-200 text-xs font-black uppercase tracking-widest">Now Hiring</p>
            <h2 className="text-white font-black text-3xl xl:text-4xl uppercase leading-tight tracking-tight">
              Full Stack<br />Developer
            </h2>
          </div>

          <div className="space-y-5">
            {[
              { icon: Users, label: 'Open to all applicants', sub: 'No login required' },
              { icon: Zap, label: 'Fast review process', sub: 'Response within 48h' },
              { icon: Shield, label: 'Your data is secure', sub: 'Private & confidential' },
            ].map(({ icon: Icon, label, sub }, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-8 h-8 bg-[#6B0000] border border-[#A50000] flex items-center justify-center shrink-0">
                  <Icon className="w-3.5 h-3.5 text-red-200" />
                </div>
                <div>
                  <p className="text-white text-xs font-black uppercase tracking-wide">{label}</p>
                  <p className="text-red-300 text-xs font-medium">{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom note */}
        <div className="border-t border-[#6B0000] pt-5">
          <p className="text-red-300 text-xs font-bold uppercase tracking-wider">Fill the form on the right →</p>
        </div>
      </div>

      {/* ── RIGHT PANEL (Form) ── */}
      <div 
        className="flex-1 overflow-y-auto min-w-0 relative"
        style={{
          backgroundImage: 'linear-gradient(rgba(17, 17, 17, 0.8), rgba(17, 17, 17, 0.85)), url("https://images.unsplash.com/photo-1604147495798-57beb5d6af73?auto=format&fit=crop&w=1920&q=80")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        {/* Mobile top bar */}
        <div className="lg:hidden bg-[#8B0000] border-b-4 border-[#6B0000] px-5 py-4 flex items-center gap-3">
          <div className="w-8 h-8 bg-white flex items-center justify-center" style={{ boxShadow: '2px 2px 0 0 rgba(0,0,0,0.5)' }}>
            <Code2 className="w-4 h-4 text-[#8B0000]" />
          </div>
          <div>
            <p className="font-black text-white text-sm uppercase tracking-widest leading-none">DevHire</p>
            <p className="text-red-200 text-[10px] uppercase tracking-widest font-bold">Hiring Portal</p>
          </div>
        </div>

        <div className="px-6 sm:px-10 xl:px-16 py-8 lg:py-12 flex justify-center items-start">
          {/* Card */}
          <div className="w-full max-w-4xl bg-white border-2 border-white" style={{ boxShadow: '8px 8px 0 0 #ffffff' }}>
            {/* Card Header */}
            <div className="border-b-4 border-[#8B0000] px-7 py-6 bg-[#FFF8F8]">
              <h1 className="text-2xl sm:text-3xl font-bold italic font-premium text-[#111111] tracking-tight">
                Full Stack Developer Application
              </h1>
              <p className="text-[#71717A] text-sm mt-1 font-medium">
                All fields marked <span className="text-[#8B0000] font-bold">*</span> are required.
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="p-7 space-y-9">

              {/* Profile Photo */}
              <div className="flex flex-col items-center py-5 border-2 border-dashed border-[#D4D4D8] bg-[#F9F9F9]">
                <AvatarUpload
                  file={avatarFile}
                  previewUrl={avatarPreview}
                  onFileSelect={(f, url) => { setAvatarFile(f); setAvatarPreview(url); }}
                  error={null}
                />
              </div>

              {/* Personal Details */}
              <section>
                <p className="section-title">Personal Details</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <Field label="Full Name" id="full_name" {...register('full_name')} error={errors.full_name} placeholder="John Doe" />
                  <Field label="Email Address" id="email" type="email" {...register('email')} error={errors.email} placeholder="john@example.com" />
                  <Field label="Contact Number" id="phone" {...register('phone')} error={errors.phone} placeholder="+91 98765 43210" />
                  <Field label="WhatsApp Number" id="whatsapp" {...register('whatsapp')} error={errors.whatsapp} placeholder="+91 98765 43210" />
                  <div className="sm:col-span-2">
                    <Field label="Current City" id="city" {...register('city')} error={errors.city} placeholder="Mumbai, India" />
                  </div>
                </div>
              </section>

              {/* Education */}
              <section>
                <p className="section-title">Education</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <Field label="College" id="college" {...register('college')} error={errors.college} placeholder="MIT Engineering College" />
                  <Field label="University" id="university" {...register('university')} error={errors.university} placeholder="University of Mumbai" />
                  <Field label="Degree" id="degree" {...register('degree')} error={errors.degree} placeholder="B.Tech / B.E." />
                  <Field label="Branch" id="branch" {...register('branch')} error={errors.branch} placeholder="Computer Science" />
                  <Field label="Current Year" id="current_year" type="number" min="1" max="5" {...register('current_year')} error={errors.current_year} placeholder="e.g. 3" />
                  <Field label="Expected Graduation Year" id="graduation_year" type="number" {...register('graduation_year')} error={errors.graduation_year} placeholder="e.g. 2026" />
                </div>
              </section>

              {/* Professional Links */}
              <section>
                <p className="section-title">Professional Links</p>
                <div className="space-y-5">
                  <Field label="GitHub Profile" id="github" type="url" {...register('github')} error={errors.github} placeholder="https://github.com/johndoe" />
                  <Field label="LinkedIn Profile" id="linkedin" type="url" {...register('linkedin')} error={errors.linkedin} placeholder="https://linkedin.com/in/johndoe" />
                  <Field label="Portfolio Website" id="portfolio" type="url" {...register('portfolio')} error={errors.portfolio} placeholder="https://johndoe.dev" />
                </div>
              </section>

              {/* About */}
              <section>
                <p className="section-title">About Yourself</p>
                <Field label="About Yourself" id="about" textarea {...register('about')} error={errors.about} placeholder="Tell us about your background, passion for development, and what drives you..." />
              </section>

              {/* Project */}
              <section>
                <p className="section-title">Best Project</p>
                <div className="space-y-5">
                  <Field label="Project Name" id="project_name" {...register('project_name')} error={errors.project_name} placeholder="e.g. E-Commerce Platform" />
                  <Field label="Tech Stack Used" id="tech_stack" {...register('tech_stack')} error={errors.tech_stack} placeholder="Next.js, TypeScript, PostgreSQL, Supabase..." />
                  <Field label="Project Description" id="project_description" textarea {...register('project_description')} error={errors.project_description} placeholder="What does the project do? What problem does it solve?" />
                  <Field label="Explain Your Contribution" id="explain_contribution" textarea {...register('explain_contribution')} error={errors.explain_contribution} placeholder="What specific parts did you build? What was challenging?" />
                </div>
              </section>

              {/* Resume */}
              <section>
                <p className="section-title">Resume Upload</p>
                <ResumeUpload file={resumeFile} onFileSelect={(f) => { setResumeFile(f); setResumeError(null); }} error={resumeError} />
              </section>

              {/* Submit */}
              <div className="pt-2">
                <button type="submit" disabled={isSubmitting} className="btn-primary w-full py-4 text-sm uppercase tracking-widest">
                  {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  {isSubmitting ? 'Submitting...' : 'Submit Application →'}
                </button>
                <p className="text-center text-xs text-[#71717A] mt-3 font-medium">
                  Your data is secure and used only for the hiring process.
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
