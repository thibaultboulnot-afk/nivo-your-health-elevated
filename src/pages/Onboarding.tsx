import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Terminal, User, Target, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

const OBJECTIVES = [
  { value: 'acute_pain', label: 'Douleur Aiguë' },
  { value: 'daily_maintenance', label: 'Maintenance Quotidienne' },
  { value: 'max_productivity', label: 'Productivité Max' },
  { value: 'total_disconnect', label: 'Déconnexion Totale' },
];

export default function Onboarding() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [objective, setObjective] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!firstName.trim()) {
      toast.error('Le prénom est requis');
      return;
    }

    if (!objective) {
      toast.error('Veuillez sélectionner un objectif');
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: firstName.trim(),
          last_name: lastName.trim() || null,
        })
        .eq('id', user?.id);

      if (error) throw error;

      toast.success('Configuration enregistrée');
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast.error('Erreur lors de la sauvegarde');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050510] relative overflow-hidden text-foreground flex items-center justify-center">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,107,74,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,107,74,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
      
      {/* Scanlines */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)',
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md mx-4"
      >
        <div className="rounded-2xl bg-black/80 border border-white/10 backdrop-blur-xl overflow-hidden shadow-2xl">
          {/* Header */}
          <div className="px-8 pt-8 pb-4 border-b border-white/5">
            <div className="flex items-center gap-3 mb-4">
              <Terminal className="w-5 h-5 text-primary" />
              <span className="font-mono text-xs text-primary uppercase tracking-widest">
                Configuration Système
              </span>
            </div>
            <h1 className="font-heading font-bold text-2xl text-foreground">
              Initialisation du Profil
            </h1>
            <p className="font-mono text-xs text-foreground/40 mt-2">
              &gt; system.setup.init()
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            {/* Identity Section */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <User className="w-4 h-4 text-foreground/40" />
                <span className="font-mono text-[10px] text-foreground/40 uppercase tracking-widest">
                  Identité Utilisateur
                </span>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="font-mono text-xs text-foreground/60 block mb-2">
                    Prénom *
                  </label>
                  <Input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Entrez votre prénom"
                    className="bg-transparent border-0 border-b border-white/20 rounded-none px-0 focus:border-primary focus-visible:ring-0 font-mono placeholder:text-foreground/20"
                    required
                  />
                </div>
                <div>
                  <label className="font-mono text-xs text-foreground/60 block mb-2">
                    Nom
                  </label>
                  <Input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Entrez votre nom"
                    className="bg-transparent border-0 border-b border-white/20 rounded-none px-0 focus:border-primary focus-visible:ring-0 font-mono placeholder:text-foreground/20"
                  />
                </div>
              </div>
            </div>

            {/* Objective Section */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Target className="w-4 h-4 text-foreground/40" />
                <span className="font-mono text-[10px] text-foreground/40 uppercase tracking-widest">
                  Objectif du Patch
                </span>
              </div>
              
              <Select value={objective} onValueChange={setObjective}>
                <SelectTrigger className="bg-transparent border-0 border-b border-white/20 rounded-none px-0 focus:ring-0 focus:ring-offset-0 font-mono">
                  <SelectValue placeholder="Sélectionnez votre objectif" />
                </SelectTrigger>
                <SelectContent className="bg-[#0a0a15] border-white/10">
                  {OBJECTIVES.map((obj) => (
                    <SelectItem 
                      key={obj.value} 
                      value={obj.value}
                      className="font-mono text-sm focus:bg-primary/20 focus:text-foreground"
                    >
                      {obj.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-14 bg-primary hover:bg-primary/90 text-primary-foreground font-mono font-bold text-sm shadow-[0_0_30px_rgba(255,107,74,0.4)] transition-all hover:scale-[1.02] disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  ENREGISTREMENT...
                </>
              ) : (
                <>
                  <ArrowRight className="w-5 h-5 mr-2" />
                  ENREGISTRER LA CONFIGURATION
                </>
              )}
            </Button>

            <p className="text-center font-mono text-[10px] text-foreground/30">
              &gt; config.save() // redirect.dashboard()
            </p>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
