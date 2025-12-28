-- Add DELETE policy for profiles table (GDPR compliance)
CREATE POLICY "Users can delete own profile"
ON public.profiles
FOR DELETE
USING (auth.uid() = id);

-- Fix handle_new_user function to set search_path properly
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Validate that NEW.id is not null
  IF NEW.id IS NULL THEN
    RAISE WARNING 'handle_new_user: User ID is null';
    RETURN NEW;
  END IF;
  
  INSERT INTO public.profiles (id, first_name, email)
  VALUES (NEW.id, NEW.raw_user_meta_data ->> 'first_name', NEW.email)
  ON CONFLICT (id) DO NOTHING;

  INSERT INTO public.user_progression (user_id, program_id, unlocked)
  VALUES (NEW.id, 'SYSTEM_REBOOT', false)
  ON CONFLICT DO NOTHING;

  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log error but don't fail user creation
    RAISE WARNING 'handle_new_user failed for user %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$;

-- Update handle_new_user_subscription to add validation
CREATE OR REPLACE FUNCTION public.handle_new_user_subscription()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Validate that NEW.id is not null
  IF NEW.id IS NULL THEN
    RAISE WARNING 'handle_new_user_subscription: User ID is null';
    RETURN NEW;
  END IF;
  
  -- Only process INSERT operations
  IF TG_OP != 'INSERT' THEN
    RAISE WARNING 'handle_new_user_subscription: Called on non-INSERT operation';
    RETURN NEW;
  END IF;

  INSERT INTO public.subscriptions (user_id, status, created_at, updated_at)
  VALUES (NEW.id, 'free', NOW(), NOW())
  ON CONFLICT (user_id) DO NOTHING;
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log error but don't fail user creation
    RAISE WARNING 'handle_new_user_subscription failed for user %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$;