/*
  # Add missing columns to resources table

  1. Changes
    - Add `content` column for storing resource content
    - Add `author` column for storing resource author
    - Add `is_private` column for privacy settings
    - Add `is_note` column to distinguish notes from other resources
    - Add `tags` column for resource tagging
    - Rename `url` column to `source_url` to match application code
*/

-- Add new columns
ALTER TABLE resources ADD COLUMN IF NOT EXISTS content text NOT NULL;
ALTER TABLE resources ADD COLUMN IF NOT EXISTS author text;
ALTER TABLE resources ADD COLUMN IF NOT EXISTS is_private boolean DEFAULT false;
ALTER TABLE resources ADD COLUMN IF NOT EXISTS is_note boolean DEFAULT false;
ALTER TABLE resources ADD COLUMN IF NOT EXISTS tags text[] DEFAULT '{}';

-- Rename url column to source_url
ALTER TABLE resources RENAME COLUMN url TO source_url;

-- Make source_url nullable since notes don't have URLs
ALTER TABLE resources ALTER COLUMN source_url DROP NOT NULL;