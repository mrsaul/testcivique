
CREATE TABLE public.payment_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  stripe_event_id TEXT UNIQUE,
  event_type TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'received',
  user_id UUID,
  user_email TEXT,
  stripe_session_id TEXT,
  stripe_payment_intent_id TEXT,
  amount INTEGER,
  currency TEXT,
  error_message TEXT,
  payload JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_payment_events_created_at ON public.payment_events (created_at DESC);
CREATE INDEX idx_payment_events_status ON public.payment_events (status);
CREATE INDEX idx_payment_events_user_id ON public.payment_events (user_id);

GRANT SELECT ON public.payment_events TO authenticated;
GRANT ALL ON public.payment_events TO service_role;

ALTER TABLE public.payment_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view payment events"
ON public.payment_events FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));
