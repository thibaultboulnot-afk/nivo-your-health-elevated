-- Add INSERT policy for user_progression table
-- This prevents authenticated users from creating progression records for other users
CREATE POLICY "prog_insert_own" 
ON public.user_progression 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);