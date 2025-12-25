-- =============================================
-- PIVOT NIVO SaaS : ARCHITECTURE COMPLÈTE
-- =============================================

-- 1. Fonction utilitaire pour updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- 2. Table des abonnements (Stripe Subscriptions)
CREATE TABLE public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  status TEXT NOT NULL DEFAULT 'free' CHECK (status IN ('free', 'pro', 'trialing', 'past_due', 'canceled')),
  current_period_start TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  canceled_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  UNIQUE(user_id)
);

-- 3. Table des check-ins quotidiens (NIVO Score inputs)
CREATE TABLE public.daily_checkins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  checkin_date DATE NOT NULL DEFAULT CURRENT_DATE,
  
  -- Indice Subjectif (W_1 = 0.45)
  pain_vas INTEGER CHECK (pain_vas >= 0 AND pain_vas <= 100),
  fatigue_vas INTEGER CHECK (fatigue_vas >= 0 AND fatigue_vas <= 100),
  stiffness_vas INTEGER CHECK (stiffness_vas >= 0 AND stiffness_vas <= 100),
  
  -- Indice de Charge (W_3 = 0.25)
  hours_seated DECIMAL(4,2) CHECK (hours_seated >= 0 AND hours_seated <= 24),
  stress_level INTEGER CHECK (stress_level >= 1 AND stress_level <= 5),
  
  -- Questions Roland-Morris rotatives
  rmdq_answers JSONB,
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, checkin_date)
);

-- 4. Table des tests physiques (Indice Fonctionnel)
CREATE TABLE public.physical_tests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  test_date DATE NOT NULL DEFAULT CURRENT_DATE,
  
  finger_floor_distance_cm INTEGER,
  wall_angel_contacts INTEGER CHECK (wall_angel_contacts >= 0 AND wall_angel_contacts <= 5),
  mcgill_plank_seconds INTEGER CHECK (mcgill_plank_seconds >= 0),
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- 5. Table historique du NIVO Score
CREATE TABLE public.nivo_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  score_date DATE NOT NULL DEFAULT CURRENT_DATE,
  
  total_score INTEGER NOT NULL CHECK (total_score >= 0 AND total_score <= 100),
  subjective_index INTEGER CHECK (subjective_index >= 0 AND subjective_index <= 100),
  functional_index INTEGER CHECK (functional_index >= 0 AND functional_index <= 100),
  load_index INTEGER CHECK (load_index >= 0 AND load_index <= 100),
  
  decay_applied BOOLEAN DEFAULT false,
  checkin_id UUID REFERENCES public.daily_checkins(id),
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, score_date)
);

-- 6. Table des sessions de routine complétées
CREATE TABLE public.routine_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  session_date DATE NOT NULL DEFAULT CURRENT_DATE,
  
  routine_type TEXT NOT NULL CHECK (routine_type IN ('daily_loop', 'reset', 'stiffness', 'decompression', 'emergency', 'advanced')),
  is_premium BOOLEAN DEFAULT false,
  
  duration_seconds INTEGER NOT NULL,
  completed BOOLEAN DEFAULT true,
  score_boost INTEGER DEFAULT 0,
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- =============================================
-- RLS POLICIES
-- =============================================

ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_checkins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.physical_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nivo_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.routine_sessions ENABLE ROW LEVEL SECURITY;

-- Subscriptions
CREATE POLICY "sub_select_own" ON public.subscriptions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "sub_insert_own" ON public.subscriptions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "sub_update_own" ON public.subscriptions FOR UPDATE USING (auth.uid() = user_id);

-- Daily Checkins
CREATE POLICY "checkin_select_own" ON public.daily_checkins FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "checkin_insert_own" ON public.daily_checkins FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "checkin_update_own" ON public.daily_checkins FOR UPDATE USING (auth.uid() = user_id);

-- Physical Tests
CREATE POLICY "test_select_own" ON public.physical_tests FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "test_insert_own" ON public.physical_tests FOR INSERT WITH CHECK (auth.uid() = user_id);

-- NIVO Scores
CREATE POLICY "score_select_own" ON public.nivo_scores FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "score_insert_own" ON public.nivo_scores FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Routine Sessions
CREATE POLICY "session_select_own" ON public.routine_sessions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "session_insert_own" ON public.routine_sessions FOR INSERT WITH CHECK (auth.uid() = user_id);

-- =============================================
-- TRIGGERS
-- =============================================

CREATE TRIGGER update_subscriptions_updated_at
  BEFORE UPDATE ON public.subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- =============================================
-- AUTO-CREATE FREE SUBSCRIPTION FOR NEW USERS
-- =============================================

CREATE OR REPLACE FUNCTION public.handle_new_user_subscription()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.subscriptions (user_id, status)
  VALUES (NEW.id, 'free')
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created_subscription
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user_subscription();