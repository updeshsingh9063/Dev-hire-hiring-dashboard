-- =====================================================
-- STORAGE BUCKET: resumes
-- Run this in Supabase SQL Editor
-- =====================================================

-- Create the resumes bucket (private)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'resumes',
  'resumes',
  false,
  5242880,  -- 5MB in bytes
  ARRAY['application/pdf']
)
ON CONFLICT (id) DO NOTHING;

-- Allow anyone to upload (anon can INSERT into storage)
CREATE POLICY "Allow public uploads to resumes" ON storage.objects
  FOR INSERT
  TO anon
  WITH CHECK (bucket_id = 'resumes');

-- Only service_role can read/delete resumes
CREATE POLICY "Service role can read resumes" ON storage.objects
  FOR SELECT
  TO service_role
  USING (bucket_id = 'resumes');

CREATE POLICY "Service role can delete resumes" ON storage.objects
  FOR DELETE
  TO service_role
  USING (bucket_id = 'resumes');
