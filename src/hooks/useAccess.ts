import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export type AccessLevel = 'free' | 'pro';

export interface SubscriptionData {
  status: 'free' | 'pro' | 'trialing' | 'past_due' | 'canceled';
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  current_period_end: string | null;
}

export interface AccessState {
  isPro: boolean;
  accessLevel: AccessLevel;
  subscription: SubscriptionData | null;
  isLoading: boolean;
  error: string | null;
  daysUntilExpiry: number | null;
  refetch: () => Promise<void>;
}

/**
 * Hook pour gérer l'accès utilisateur basé sur la table subscriptions
 * Retourne le niveau d'accès (free/pro) et les détails de l'abonnement
 */
export function useAccess(): AccessState {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSubscription = async () => {
    if (!user) {
      setSubscription(null);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('subscriptions')
        .select('status, stripe_customer_id, stripe_subscription_id, current_period_end')
        .eq('user_id', user.id)
        .maybeSingle();

      if (fetchError) {
        console.error('[useAccess] Fetch error:', fetchError);
        setError(fetchError.message);
        setSubscription(null);
      } else if (data) {
        setSubscription(data as SubscriptionData);
      } else {
        // Pas d'abonnement trouvé - utilisateur free par défaut
        setSubscription({
          status: 'free',
          stripe_customer_id: null,
          stripe_subscription_id: null,
          current_period_end: null
        });
      }
    } catch (err) {
      console.error('[useAccess] Unexpected error:', err);
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
      setSubscription(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscription();
  }, [user?.id]);

  // Calcul du niveau d'accès
  const isPro = subscription?.status === 'pro' || subscription?.status === 'trialing';
  const accessLevel: AccessLevel = isPro ? 'pro' : 'free';

  // Calcul des jours restants avant expiration
  let daysUntilExpiry: number | null = null;
  if (subscription?.current_period_end) {
    const endDate = new Date(subscription.current_period_end);
    const now = new Date();
    const diffTime = endDate.getTime() - now.getTime();
    daysUntilExpiry = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (daysUntilExpiry < 0) daysUntilExpiry = 0;
  }

  return {
    isPro,
    accessLevel,
    subscription,
    isLoading,
    error,
    daysUntilExpiry,
    refetch: fetchSubscription
  };
}

/**
 * Hook simplifié pour vérifier rapidement l'accès Pro
 */
export function useIsPro(): boolean {
  const { isPro } = useAccess();
  return isPro;
}

/**
 * Vérifie si un contenu spécifique est accessible
 */
export function useCanAccess(requiresPro: boolean): boolean {
  const { isPro } = useAccess();
  if (!requiresPro) return true;
  return isPro;
}
