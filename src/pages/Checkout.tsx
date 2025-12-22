import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Check, Lock, Shield, ArrowLeft, Terminal, Loader2, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

type ProgramTier = 'RAPID_PATCH' | 'SYSTEM_REBOOT' | 'ARCHITECT_MODE';

// Données des programmes pour la page checkout
const CHECKOUT_PROGRAMS: Record<ProgramTier, {
  name: string;
  price: number;
  duration: string;
  tag: string;
  promise: string;
  features: string[];
}> = {
  RAPID_PATCH: {
    name: 'NIVO RAPID PATCH',
    price: 49,
    duration: '14 Jours',
    tag: 'URGENCE & DOULEUR',
    promise: 'Éteindre l\'inflammation et stopper la douleur en 2 semaines.',
    features: [
      'module_décompression_lombaire',
      'protocole_tech_neck',
      'guide_audio_basique',
      'sessions_vidéo_hd[14]',
      'accès_à_vie: true'
    ]
  },
  SYSTEM_REBOOT: {
    name: 'NIVO SYSTEM REBOOT',
    price: 99,
    duration: '21 Jours',
    tag: 'RECOMMANDÉ • STANDARD',
    promise: 'La correction complète. Réalignez votre posture par défaut.',
    features: [
      'inclut: RAPID_PATCH.*',
      'module_reprogrammation_neuro',
      'intégration_neuroplasticité',
      'accès_justification_scientifique',
      'sessions_vidéo_hd[21]',
      'mises_à_jour: automatiques',
      'accès_à_vie: true'
    ]
  },
  ARCHITECT_MODE: {
    name: 'NIVO ARCHITECT MODE',
    price: 149,
    duration: '30 Jours',
    tag: 'PERFORMANCE & PRO',
    promise: 'Devenez Anti-Fragile. Pour ceux qui veulent optimiser leur focus.',
    features: [
      'inclut: SYSTEM_REBOOT.*',
      'protocole_vision_vestibulaire',
      'routine_deep_work',
      'support_prioritaire: true',
      'sessions_vidéo_hd[30]',
      'bonus_micro_exercices',
      'accès_à_vie: true'
    ]
  }
};

