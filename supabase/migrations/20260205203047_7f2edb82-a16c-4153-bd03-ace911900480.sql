-- Drop the existing public read policy on questions
DROP POLICY IF EXISTS "Questions are publicly readable" ON public.questions;

-- Create a restrictive policy that denies direct access to the questions table
CREATE POLICY "No direct access to questions"
ON public.questions FOR SELECT
TO authenticated, anon
USING (false);

-- Create a view that excludes the correct_answer field
CREATE VIEW public.quiz_questions
WITH (security_invoker = on) AS
SELECT id, theme, question, options, explanation, difficulty, created_at
FROM public.questions;

-- Grant access to the view
GRANT SELECT ON public.quiz_questions TO anon, authenticated;