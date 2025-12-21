import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Save, User, Loader2, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

export default function Settings() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [hasChanges, setHasChanges] = useState(false);

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
      <header className="relative z-20 px-6 py-6 border-b border-white/5">
        <div className="container mx-auto flex items-center justify-between">
          <Link 
            to="/dashboard" 
            className="flex items-center gap-2 text-white/40 hover:text-white transition-colors font-mono text-sm group"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            <span>&lt;-- retour_cockpit</span>
          </Link>
          
          <div className="font-mono text-xs text-white/30">
            NIVO_OS :: RÉGLAGES_SYSTÈME
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 container mx-auto px-6 py-12">
        <div className="max-w-xl mx-auto">
          {/* Title */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-[#ff6b4a]/20 flex items-center justify-center">
                <User className="h-5 w-5 text-[#ff6b4a]" />
              </div>
              <h1 className="font-heading text-2xl font-bold text-white">
                Réglages du Profil
              </h1>
            </div>
            <p className="font-mono text-xs text-white/40">
              &gt; config.user.modify()
            </p>
          </div>

          {/* Form Container */}
          <div className="bg-black/60 rounded-2xl border border-white/10 p-8 shadow-[inset_0_0_40px_rgba(0,0,0,0.5)]">
            <form onSubmit={handleSubmit} className="space-y-6">
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
                  className="w-full bg-transparent border-0 border-b border-white/20 focus:border-[#ff6b4a] px-0 py-3 font-mono text-white placeholder:text-white/20 outline-none transition-colors"
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
                  className="w-full bg-transparent border-0 border-b border-white/20 focus:border-[#ff6b4a] px-0 py-3 font-mono text-white placeholder:text-white/20 outline-none transition-colors"
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
              <div className="pt-4">
                <Button
                  type="submit"
                  disabled={!hasChanges || updateMutation.isPending}
                  className="w-full bg-[#ff6b4a] hover:bg-[#ff8a6a] text-black font-mono font-bold py-6 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(255,107,74,0.4)]"
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

          {/* System Info */}
          <div className="mt-8 p-4 bg-white/5 rounded-xl border border-white/10">
            <div className="font-mono text-xs text-white/30 space-y-1">
              <p>&gt; user_id: {user?.id?.slice(0, 8)}...</p>
              <p>&gt; status: ACTIF</p>
              <p>&gt; version: NIVO_OS v2.0.4</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
