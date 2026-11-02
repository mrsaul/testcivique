CREATE OR REPLACE FUNCTION public.get_quiz_questions()
RETURNS TABLE (id uuid, theme public.quiz_theme, question text, options jsonb, explanation text, difficulty public.difficulty_level, created_at timestamptz)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT q.id, q.theme, q.question, q.options, NULL::text AS explanation, q.difficulty, q.created_at
  FROM public.questions q
  WHERE auth.uid() IS NOT NULL;
$$;
REVOKE ALL ON FUNCTION public.get_quiz_questions() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.get_quiz_questions() TO authenticated, service_role;
CREATE OR REPLACE VIEW public.quiz_questions WITH (security_invoker = true) AS
SELECT id, theme, question, options, explanation, difficulty, created_at FROM public.get_quiz_questions();
GRANT SELECT ON public.quiz_questions TO authenticated;
GRANT ALL ON public.quiz_questions TO service_role;
COMMENT ON FUNCTION public.get_quiz_questions() IS 'Authenticated quiz content only. Correct answers and explanations are withheld until server-side validation. Base question table stays locked.';