-- Add gamification columns to profiles table
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS xp INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS level INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS current_streak INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS streak_freezes INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS unlocked_skins TEXT[] DEFAULT ARRAY['standard']::TEXT[],
ADD COLUMN IF NOT EXISTS subscription_tier TEXT DEFAULT 'free',
ADD COLUMN IF NOT EXISTS last_activity_date DATE;

-- Add comment for documentation
COMMENT ON COLUMN public.profiles.xp IS 'Experience points for gamification';
COMMENT ON COLUMN public.profiles.level IS 'User level calculated from XP';
COMMENT ON COLUMN public.profiles.current_streak IS 'Consecutive days of activity';
COMMENT ON COLUMN public.profiles.streak_freezes IS 'Available streak freeze jokers';
COMMENT ON COLUMN public.profiles.unlocked_skins IS 'Array of unlocked scanner skin IDs';
COMMENT ON COLUMN public.profiles.subscription_tier IS 'free, pro_monthly, or pro_yearly';
COMMENT ON COLUMN public.profiles.last_activity_date IS 'Last date user completed an activity';