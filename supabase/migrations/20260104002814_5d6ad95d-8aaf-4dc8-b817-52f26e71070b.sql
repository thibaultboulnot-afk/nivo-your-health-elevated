-- Add UPDATE policy to allow users to update their own NIVO scores
CREATE POLICY "score_update_own" 
ON public.nivo_scores 
FOR UPDATE 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);