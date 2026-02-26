
-- Track user purchases (one-time payment)
CREATE TABLE public.user_purchases (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  stripe_session_id TEXT,
  amount INTEGER NOT NULL DEFAULT 500,
  currency TEXT NOT NULL DEFAULT 'eur',
  status TEXT NOT NULL DEFAULT 'pending',
  purchased_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.user_purchases ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own purchases"
  ON public.user_purchases FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Service role can insert purchases"
  ON public.user_purchases FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Service role can update purchases"
  ON public.user_purchases FOR UPDATE
  USING (true);

-- Add has_premium column to profiles for quick lookup
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS has_premium BOOLEAN NOT NULL DEFAULT false;
