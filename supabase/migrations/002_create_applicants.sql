-- =====================================================
-- APPLICANTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS applicants (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,

  -- Personal
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  whatsapp TEXT,

  -- Education
  college TEXT,
  university TEXT,
  degree TEXT,
  branch TEXT,
  current_year INTEGER,
  graduation_year INTEGER,

  -- Location
  city TEXT,
  country TEXT,

  -- Links
  linkedin TEXT,
  github TEXT,
  portfolio TEXT,

  -- Resume
  resume_url TEXT,
  resume_file_name TEXT,

  -- About
  about TEXT,

  -- Project
  project_name TEXT,
  project_description TEXT,
  problem_statement TEXT,
  solution TEXT,
  tech_stack TEXT[],
  project_role TEXT,
  github_repo TEXT,
  live_demo TEXT,
  project_images TEXT[],

  -- Experience
  internships TEXT,
  freelancing TEXT,
  opensource TEXT,
  hackathons TEXT,
  achievements TEXT,

  -- Skills (JSON object with categories)
  skills JSONB DEFAULT '{}',

  -- Availability
  availability TEXT,
  joining_date DATE,
  employment_status TEXT,

  -- Additional
  notes TEXT,

  -- Status
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

CREATE TRIGGER update_applicants_updated_at
  BEFORE UPDATE ON applicants
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- RLS
ALTER TABLE applicants ENABLE ROW LEVEL SECURITY;

-- Anyone can INSERT (applicants submit without login)
CREATE POLICY "Allow public insert" ON applicants
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Only service_role can SELECT, UPDATE, DELETE
CREATE POLICY "Service role full access" ON applicants
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Indexes
CREATE INDEX idx_applicants_email ON applicants(email);
CREATE INDEX idx_applicants_status ON applicants(status);
CREATE INDEX idx_applicants_college ON applicants(college);
CREATE INDEX idx_applicants_created_at ON applicants(created_at DESC);
