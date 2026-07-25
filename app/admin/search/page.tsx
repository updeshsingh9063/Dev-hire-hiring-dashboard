import { redirect } from 'next/navigation';

export default function SearchPage() {
  // Search is handled in the applicants page via the search bar and query params.
  // We just redirect there so the sidebar link works nicely.
  redirect('/admin/applicants');
}
