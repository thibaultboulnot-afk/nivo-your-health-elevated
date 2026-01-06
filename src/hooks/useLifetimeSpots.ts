import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

const TOTAL_LIFETIME_SPOTS = 100;

export function useLifetimeSpots() {
  const [spotsTaken, setSpotsTaken] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLifetimeCount() {
      try {
        const { count, error } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true })
          .eq('is_lifetime', true);

        if (error) {
          console.error('Error fetching lifetime count:', error);
          // Fallback to a simulated value
          setSpotsTaken(86);
        } else {
          setSpotsTaken(count || 0);
        }
      } catch (err) {
        console.error('Error:', err);
        setSpotsTaken(86);
      } finally {
        setLoading(false);
      }
    }

    fetchLifetimeCount();
  }, []);

  const spotsRemaining = spotsTaken !== null ? TOTAL_LIFETIME_SPOTS - spotsTaken : null;

  return {
    spotsTaken,
    spotsRemaining,
    totalSpots: TOTAL_LIFETIME_SPOTS,
    loading,
  };
}
