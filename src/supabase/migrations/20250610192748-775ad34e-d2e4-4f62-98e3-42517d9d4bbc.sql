
-- Add columns that match our current game structure
ALTER TABLE public.game_results 
ADD COLUMN IF NOT EXISTS game_name TEXT NOT NULL DEFAULT 'Word Recognition';

-- Update the existing RLS policies to ensure proper access
DROP POLICY IF EXISTS "Users can view their own game results" ON public.game_results;
DROP POLICY IF EXISTS "Users can insert their own game results" ON public.game_results;
DROP POLICY IF EXISTS "Admins can view all game results" ON public.game_results;

-- Create comprehensive RLS policies
CREATE POLICY "Users can view their own game results" 
  ON public.game_results 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own game results" 
  ON public.game_results 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Admin policy to view all results
CREATE POLICY "Admins can view all game results" 
  ON public.game_results 
  FOR SELECT 
  USING (EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.username = 'admin'
  ));
