-- Fix 1: Remove overly permissive public SELECT policies on profiles table
DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON public.profiles;
DROP POLICY IF EXISTS "public_profiles_select" ON public.profiles;

-- Create a restrictive policy allowing users to only see their own profile
CREATE POLICY "Users can view own profile"
ON public.profiles
FOR SELECT
USING (auth.uid() = id);