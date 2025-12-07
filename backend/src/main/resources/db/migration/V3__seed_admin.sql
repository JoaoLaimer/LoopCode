-- V3: Seed admin user (uses Postgres pgcrypto to generate bcrypt hash)
-- WARNING: This migration contains the plaintext admin password as provided.
-- If you prefer not to store plaintext in the migration file, generate the
-- bcrypt hash externally and insert the hashed value instead.

CREATE EXTENSION IF NOT EXISTS pgcrypto;