-- Create enum for quiz themes
CREATE TYPE public.quiz_theme AS ENUM (
  'principes_valeurs',
  'systeme_institutionnel',
  'droits_devoirs',
  'histoire_geographie',
  'vivre_societe'
);

-- Create enum for difficulty levels
CREATE TYPE public.difficulty_level AS ENUM ('facile', 'moyen', 'difficile');

-- Create questions table
CREATE TABLE public.questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  theme quiz_theme NOT NULL,
  question TEXT NOT NULL,
  options JSONB NOT NULL, -- Array of 4 options
  correct_answer INTEGER NOT NULL CHECK (correct_answer >= 0 AND correct_answer <= 3),
  explanation TEXT,
  difficulty difficulty_level DEFAULT 'moyen',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create profiles table for user data
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  display_name TEXT,
  streak_days INTEGER DEFAULT 0,
  last_practice_date DATE,
  total_questions_answered INTEGER DEFAULT 0,
  correct_answers INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create user progress per theme
CREATE TABLE public.theme_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  theme quiz_theme NOT NULL,
  questions_answered INTEGER DEFAULT 0,
  correct_answers INTEGER DEFAULT 0,
  mastery_level INTEGER DEFAULT 0 CHECK (mastery_level >= 0 AND mastery_level <= 100),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, theme)
);

-- Create quiz sessions for tracking exam attempts
CREATE TABLE public.quiz_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  session_type TEXT NOT NULL CHECK (session_type IN ('daily', 'theme', 'mock_exam')),
  theme quiz_theme,
  total_questions INTEGER NOT NULL,
  correct_answers INTEGER DEFAULT 0,
  completed BOOLEAN DEFAULT false,
  started_at TIMESTAMPTZ DEFAULT now(),
  completed_at TIMESTAMPTZ
);

-- Create user answers for detailed tracking
CREATE TABLE public.user_answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  question_id UUID REFERENCES public.questions(id) ON DELETE CASCADE NOT NULL,
  session_id UUID REFERENCES public.quiz_sessions(id) ON DELETE CASCADE,
  selected_answer INTEGER NOT NULL,
  is_correct BOOLEAN NOT NULL,
  answered_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.theme_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_answers ENABLE ROW LEVEL SECURITY;

-- Questions are readable by everyone (public content)
CREATE POLICY "Questions are publicly readable"
ON public.questions FOR SELECT
USING (true);

-- Profile policies
CREATE POLICY "Users can view own profile"
ON public.profiles FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile"
ON public.profiles FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = user_id);

-- Theme progress policies
CREATE POLICY "Users can view own theme progress"
ON public.theme_progress FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own theme progress"
ON public.theme_progress FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own theme progress"
ON public.theme_progress FOR UPDATE
USING (auth.uid() = user_id);

-- Quiz sessions policies
CREATE POLICY "Users can view own sessions"
ON public.quiz_sessions FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create own sessions"
ON public.quiz_sessions FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own sessions"
ON public.quiz_sessions FOR UPDATE
USING (auth.uid() = user_id);

-- User answers policies
CREATE POLICY "Users can view own answers"
ON public.user_answers FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own answers"
ON public.user_answers FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Create function to auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Trigger for auto-creating profile
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update streak
CREATE OR REPLACE FUNCTION public.update_streak()
RETURNS TRIGGER AS $$
DECLARE
  last_date DATE;
  current_streak INTEGER;
BEGIN
  SELECT last_practice_date, streak_days INTO last_date, current_streak
  FROM public.profiles WHERE user_id = NEW.user_id;
  
  IF last_date IS NULL OR last_date < CURRENT_DATE - INTERVAL '1 day' THEN
    current_streak := 1;
  ELSIF last_date = CURRENT_DATE - INTERVAL '1 day' THEN
    current_streak := current_streak + 1;
  END IF;
  
  UPDATE public.profiles 
  SET streak_days = current_streak, last_practice_date = CURRENT_DATE, updated_at = now()
  WHERE user_id = NEW.user_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;