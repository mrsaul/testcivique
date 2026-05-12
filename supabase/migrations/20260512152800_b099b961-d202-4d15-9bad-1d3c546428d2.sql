CREATE TABLE public.prefetch_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  event_type text NOT NULL CHECK (event_type IN ('issued','hit','miss')),
  route_key text NOT NULL,
  trigger text CHECK (trigger IN ('idle','intent')),
  saved_ms integer,
  duration_ms integer,
  user_id uuid,
  session_id text,
  pathname text,
  effective_type text,
  save_data boolean
);

CREATE INDEX idx_prefetch_events_created_at ON public.prefetch_events (created_at DESC);
CREATE INDEX idx_prefetch_events_event_type ON public.prefetch_events (event_type);
CREATE INDEX idx_prefetch_events_route_key ON public.prefetch_events (route_key);

ALTER TABLE public.prefetch_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert prefetch events"
  ON public.prefetch_events
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Admins can view prefetch events"
  ON public.prefetch_events
  FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));