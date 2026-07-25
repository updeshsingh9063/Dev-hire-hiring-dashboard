export type ApplicantStatus =
  | 'Pending'
  | 'Shortlisted'
  | 'Interview Scheduled'
  | 'Selected'
  | 'Rejected';

export interface Applicant {
  id: string;

  // Personal
  full_name: string;
  email: string;
  phone: string;
  whatsapp: string;
  city: string;

  // Education
  college: string;
  university: string;
  degree: string;
  branch: string;
  current_year: number;
  graduation_year: number;

  // Links
  github: string;
  linkedin: string;
  portfolio: string;

  // About
  about: string;

  // Project
  project_name: string;
  tech_stack: string;
  project_description: string;
  explain_contribution: string;

  // Assets
  profile_picture_url?: string;
  resume_url: string;
  resume_file_name: string;

  // Admin Tracking
  status: ApplicantStatus;

  // Timestamps
  created_at: string;
  updated_at: string;
}
