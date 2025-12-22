import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import type { ProgramTier } from '@/data/programs';

interface UserStats {
  firstName: string | null;
  lastName: string | null;
  healthScore: number | null;
  currentProgram: ProgramTier;
  currentDay: number;
  streak: number;
  totalPatches: number;
  unlockedPrograms: ProgramTier[];
}

export function useUserStats() {
  const { user } = useAuth();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    async function fetchUserStats() {
      try {
        setIsLoading(true);

        // Fetch profile
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('first_name, last_name')
          .eq('id', user.id)
          .maybeSingle();

        if (profileError) throw profileError;

        // Fetch latest diagnostic
        const { data: diagnostic, error: diagnosticError } = await supabase
          .from('user_diagnostics')
          .select('health_score')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (diagnosticError) throw diagnosticError;

        // Fetch progression
        const { data: progressions, error: progressionError } = await supabase
          .from('user_progression')
          .select('program_id, current_day, streak_count, unlocked')
          .eq('user_id', user.id);

        if (progressionError) throw progressionError;

        // Find active program (the one with most recent activity or first unlocked)
        const activeProgression = progressions?.find(p => p.unlocked) || progressions?.[0];
        
        // Get unlocked programs
        const unlockedPrograms = progressions
          ?.filter(p => p.unlocked)
          .map(p => p.program_id as ProgramTier) || [];

        setStats({
          firstName: profile?.first_name || user.user_metadata?.first_name || null,
          lastName: profile?.last_name || null,
          healthScore: diagnostic?.health_score || null,
          currentProgram: (activeProgression?.program_id as ProgramTier) || 'SYSTEM_REBOOT',
          currentDay: activeProgression?.current_day || 1,
          streak: activeProgression?.streak_count || 0,
          totalPatches: progressions?.reduce((acc, p) => acc + (p.current_day || 0), 0) || 0,
          unlockedPrograms: unlockedPrograms.length > 0 ? unlockedPrograms : ['SYSTEM_REBOOT'],
        });
      } catch (e) {
        setError(e as Error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchUserStats();
  }, [user]);

  return { stats, isLoading, error, refetch: () => {} };
}
