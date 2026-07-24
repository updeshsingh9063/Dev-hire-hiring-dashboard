-- =====================================================
-- ADMINS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS admins (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS: only service_role can read admins
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role only" ON admins
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Deny all to anon and authenticated
CREATE POLICY "Deny anon" ON admins
  FOR ALL
  TO anon
  USING (false);
