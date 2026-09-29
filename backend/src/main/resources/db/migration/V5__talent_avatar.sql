-- V5__talent_avatar.sql
-- Adds a talent profile photo field, stored as a data URI (or a plain URL)
-- the same way the company logo is (see V4), since no object-storage
-- service (S3, Cloudinary, etc.) is wired up yet.

ALTER TABLE talent_profiles ADD COLUMN avatar_url TEXT;
