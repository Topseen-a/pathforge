-- V6__submission_file_size.sql
-- Widens submissions.file_url from VARCHAR(255) to TEXT so a talent can
-- attach an actual file (stored as a base64 data URI, same approach as the
-- company logo and talent avatar) instead of only being able to paste a
-- plain link.

ALTER TABLE submissions ALTER COLUMN file_url TYPE TEXT;
