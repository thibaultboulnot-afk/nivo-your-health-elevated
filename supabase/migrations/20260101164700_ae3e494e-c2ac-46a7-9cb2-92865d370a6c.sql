-- Add gamification columns to profiles table for deep RPG system
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS equipped_skin text DEFAULT 'standard',
ADD COLUMN IF NOT EXISTS subscription_start_date timestamp with time zone;

-- Create index for subscription queries
CREATE INDEX IF NOT EXISTS idx_profiles_subscription_start ON public.profiles(subscription_start_date);
CREATE INDEX IF NOT EXISTS idx_profiles_equipped_skin ON public.profiles(equipped_skin);