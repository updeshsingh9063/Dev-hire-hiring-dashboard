-- =====================================================
-- SEED ADMIN USER
-- IMPORTANT: Run this AFTER setting up bcrypt hash
-- Replace the hash below with actual bcrypt hash of 'custom@1234'
-- Generate at: https://bcrypt-generator.com/ (rounds: 12)
-- Or run: node -e "const b=require('bcryptjs');console.log(b.hashSync('custom@1234',12))"
-- =====================================================

-- Example hash for 'custom@1234' (bcrypt, cost 12)
-- Replace $2a$12$... with your actual generated hash
INSERT INTO admins (email, password_hash)
VALUES (
  'custom9063@gmail.com',
  '$2a$12$PLACEHOLDER_REPLACE_WITH_REAL_BCRYPT_HASH'
)
ON CONFLICT (email) DO UPDATE
  SET password_hash = EXCLUDED.password_hash;
