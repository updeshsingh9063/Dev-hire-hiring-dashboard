import { z } from 'zod';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_FILE_TYPES = ['application/pdf'];

// Phone regex: international format
const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
const urlRegex = /^(https?:\/\/)?([\w-]+(\.[\w-]+)+)(\/[\w-./?%&=]*)?$/;

export const personalInfoSchema = z.object({
  first_name: z
    .string()
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name too long'),
  last_name: z
    .string()
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name too long'),
  email: z.string().email('Please enter a valid email address'),
  phone: z
    .string()
    .regex(phoneRegex, 'Please enter a valid phone number')
    .or(z.literal('')),
  whatsapp: z
    .string()
    .regex(phoneRegex, 'Please enter a valid WhatsApp number')
    .or(z.literal(''))
    .optional(),
  city: z.string().min(2, 'City is required').max(100),
  country: z.string().min(2, 'Country is required').max(100),
  linkedin: z
    .string()
    .url('Please enter a valid LinkedIn URL')
    .optional()
    .or(z.literal('')),
  github: z
    .string()
    .url('Please enter a valid GitHub URL')
    .optional()
    .or(z.literal('')),
  portfolio: z
    .string()
    .url('Please enter a valid portfolio URL')
    .optional()
    .or(z.literal('')),
  about: z
    .string()
    .min(50, 'Please tell us at least 50 characters about yourself')
    .max(2000, 'About section is too long (max 2000 characters)'),
});

export const educationSchema = z.object({
  college: z.string().min(3, 'College name is required').max(200),
  university: z.string().min(3, 'University name is required').max(200),
  degree: z.string().min(2, 'Degree is required').max(100),
  branch: z.string().min(2, 'Branch/Specialization is required').max(100),
  current_year: z
    .number()
    .int()
    .min(1, 'Year must be 1–5')
    .max(5, 'Year must be 1–5'),
  graduation_year: z
    .number()
    .int()
    .min(2020, 'Please enter a valid graduation year')
    .max(2035, 'Please enter a valid graduation year'),
});

export const projectSchema = z.object({
  project_name: z.string().min(2, 'Project name is required').max(200),
  project_description: z
    .string()
    .min(50, 'Please describe your project in at least 50 characters')
    .max(2000),
  problem_statement: z
    .string()
    .min(30, 'Problem statement must be at least 30 characters')
    .max(1000),
  solution: z
    .string()
    .min(30, 'Solution description must be at least 30 characters')
    .max(1000),
  tech_stack: z
    .array(z.string())
    .min(1, 'Please add at least one technology'),
  project_role: z.string().min(2, 'Your role is required').max(200),
  github_repo: z
    .string()
    .url('Please enter a valid GitHub repository URL')
    .optional()
    .or(z.literal('')),
  live_demo: z
    .string()
    .url('Please enter a valid demo URL')
    .optional()
    .or(z.literal('')),
});

export const experienceSchema = z.object({
  internships: z.string().max(1000).optional().or(z.literal('')),
  freelancing: z.string().max(1000).optional().or(z.literal('')),
  opensource: z.string().max(1000).optional().or(z.literal('')),
  hackathons: z.string().max(1000).optional().or(z.literal('')),
  achievements: z.string().max(1000).optional().or(z.literal('')),
});

export const skillsSchema = z.object({
  skills: z.object({
    frontend: z.array(z.string()),
    backend: z.array(z.string()),
    database: z.array(z.string()),
    cloud: z.array(z.string()),
    devops: z.array(z.string()),
    ai: z.array(z.string()),
    other: z.array(z.string()),
  }),
});

export const availabilitySchema = z.object({
  availability: z.enum(['Full Time', 'Part Time', 'Internship'], {
    required_error: 'Please select your availability',
  }),
  joining_date: z.string().min(1, 'Expected joining date is required'),
  employment_status: z.enum(
    ['Fresher', 'Currently Employed', 'Currently Studying', 'Freelancing', 'Other'],
    { required_error: 'Please select your employment status' }
  ),
  notes: z.string().max(500).optional().or(z.literal('')),
});

export const declarationSchema = z.object({
  declaration: z.literal(true, {
    errorMap: () => ({ message: 'You must accept the declaration to submit' }),
  }),
});

// Full application schema (combined)
export const applicationSchema = personalInfoSchema
  .merge(educationSchema)
  .merge(projectSchema)
  .merge(experienceSchema)
  .merge(skillsSchema)
  .merge(availabilitySchema)
  .merge(declarationSchema);

export type ApplicationFormData = z.infer<typeof applicationSchema>;

// Resume file validation (client-side)
export function validateResumeFile(file: File): string | null {
  if (!file) return 'Resume is required';
  if (file.type !== 'application/pdf') {
    return 'Only PDF files are allowed';
  }
  if (file.size > MAX_FILE_SIZE) {
    return `File size must be less than 5MB (current: ${(file.size / 1024 / 1024).toFixed(2)}MB)`;
  }
  return null;
}

export { MAX_FILE_SIZE, ACCEPTED_FILE_TYPES };
