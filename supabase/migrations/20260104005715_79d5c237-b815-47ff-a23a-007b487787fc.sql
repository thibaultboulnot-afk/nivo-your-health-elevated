-- MODULE 3 & 4: Add new columns for LIFETIME, calibration limits, referrals, and tutorial tracking

-- Add is_lifetime column for FOUNDER/Lifetime access
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS is_lifetime BOOLEAN DEFAULT false;

-- Add referral tracking columns
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS referral_count INTEGER DEFAULT 0;

-- Add last calibration date for 24h limit
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS last_calibration_date DATE DEFAULT NULL;

-- Add has_seen_tutorial for first-time onboarding
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS has_seen_tutorial BOOLEAN DEFAULT false;

-- Add index for referral queries
CREATE INDEX IF NOT EXISTS idx_profiles_referral_count ON public.profiles (referral_count);