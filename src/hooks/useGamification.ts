import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface GamificationState {
  xp: number;
  level: number;
  currentStreak: number;
  streakFreezes: number;
  unlockedSkins: string[];
  subscriptionTier: 'free' | 'pro_monthly' | 'pro_yearly';
  lastActivityDate: string | null;
  isLoading: boolean;
}

// XP thresholds for levels
const LEVEL_THRESHOLDS = [
  0,      // Level 1
  500,    // Level 2
  1200,   // Level 3
  2000,   // Level 4
  3000,   // Level 5
  4500,   // Level 6
  6500,   // Level 7
  9000,   // Level 8
  12000,  // Level 9
  16000,  // Level 10
  21000,  // Level 11+
];

export function calculateLevel(xp: number): number {
  for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
    if (xp >= LEVEL_THRESHOLDS[i]) {
      return i + 1;
    }
  }
  return 1;
}

export function getXpForNextLevel(level: number): number {
  if (level >= LEVEL_THRESHOLDS.length) {
    return LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1] + (level - LEVEL_THRESHOLDS.length + 1) * 5000;
  }
  return LEVEL_THRESHOLDS[level] || LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1];
}

export function getXpProgress(xp: number, level: number): number {
  const currentLevelXp = LEVEL_THRESHOLDS[level - 1] || 0;
  const nextLevelXp = getXpForNextLevel(level);
  const progress = (xp - currentLevelXp) / (nextLevelXp - currentLevelXp);
  return Math.min(Math.max(progress, 0), 1);
}

