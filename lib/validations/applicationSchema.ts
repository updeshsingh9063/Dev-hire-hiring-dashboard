import { z } from 'zod';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_IMAGE_SIZE = 2 * 1024 * 1024; // 2MB

export const applicationSchema = z.object({
  // Personal
  full_name: z.string().min(2, 'Full name is required').max(100),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(10, 'Contact number is required').max(20),
  whatsapp: z.string().min(10, 'WhatsApp number is required').max(20),
  city: z.string().min(2, 'Current city is required').max(100),

  // Education
  college: z.string().min(2, 'College name is required').max(200),
  university: z.string().min(2, 'University name is required').max(200),
  degree: z.string().min(2, 'Degree is required').max(100),
  branch: z.string().min(2, 'Branch is required').max(100),
  current_year: z.coerce.number().min(1).max(5),
  graduation_year: z.coerce.number().min(2020).max(2035),

  // Links
  github: z.string().url('Please enter a valid GitHub URL'),
  linkedin: z.string().url('Please enter a valid LinkedIn URL'),
  portfolio: z.string().url('Please enter a valid Portfolio URL'),

  // About
  about: z.string().min(10, 'About yourself is required').max(2000),

  // Project
  project_name: z.string().min(2, 'Project name is required').max(200),
  tech_stack: z.string().min(2, 'Tech stack is required').max(500),
  project_description: z.string().min(10, 'Project description is required').max(2000),
  explain_contribution: z.string().min(10, 'Explanation of contribution is required').max(2000),
});

export type ApplicationFormData = z.infer<typeof applicationSchema>;

export function validateResumeFile(file: File | null): string | null {
  if (!file) return 'Resume PDF is required';
  if (file.type !== 'application/pdf') {
    return 'Only PDF files are allowed';
  }
  if (file.size > MAX_FILE_SIZE) {
    return `File size must be less than 5MB (current: ${(file.size / 1024 / 1024).toFixed(2)}MB)`;
  }
  return null;
}

export function validateImageFile(file: File | null): string | null {
  if (!file) return 'Profile picture is required';
  if (!file.type.startsWith('image/')) {
    return 'Only image files are allowed';
  }
  if (file.size > MAX_IMAGE_SIZE) {
    return `File size must be less than 2MB (current: ${(file.size / 1024 / 1024).toFixed(2)}MB)`;
  }
  return null;
}
