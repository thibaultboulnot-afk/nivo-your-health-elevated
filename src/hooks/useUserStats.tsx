import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface UserStats {
  firstName: string | null;
  lastName: string | null;
  nivoScore: number | null;
  streak: number;
  totalSessions: number;
  lastCheckinDate: string | null;
}

export function useUserStats() {
  const { user } = useAuth();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchUserStats = async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);

      // Fetch profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('first_name, last_name')
        .eq('id', user.id)
        .maybeSingle();

      if (profileError) throw profileError;

      // Fetch latest NIVO score
      const { data: latestScore, error: scoreError } = await supabase
        .from('nivo_scores')
        .select('total_score, score_date')
        .eq('user_id', user.id)
        .order('score_date', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (scoreError) throw scoreError;

      // Fetch latest checkin date
      const { data: latestCheckin, error: checkinError } = await supabase
        .from('daily_checkins')
        .select('checkin_date')
        .eq('user_id', user.id)
        .order('checkin_date', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (checkinError) throw checkinError;

      // Count total routine sessions
      const { count: sessionsCount, error: sessionsError } = await supabase
        .from('routine_sessions')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);

      if (sessionsError) throw sessionsError;

      // Calculate streak (consecutive days with sessions)
      const { data: recentSessions, error: streakError } = await supabase
        .from('routine_sessions')
        .select('session_date')
        .eq('user_id', user.id)
        .order('session_date', { ascending: false })
        .limit(30);

      if (streakError) throw streakError;

      let streak = 0;
      if (recentSessions && recentSessions.length > 0) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const uniqueDates = [...new Set(recentSessions.map(s => s.session_date))].sort().reverse();
        
        for (let i = 0; i < uniqueDates.length; i++) {
          const sessionDate = new Date(uniqueDates[i]);
          sessionDate.setHours(0, 0, 0, 0);
          
          const expectedDate = new Date(today);
          expectedDate.setDate(today.getDate() - i);
          
          if (sessionDate.getTime() === expectedDate.getTime()) {
            streak++;
          } else {
            break;
          }
        }
      }

      setStats({
        firstName: profile?.first_name || user.user_metadata?.first_name || null,
        lastName: profile?.last_name || null,
        nivoScore: latestScore?.total_score || null,
        streak,
        totalSessions: sessionsCount || 0,
        lastCheckinDate: latestCheckin?.checkin_date || null,
      });
    } catch (e) {
      setError(e as Error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserStats();
  }, [user]);

  return { stats, isLoading, error, refetch: fetchUserStats };
}