export function useGamification() {
  const { user } = useAuth();
  const [state, setState] = useState<GamificationState>({
    xp: 0,
    level: 1,
    currentStreak: 0,
    streakFreezes: 0,
    unlockedSkins: ['standard'],
    subscriptionTier: 'free',
    lastActivityDate: null,
    isLoading: true,
  });

  const fetchGamificationData = useCallback(async () => {
    if (!user) {
      setState(prev => ({ ...prev, isLoading: false }));
      return;
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('xp, level, current_streak, streak_freezes, unlocked_skins, subscription_tier, last_activity_date')
        .eq('id', user.id)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setState({
          xp: data.xp || 0,
          level: data.level || 1,
          currentStreak: data.current_streak || 0,
          streakFreezes: data.streak_freezes || 0,
          unlockedSkins: data.unlocked_skins || ['standard'],
          subscriptionTier: (data.subscription_tier as 'free' | 'pro_monthly' | 'pro_yearly') || 'free',
          lastActivityDate: data.last_activity_date,
          isLoading: false,
        });
      } else {
        setState(prev => ({ ...prev, isLoading: false }));
      }
    } catch (error) {
      console.error('[useGamification] Error fetching data');
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, [user]);

  useEffect(() => {
    fetchGamificationData();
  }, [fetchGamificationData]);

  // Award XP and check for level up
  const awardXp = useCallback(async (amount: number, reason: string) => {
    if (!user) return;

    const newXp = state.xp + amount;
    const newLevel = calculateLevel(newXp);
    const leveledUp = newLevel > state.level;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ 
          xp: newXp, 
          level: newLevel,
          last_activity_date: new Date().toISOString().split('T')[0]
        })
        .eq('id', user.id);

      if (error) throw error;

      setState(prev => ({ ...prev, xp: newXp, level: newLevel }));

      // Notification style "Ingénierie Corporelle"
      toast.success(`+${amount} XP • ${reason}`, {
        description: leveledUp ? `Calibration Niveau ${newLevel} atteinte` : undefined,
      });

      // Check for skin unlocks
      if (newLevel >= 10 && !state.unlockedSkins.includes('xray')) {
        await unlockSkin('xray');
        toast.success('Skin X-Ray déverrouillé', {
          description: 'Module optique débloqué au Niveau 10',
        });
      }
    } catch (error) {
      console.error('[useGamification] Error awarding XP');
    }
  }, [user, state.xp, state.level, state.unlockedSkins]);

  // Update streak logic
  const updateStreak = useCallback(async () => {
    if (!user) return;

    const today = new Date().toISOString().split('T')[0];
    const lastActivity = state.lastActivityDate;
    
    let newStreak = state.currentStreak;
    let usedFreeze = false;
    let streakLost = false;

    if (!lastActivity) {
      // First activity
      newStreak = 1;
    } else {
      const lastDate = new Date(lastActivity);
      const todayDate = new Date(today);
      const diffDays = Math.floor((todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));

      if (diffDays === 0) {
        // Same day, no change
        return;
      } else if (diffDays === 1) {
        // Consecutive day
        newStreak = state.currentStreak + 1;
      } else if (diffDays > 1) {
        // Missed days - check for streak freeze
        if (state.streakFreezes > 0) {
          usedFreeze = true;
          newStreak = state.currentStreak; // Keep streak
        } else {
          streakLost = true;
          newStreak = 1; // Reset
        }
      }
    }

    try {
      const updateData: Record<string, unknown> = {
        current_streak: newStreak,
        last_activity_date: today,
      };

      if (usedFreeze) {
        updateData.streak_freezes = state.streakFreezes - 1;
      }

      const { error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', user.id);

      if (error) throw error;

      setState(prev => ({
        ...prev,
        currentStreak: newStreak,
        lastActivityDate: today,
        streakFreezes: usedFreeze ? prev.streakFreezes - 1 : prev.streakFreezes,
      }));

      if (usedFreeze) {
        toast.info('Protection Système Activée 🛡️', {
          description: `Série préservée. ${state.streakFreezes - 1} joker(s) restant(s)`,
        });
      } else if (streakLost) {
        toast.warning('Signal Perdu. Recalibrage requis ⚠️', {
          description: 'Série réinitialisée. Recommencez.',
        });
      }
    } catch (error) {
      console.error('[useGamification] Error updating streak');
    }
  }, [user, state.lastActivityDate, state.currentStreak, state.streakFreezes]);

  // Award streak freeze (double session bonus)
  const awardStreakFreeze = useCallback(async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ streak_freezes: state.streakFreezes + 1 })
        .eq('id', user.id);

      if (error) throw error;

      setState(prev => ({ ...prev, streakFreezes: prev.streakFreezes + 1 }));
      
      toast.success('Joker Série acquis 🛡️', {
        description: 'Double session détectée. Protection activable.',
      });
    } catch (error) {
      console.error('[useGamification] Error awarding streak freeze');
    }
  }, [user, state.streakFreezes]);

  // Unlock skin
  const unlockSkin = useCallback(async (skinId: string) => {
    if (!user || state.unlockedSkins.includes(skinId)) return;

    const newSkins = [...state.unlockedSkins, skinId];

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ unlocked_skins: newSkins })
        .eq('id', user.id);

      if (error) throw error;

      setState(prev => ({ ...prev, unlockedSkins: newSkins }));
    } catch (error) {
      console.error('[useGamification] Error unlocking skin');
    }
  }, [user, state.unlockedSkins]);

  // Check if today had morning + evening session (double session)
  const checkDoubleSession = useCallback(async () => {
    if (!user) return false;

    const today = new Date().toISOString().split('T')[0];
    
    const { data, error } = await supabase
      .from('routine_sessions')
      .select('created_at')
      .eq('user_id', user.id)
      .gte('created_at', `${today}T00:00:00`)
      .lte('created_at', `${today}T23:59:59`);

    if (error || !data) return false;

    // Check if there's a morning (before 12:00) and evening (after 12:00) session
    const morningSession = data.some(s => new Date(s.created_at).getHours() < 12);
    const eveningSession = data.some(s => new Date(s.created_at).getHours() >= 12);

    return morningSession && eveningSession;
  }, [user]);

  // Complete session handler
  const completeAudioSession = useCallback(async () => {
    await updateStreak();
    await awardXp(100, 'Séance Audio complétée');

    // Check for double session bonus
    const isDoubleSession = await checkDoubleSession();
    if (isDoubleSession) {
      await awardXp(200, 'Double Session (Matin + Soir)');
      await awardStreakFreeze();
    }
  }, [updateStreak, awardXp, checkDoubleSession, awardStreakFreeze]);

  // Complete scan handler
  const completeScan = useCallback(async () => {
    await awardXp(50, 'Scan Webcam effectué');
  }, [awardXp]);

  return {
    ...state,
    xpProgress: getXpProgress(state.xp, state.level),
    xpForNextLevel: getXpForNextLevel(state.level),
    awardXp,
    updateStreak,
    awardStreakFreeze,
    unlockSkin,
    completeAudioSession,
    completeScan,
    refetch: fetchGamificationData,
    isPro: state.subscriptionTier !== 'free',
  };
}