export default function Checkout() {
  const [searchParams] = useSearchParams();
  const planParam = searchParams.get('plan') as ProgramTier | null;
  
  // Fallback to SYSTEM_REBOOT if no plan or invalid plan
  const selectedPlan: ProgramTier = planParam && CHECKOUT_PROGRAMS[planParam] 
    ? planParam 
    : 'SYSTEM_REBOOT';
  
  const program = CHECKOUT_PROGRAMS[selectedPlan];

  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleCheckout = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-checkout-session', {
        body: { programId: selectedPlan }
      });

      if (error) {
        throw new Error(error.message || 'Erreur lors de la création de la session');
      }

      if (data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error('URL de paiement non reçue');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      toast({
        title: "Erreur de paiement",
        description: error instanceof Error ? error.message : "Une erreur est survenue",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050510] relative overflow-hidden text-foreground">
      {/* Background Effects */}
      <div className="aurora absolute inset-0 pointer-events-none opacity-30" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,107,74,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,107,74,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-border backdrop-blur-md">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-[0_0_15px_-3px_hsl(var(--primary))]">
              <span className="font-body font-bold text-lg text-background">N</span>
            </div>
            <span className="font-body text-xl font-bold tracking-tight">NIVO</span>
          </Link>
          
          <Link to="/diagnostic" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span className="font-mono text-sm hidden sm:block">Retour</span>
          </Link>
        </div>
      </nav>

      <main className="pt-24 pb-12 px-6 min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-2xl"
        >
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 mb-6">
              <Terminal className="w-4 h-4 text-primary" />
              <span className="font-mono text-sm text-primary">PASSERELLE DE PAIEMENT SÉCURISÉE</span>
            </div>

            <h1 className="font-heading font-medium text-3xl md:text-4xl tracking-tight mb-2">
              Initialisation du protocole
            </h1>
            <p className="text-muted-foreground font-mono text-sm">
              {'>'} autorisation_requise: true
            </p>
          </div>

          {/* Terminal Window */}
          <div className="rounded-2xl bg-black/60 border border-white/10 backdrop-blur-xl overflow-hidden shadow-2xl">
            {/* Terminal Header */}
            <div className="flex items-center gap-2 px-4 py-3 bg-white/5 border-b border-white/10">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <div className="w-3 h-3 rounded-full bg-green-500/80" />
              <span className="ml-3 font-mono text-xs text-muted-foreground">nivo_passerelle_paiement.sh</span>
            </div>

            {/* Centered Content */}
            <div className="p-8 md:p-12">
              <div className="flex items-center justify-center gap-2 mb-8">
                <Shield className="w-5 h-5 text-primary" />
                <span className="font-mono text-sm text-primary uppercase tracking-widest">
                  Récapitulatif de Commande
                </span>
              </div>

              {/* Package Card - Holographic - Enlarged */}
              <div className="p-8 rounded-xl bg-gradient-to-br from-primary/15 via-white/5 to-transparent border border-primary/30 relative overflow-hidden mb-8">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_3s_infinite]" />
                
                <div className="relative z-10">
                  {/* Blinking Package Name */}
                  <div className="flex items-center justify-center gap-3 mb-6">
                    <span className="font-mono text-primary text-lg animate-pulse">▶</span>
                    <span className="font-mono text-2xl md:text-3xl text-foreground font-medium">
                      {program.name}
                    </span>
                  </div>

                  <div className="flex justify-center mb-6">
                    <span className="inline-block px-3 py-1.5 rounded text-xs font-mono bg-primary/20 border border-primary/30 text-primary">
                      {program.tag}
                    </span>
                  </div>

                  {/* Features as code */}
                  <div className="font-mono text-sm space-y-2 mb-8 max-w-md mx-auto">
                    {program.features.map((feature, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="flex items-center gap-3 text-slate-400"
                      >
                        <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <span>{feature}... <span className="text-green-500">[CHARGÉ]</span></span>
                      </motion.div>
                    ))}
                  </div>

                  {/* Price - Critical Data */}
                  <div className="pt-6 border-t border-white/10 text-center">
                    <span className="font-mono text-xs text-muted-foreground uppercase tracking-wider block mb-2">
                      TOTAL_TRANSFERT
                    </span>
                    <span className="font-heading font-medium text-5xl md:text-6xl tracking-tight text-primary">
                      {program.price}€
                    </span>
                    <span className="font-mono text-sm text-muted-foreground ml-3">
                      // paiement unique
                    </span>
                  </div>
                </div>
              </div>

              {/* Security Badge */}
              <div className="flex items-center justify-center gap-3 p-4 rounded-lg bg-white/5 border border-white/10 mb-8">
                <Lock className="w-5 h-5 text-green-500" />
                <div className="font-mono text-sm">
                  <span className="text-green-500">SSL_CHIFFRÉ</span>
                  <span className="text-muted-foreground"> • 256-bit • Transaction Sécurisée</span>
                </div>
              </div>

              {/* CTA Button */}
              <Button
                onClick={handleCheckout}
                disabled={isLoading}
                className="w-full h-16 bg-primary hover:bg-primary/90 text-background font-mono font-medium text-base shadow-radioactive transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                    CONNEXION AU TERMINAL...
                  </>
                ) : (
                  <>
                    <ExternalLink className="w-5 h-5 mr-3" />
                    ACCÉDER AU TERMINAL DE PAIEMENT SÉCURISÉ
                  </>
                )}
              </Button>

              <p className="text-center font-mono text-xs text-muted-foreground mt-4">
                {'>'} Vous serez redirigé vers Stripe pour finaliser la transaction chiffrée.
              </p>
            </div>
          </div>

          {/* Already have access */}
          <div className="text-center mt-8">
            <Link to="/login">
              <Button variant="ghost" className="text-muted-foreground hover:text-foreground font-mono text-sm">
                {'>'} J'ai déjà une licence → Connexion Système
              </Button>
            </Link>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
