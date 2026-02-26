
-- Drop overly permissive policies
DROP POLICY IF EXISTS "Service role can insert purchases" ON public.user_purchases;
DROP POLICY IF EXISTS "Service role can update purchases" ON public.user_purchases;

-- Only authenticated users can insert their own purchases (edge function sets user_id)
CREATE POLICY "Users can insert own purchases"
  ON public.user_purchases FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Only the owner can update their own purchases  
CREATE POLICY "Users can update own purchases"
  ON public.user_purchases FOR UPDATE
  USING (auth.uid() = user_id);
