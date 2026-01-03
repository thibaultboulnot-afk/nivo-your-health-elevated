-- Add columns for weekly competition and Apex economy
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS weekly_xp integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS victory_tokens integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS apex_tier integer DEFAULT 0;

-- Create index for leaderboard performance
CREATE INDEX IF NOT EXISTS idx_profiles_weekly_xp ON public.profiles(weekly_xp DESC);