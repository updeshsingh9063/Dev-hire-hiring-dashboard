-- =====================================================
-- APPLICANTS TABLE (UPDATED SCHEMA)
-- =====================================================
CREATE TABLE IF NOT EXISTS applicants (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,

  -- Personal
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  whatsapp TEXT NOT NULL,
  city TEXT NOT NULL,

  -- Education
  college TEXT NOT NULL,
  university TEXT NOT NULL,
  degree TEXT NOT NULL,
  branch TEXT NOT NULL,
  current_year INTEGER NOT NULL,
  graduation_year INTEGER NOT NULL,

  -- Links
  github TEXT NOT NULL,
  linkedin TEXT NOT NULL,
  portfolio TEXT NOT NULL,

  -- Assets
  profile_picture_url TEXT,
  resume_url TEXT NOT NULL,
  resume_file_name TEXT NOT NULL,
  about TEXT NOT NULL,

  -- Project
  project_name TEXT NOT NULL,
  tech_stack TEXT NOT NULL,
  project_description TEXT NOT NULL,
  explain_contribution TEXT NOT NULL,

  -- Resume
  resume_url TEXT NOT NULL,
  resume_file_name TEXT NOT NULL,

  -- Admin Tracking
  status TEXT DEFAULT 'Pending' CHECK (
    status IN ('Pending', 'Shortlisted', 'Interview Scheduled', 'Selected', 'Rejected')
  ),

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_applicants_updated_at ON applicants;
CREATE TRIGGER update_applicants_updated_at
  BEFORE UPDATE ON applicants
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- RLS
ALTER TABLE applicants ENABLE ROW LEVEL SECURITY;

-- Anyone can INSERT (applicants submit without login)
DROP POLICY IF EXISTS "Allow public insert" ON applicants;
CREATE POLICY "Allow public insert" ON applicants
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Only service_role can SELECT, UPDATE, DELETE
DROP POLICY IF EXISTS "Service role full access" ON applicants;
CREATE POLICY "Service role full access" ON applicants
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_applicants_email ON applicants(email);
CREATE INDEX IF NOT EXISTS idx_applicants_status ON applicants(status);
CREATE INDEX IF NOT EXISTS idx_applicants_college ON applicants(college);
CREATE INDEX IF NOT EXISTS idx_applicants_created_at ON applicants(created_at DESC);
