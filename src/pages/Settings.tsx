import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useAccess } from '@/hooks/useAccess';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Save, User, Loader2, CheckCircle2, Crown, CreditCard, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

export default function Settings() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { isPro, subscription, daysUntilExpiry, isLoading: isAccessLoading } = useAccess();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [hasChanges, setHasChanges] = useState(false);
  const [isPortalLoading, setIsPortalLoading] = useState(false);

  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();
      
      if (error) throw error;
      
      if (data) {
        setFirstName(data.first_name || '');
        setLastName(data.last_name || '');
      }
      return data;
    },
    enabled: !!user,
  });

  const updateMutation = useMutation({
    mutationFn: async ({ firstName, lastName }: { firstName: string; lastName: string }) => {
      if (!user) throw new Error('Non authentifié');
      
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          first_name: firstName,
          last_name: lastName,
        });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile', user?.id] });
      toast.success('Profil mis à jour avec succès');
      setHasChanges(false);
    },
    onError: () => {
      toast.error('Erreur lors de la mise à jour');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate({ firstName, lastName });
  };

  const handleChange = (setter: React.Dispatch<React.SetStateAction<string>>, value: string) => {
    setter(value);
    setHasChanges(true);
  };

  const handleManageSubscription = async () => {
    setIsPortalLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-portal-session');

      if (error) throw new Error(error.message);

      if (data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No portal URL received');
      }
    } catch (error) {
      console.error('Portal error:', error);
      toast.error("Impossible d'accéder au portail. Avez-vous un abonnement actif ?");
    } finally {
      setIsPortalLoading(false);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#050510] flex items-center justify-center">
        <div className="text-center">
          <div className="font-mono text-[#ff6b4a] animate-pulse mb-4">
            <div className="text-sm mb-2">&gt; CHARGEMENT_CONFIG...</div>
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-[#ff6b4a]" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050510] relative overflow-hidden">
      {/* Background Effects */}
      <div className="aurora absolute inset-0 pointer-events-none opacity-30" />
      <div className="grid-background absolute inset-0 pointer-events-none opacity-10" />

      {/* Header */}
      <header className="relative z-20 px-4 md:px-6 py-4 md:py-6 border-b border-white/5">
        <div className="container mx-auto flex items-center justify-between">
          <Link 
            to="/dashboard" 
            className="flex items-center gap-2 text-white/60 hover:text-white transition-colors font-mono text-sm group p-2 -ml-2 rounded-lg hover:bg-white/5"
          >
            <ArrowLeft className="h-5 w-5 transition-transform group-hover:-translate-x-1" />
            <span className="hidden sm:inline">&lt;-- retour</span>
          </Link>
          
          <div className="font-mono text-[10px] md:text-xs text-white/30">
            RÉGLAGES
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 container mx-auto px-4 md:px-6 py-8 md:py-12">
        <div className="max-w-xl mx-auto space-y-8">
          
          {/* Subscription Section */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 md:w-10 md:h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                <Crown className="h-4 w-4 md:h-5 md:w-5 text-primary" />
              </div>
              <h2 className="font-heading text-xl md:text-2xl font-bold text-white">
                Mon Abonnement
              </h2>
            </div>

            <div className="bg-black/60 rounded-xl md:rounded-2xl border border-white/10 p-5 md:p-6 shadow-[inset_0_0_40px_rgba(0,0,0,0.5)]">
              {isAccessLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Current Plan */}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-mono text-xs text-white/50 mb-1">PLAN ACTUEL</p>
                      <div className="flex items-center gap-2">
                        {isPro ? (
                          <>
                            <span className="font-heading text-xl text-primary font-bold">NIVO PRO</span>
                            <span className="px-2 py-0.5 rounded-full bg-primary/20 text-primary font-mono text-[10px]">
                              ACTIF
                            </span>
                          </>
                        ) : (
                          <>
                            <span className="font-heading text-xl text-white/70">Gratuit</span>
                            <span className="px-2 py-0.5 rounded-full bg-white/10 text-white/50 font-mono text-[10px]">
                              GRATUIT
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Renewal Date (only for Pro) */}
                  {isPro && subscription?.current_period_end && (
                    <div className="pt-3 border-t border-white/10">
                      <p className="font-mono text-xs text-white/50 mb-1">PROCHAIN RENOUVELLEMENT</p>
                      <p className="text-white font-mono">
                        {formatDate(subscription.current_period_end)}
                        {daysUntilExpiry !== null && (
                          <span className="text-white/50 ml-2">
                            ({daysUntilExpiry} jour{daysUntilExpiry > 1 ? 's' : ''})
                          </span>
                        )}
                      </p>
                    </div>
                  )}

                  {/* Manage Button */}
                  {isPro ? (
                    <Button
                      onClick={handleManageSubscription}
                      disabled={isPortalLoading}
                      variant="outline"
                      className="w-full mt-4 border-white/20 text-white hover:bg-white/10"
                    >
                      {isPortalLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Chargement...
                        </>
                      ) : (
                        <>
                          <CreditCard className="h-4 w-4 mr-2" />
                          Gérer mon abonnement / Factures
                          <ExternalLink className="h-3 w-3 ml-2 opacity-50" />
                        </>
                      )}
                    </Button>
                  ) : (
                    <Link to="/checkout?plan=NIVO_PRO" className="block mt-4">
                      <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                        <Crown className="h-4 w-4 mr-2" />
                        Passer à NIVO PRO
                      </Button>
                    </Link>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Profile Section */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 md:w-10 md:h-10 rounded-lg bg-[#ff6b4a]/20 flex items-center justify-center">
                <User className="h-4 w-4 md:h-5 md:w-5 text-[#ff6b4a]" />
              </div>
              <h2 className="font-heading text-xl md:text-2xl font-bold text-white">
                Réglages du Profil
              </h2>
            </div>
            <p className="font-mono text-[10px] md:text-xs text-white/40 mb-4">
              &gt; config.user.modify()
            </p>

            {/* Form Container */}
            <div className="bg-black/60 rounded-xl md:rounded-2xl border border-white/10 p-5 md:p-8 shadow-[inset_0_0_40px_rgba(0,0,0,0.5)]">
              <form onSubmit={handleSubmit} className="space-y-5 md:space-y-6">
                {/* First Name */}
                <div className="space-y-2">
                  <label className="font-mono text-xs text-white/50 flex items-center gap-2">
                    PRÉNOM &gt;
                  </label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => handleChange(setFirstName, e.target.value)}
                    placeholder="Votre prénom"
                    className="w-full bg-transparent border-0 border-b border-white/20 focus:border-[#ff6b4a] px-0 py-4 font-mono text-white placeholder:text-white/20 outline-none transition-colors"
                  />
                </div>

                {/* Last Name */}
                <div className="space-y-2">
                  <label className="font-mono text-xs text-white/50 flex items-center gap-2">
                    NOM &gt;
                  </label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => handleChange(setLastName, e.target.value)}
                    placeholder="Votre nom"
                    className="w-full bg-transparent border-0 border-b border-white/20 focus:border-[#ff6b4a] px-0 py-4 font-mono text-white placeholder:text-white/20 outline-none transition-colors"
                  />
                </div>

                {/* Email (read-only) */}
                <div className="space-y-2">
                  <label className="font-mono text-xs text-white/50 flex items-center gap-2">
                    EMAIL &gt; <span className="text-white/30">(lecture seule)</span>
                  </label>
                  <input
                    type="email"
                    value={user?.email || ''}
                    disabled
                    className="w-full bg-transparent border-0 border-b border-white/10 px-0 py-3 font-mono text-white/40 outline-none cursor-not-allowed"
                  />
                </div>

                {/* Submit Button */}
                <div className="pt-3 md:pt-4">
                  <Button
                    type="submit"
                    disabled={!hasChanges || updateMutation.isPending}
                    className="w-full bg-[#ff6b4a] hover:bg-[#ff8a6a] text-black font-mono font-bold py-6 min-h-[56px] disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(255,107,74,0.4)]"
                  >
                    {updateMutation.isPending ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        SAUVEGARDE...
                      </span>
                    ) : updateMutation.isSuccess && !hasChanges ? (
                      <span className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4" />
                        MODIFICATIONS ENREGISTRÉES
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Save className="h-4 w-4" />
                        SAUVEGARDER LES MODIFICATIONS
                      </span>
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </div>

          {/* System Info */}
          <div className="p-4 bg-white/5 rounded-xl border border-white/10">
            <div className="font-mono text-xs text-white/30 space-y-1">
              <p>&gt; user_id: {user?.id?.slice(0, 8)}...</p>
              <p>&gt; statut: {isPro ? 'PRO' : 'GRATUIT'}</p>
              <p>&gt; version: NIVO_OS v2.0.4</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
