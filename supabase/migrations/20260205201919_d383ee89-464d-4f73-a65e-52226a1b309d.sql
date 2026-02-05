-- Create badges enum for badge types
CREATE TYPE public.badge_type AS ENUM (
  'first_quiz',
  'streak_3',
  'streak_7',
  'streak_30',
  'perfect_quiz',
  'theme_master_principes',
  'theme_master_institutions',
  'theme_master_droits',
  'theme_master_histoire',
  'theme_master_vivre',
  'questions_50',
  'questions_100',
  'questions_500',
  'exam_passed',
  'all_themes_started'
);

-- Create user_badges table to track earned badges
CREATE TABLE public.user_badges (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  badge_type badge_type NOT NULL,
  earned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, badge_type)
);

-- Enable RLS
ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own badges"
ON public.user_badges
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own badges"
ON public.user_badges
FOR INSERT
WITH CHECK (auth.uid() = user_id);