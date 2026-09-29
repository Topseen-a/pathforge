-- V4__company_logo_and_indexes.sql
-- Adds a company logo field, stored as a data URI (or a plain URL) rather
-- than raw file storage, since no object-storage service (S3, Cloudinary,
-- etc.) is wired up yet. TEXT has no meaningful length cap in Postgres, so
-- this comfortably holds a base64-encoded small logo image.

ALTER TABLE companies ADD COLUMN logo_url TEXT;
