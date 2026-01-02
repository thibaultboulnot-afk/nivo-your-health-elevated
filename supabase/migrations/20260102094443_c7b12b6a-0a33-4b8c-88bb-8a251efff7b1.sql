-- Add structural_integrity and bio_rank columns to profiles
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS structural_integrity integer DEFAULT 100,
ADD COLUMN IF NOT EXISTS bio_rank text DEFAULT 'initiate';

-- Ensure total_xp alias column exists (xp already exists)
COMMENT ON COLUMN public.profiles.structural_integrity IS 'Structural integrity percentage (0-100)';
COMMENT ON COLUMN public.profiles.bio_rank IS 'User rank: initiate, operator, architect, titan';