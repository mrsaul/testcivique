-- Recreate the quiz_questions view WITHOUT security_invoker so it runs as the
-- view owner (postgres) and bypasses the base table's RLS deny-all policy.
-- This is safe because the view intentionally excludes the correct_answer column.
DROP VIEW IF EXISTS public.quiz_questions;

CREATE VIEW public.quiz_questions AS
  SELECT id, theme, question, options, explanation, difficulty, created_at
  FROM public.questions;

-- Grant select on the view to authenticated and anon roles
GRANT SELECT ON public.quiz_questions TO authenticated, anon;
