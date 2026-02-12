
-- Add defensive authorization check to update_streak function
CREATE OR REPLACE FUNCTION public.update_streak()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  last_date DATE;
  current_streak INTEGER;
BEGIN
  -- Defensive check: ensure the user_id in the new row matches the authenticated user
  IF auth.uid() IS NOT NULL AND NEW.user_id != auth.uid() THEN
    RAISE EXCEPTION 'Unauthorized: user_id mismatch';
  END IF;

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
$function$;
