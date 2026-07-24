export type ApplicationStatus =
  | 'Pending'
  | 'Shortlisted'
  | 'Interview Scheduled'
  | 'Selected'
  | 'Rejected';

export type Availability = 'Full Time' | 'Part Time' | 'Internship';

export type EmploymentStatus =
  | 'Fresher'
  | 'Currently Employed'
  | 'Currently Studying'
  | 'Freelancing'
  | 'Other';

export interface ApplicantSkills {
  frontend: string[];
  backend: string[];
  database: string[];
  cloud: string[];
  devops: string[];
  ai: string[];
  other: string[];
}

export interface Applicant {
  id: string;

  // Personal
  first_name: string;
  last_name: string;
  full_name: string;
  email: string;
  phone: string | null;
  whatsapp: string | null;

  // Education
  college: string | null;
  university: string | null;
  degree: string | null;
  branch: string | null;
  current_year: number | null;
  graduation_year: number | null;

  // Location
  city: string | null;
  country: string | null;

  // Links
  linkedin: string | null;
  github: string | null;
  portfolio: string | null;

  // Resume
  resume_url: string | null;
  resume_file_name: string | null;

  // About
  about: string | null;

  // Project
  project_name: string | null;
  project_description: string | null;
  problem_statement: string | null;
  solution: string | null;
  tech_stack: string[] | null;
  project_role: string | null;
  github_repo: string | null;
  live_demo: string | null;
  project_images: string[] | null;

  // Experience
  internships: string | null;
  freelancing: string | null;
  opensource: string | null;
  hackathons: string | null;
  achievements: string | null;

  // Skills
  skills: ApplicantSkills | null;

  // Availability
  availability: Availability | null;
  joining_date: string | null;
  employment_status: EmploymentStatus | null;

  // Additional
  notes: string | null;

  // Status
  status: ApplicationStatus;

  // Timestamps
  created_at: string;
  updated_at: string;
}

export type ApplicantInsert = Omit<Applicant, 'id' | 'created_at' | 'updated_at' | 'status'>;

export type ApplicantListItem = Pick<
  Applicant,
  | 'id'
  | 'full_name'
  | 'email'
  | 'phone'
  | 'college'
  | 'current_year'
  | 'status'
  | 'availability'
  | 'created_at'
  | 'github'
  | 'portfolio'
  | 'linkedin'
  | 'branch'
  | 'degree'
>;

export interface ApplicantsQueryParams {
  search?: string;
  status?: ApplicationStatus | '';
  college?: string;
  year?: number | '';
  branch?: string;
  availability?: Availability | '';
  sortBy?: 'created_at' | 'full_name' | 'college' | 'status';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  perPage?: number;
}

export interface ApplicantsResponse {
  data: ApplicantListItem[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}
