import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const APPLICATION_STATUSES = [
  'Pending',
  'Shortlisted',
  'Interview Scheduled',
  'Selected',
  'Rejected',
] as const;

export const STATUS_COLORS = {
  Pending: { bg: 'bg-amber-500/10', text: 'text-amber-400', dot: 'bg-amber-400' },
  Shortlisted: { bg: 'bg-blue-500/10', text: 'text-blue-400', dot: 'bg-blue-400' },
  'Interview Scheduled': { bg: 'bg-purple-500/10', text: 'text-purple-400', dot: 'bg-purple-400' },
  Selected: { bg: 'bg-green-500/10', text: 'text-green-400', dot: 'bg-green-400' },
  Rejected: { bg: 'bg-red-500/10', text: 'text-red-400', dot: 'bg-red-400' },
};

export const GRADUATION_YEARS = [2024, 2025, 2026, 2027, 2028];

export const TECH_STACK_SUGGESTIONS = [
  'React', 'Next.js', 'TypeScript', 'Node.js', 'Python', 'Go', 'Rust', 
  'PostgreSQL', 'MongoDB', 'Supabase', 'AWS', 'Docker', 'Kubernetes',
  'Tailwind CSS', 'GraphQL', 'Redis', 'Figma'
];

export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export function formatFileSize(bytes: number) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function formatDateRelative(dateStr: string) {
  const date = new Date(dateStr);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
  return formatDate(dateStr);
}
