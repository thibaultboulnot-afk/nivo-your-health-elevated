import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Crown, Zap, Shield, Headphones, ArrowRight, Loader2, Check, Sparkles, Building2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { safeStripeRedirect } from '@/lib/url-validator';
import { ExitIntentModal } from '@/components/ExitIntentModal';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultBillingCycle?: 'monthly' | 'yearly' | 'lifetime';
}

// Stripe Price IDs (Production)
const PRICE_IDS = {
  monthly: 'price_1SmXImJZ4N5U4jZszsdeJbcl',
  yearly: 'price_1SmXIpJZ4N5U4jZsDpMNwyLR',
  lifetime: 'price_1SmXIsJZ4N5U4jZsk4LlZSBE',
  streak_freeze: 'price_1SmXIvJZ4N5U4jZsGPUx2lk7',
};

type PlanType = 'monthly' | 'yearly' | 'lifetime';

export function UpgradeModal({ isOpen, onClose, defaultBillingCycle }: UpgradeModalProps) {
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [loadingPlan, setLoadingPlan] = useState<PlanType | null>(null);
  const [showExitIntent, setShowExitIntent] = useState(false);
  const { toast } = useToast();

  // Determine initial billing cycle from: prop > URL param > localStorage > default yearly
  const getInitialBillingCycle = (): PlanType => {
    if (defaultBillingCycle) return defaultBillingCycle;
    
    const urlPlan = searchParams.get('plan');
    if (urlPlan === 'monthly' || urlPlan === 'yearly' || urlPlan === 'lifetime') return urlPlan;
    
    const storedPlan = localStorage.getItem('nivo_preferred_plan');
    if (storedPlan === 'monthly' || storedPlan === 'yearly' || storedPlan === 'lifetime') return storedPlan;
    
    return 'yearly';
  };

  const [selectedPlan, setSelectedPlan] = useState<PlanType>(getInitialBillingCycle);

  // Update billing cycle when URL param changes
  useEffect(() => {
    const urlPlan = searchParams.get('plan');
    if (urlPlan === 'monthly' || urlPlan === 'yearly' || urlPlan === 'lifetime') {
      setSelectedPlan(urlPlan);
    }
  }, [searchParams]);

  // Store preference when changed
  const handlePlanChange = (plan: PlanType) => {
    setSelectedPlan(plan);
    localStorage.setItem('nivo_preferred_plan', plan);
  };

  // Handle modal close with exit intent for lifetime
  const handleClose = () => {
    if (selectedPlan === 'lifetime' && !showExitIntent) {
      setShowExitIntent(true);
    } else {
      onClose();
    }
  };

  const handleDownsell = async () => {
    setShowExitIntent(false);
    handlePlanChange('monthly');
    // Initiate checkout with discounted monthly (implementation would need a special discount price)
    await handleUpgrade('monthly');
  };

  const features = [
    { icon: Headphones, text: 'Protocoles ciblés (Sciatique, Cou Texto...)' },
    { icon: Zap, text: 'Programmes pilotes de 6+ semaines' },
    { icon: Shield, text: 'Algorithme personnalisé NIVO' },
    { icon: Crown, text: '30+ Skins Exclusifs (Scanner)' },
  ];

  const plans = {
    monthly: { amount: 9.90, period: '/mois', savings: null, mode: 'subscription' as const },
    yearly: { amount: 99, period: '/an', savings: '17%', mode: 'subscription' as const },
    lifetime: { amount: 149, period: 'une fois', savings: 'À VIE', mode: 'payment' as const },
  };

  const handleUpgrade = async (plan: PlanType = selectedPlan) => {
    setIsLoading(true);
    setLoadingPlan(plan);
    try {
      const priceId = PRICE_IDS[plan];
      const mode = plans[plan].mode;
      
      const { data, error } = await supabase.functions.invoke('create-checkout-session', {
        body: { priceId, mode }
      });

      if (error) {
        throw new Error(error.message);
      }

      if (data?.url) {
        if (!safeStripeRedirect(data.url)) {
          throw new Error('URL de paiement invalide');
        }
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de créer la session de paiement. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setLoadingPlan(null);
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-lg bg-zinc-950/90 backdrop-blur-2xl border border-white/10 p-0 overflow-hidden shadow-[0_8px_32px_0_rgba(0,0,0,0.36)]">
          {/* Glow effect */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-80 h-40 bg-primary/20 rounded-full blur-3xl" />
          </div>

          <div className="relative p-6 md:p-8">
            <DialogHeader className="text-center mb-6">
              {/* Pro Badge */}
              <div className="mx-auto mb-4 w-16 h-16 rounded-2xl bg-primary/20 border border-primary/30 flex items-center justify-center">
                <Crown className="h-8 w-8 text-primary" strokeWidth={1.5} />
              </div>
              
              <DialogTitle className="font-heading text-2xl md:text-3xl font-bold text-foreground">
                Passez à NIVO PRO
              </DialogTitle>
              
              <DialogDescription className="font-mono text-sm text-foreground/50 mt-2">
                Débloquez l'intégralité de votre potentiel physique
              </DialogDescription>
            </DialogHeader>

            {/* Plan Selection */}
            <div className="grid grid-cols-3 gap-2 mb-6">
              {(['monthly', 'yearly', 'lifetime'] as PlanType[]).map((plan) => (
                <button
                  key={plan}
                  onClick={() => handlePlanChange(plan)}
                  className={`
                    relative px-3 py-3 rounded-xl font-mono text-xs transition-all border
                    ${selectedPlan === plan 
                      ? plan === 'lifetime'
                        ? 'bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border-amber-500/40 text-amber-400'
                        : 'bg-primary/20 border-primary/40 text-primary'
                      : 'bg-white/5 border-white/10 text-foreground/50 hover:border-white/20'
                    }
                  `}
                >
                  {plan === 'lifetime' && (
                    <span className="absolute -top-2 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-gradient-to-r from-amber-500 to-yellow-500 text-black text-[8px] font-bold rounded-full uppercase">
                      Founder
                    </span>
                  )}
                  {plans[plan].savings && plan !== 'lifetime' && (
                    <span className="absolute -top-2 -right-2 px-1.5 py-0.5 bg-primary text-primary-foreground text-[8px] font-bold rounded">
                      -{plans[plan].savings}
                    </span>
                  )}
                  <span className="block capitalize">{plan === 'monthly' ? 'Mensuel' : plan === 'yearly' ? 'Annuel' : 'Lifetime'}</span>
                </button>
              ))}
            </div>

            {/* Price Display */}
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedPlan}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.2 }}
                className="text-center mb-6"
              >
                <span className={`font-heading text-4xl font-bold ${selectedPlan === 'lifetime' ? 'text-amber-400' : 'text-foreground'}`}>
                  {plans[selectedPlan].amount}€
                </span>
                <span className="font-mono text-sm text-foreground/40 ml-1">
                  {plans[selectedPlan].period}
                </span>
                {selectedPlan === 'yearly' && (
                  <p className="font-mono text-xs text-primary mt-1">
                    Soit 8.25€/mois • Économisez 19.80€
                  </p>
                )}
                {selectedPlan === 'lifetime' && (
                  <p className="font-mono text-xs text-amber-400 mt-1">
                    🏆 Accès illimité à vie • Badge Founder exclusif
                  </p>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Features */}
            <div className="space-y-3 mb-6">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-3 p-3 bg-white/5 rounded-lg border border-white/5"
                >
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <feature.icon className="h-4 w-4 text-primary" strokeWidth={1.5} />
                  </div>
                  <span className="font-mono text-xs text-foreground/70">{feature.text}</span>
                  <Check className="w-4 h-4 text-primary ml-auto shrink-0" strokeWidth={1.5} />
                </motion.div>
              ))}
            </div>

            {/* CTA Button */}
            <Button 
              onClick={() => handleUpgrade()}
              disabled={isLoading}
              className={`w-full h-14 font-bold text-lg transition-all duration-300 disabled:opacity-70 ${
                selectedPlan === 'lifetime'
                  ? 'bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-black shadow-[0_0_30px_rgba(245,158,11,0.4)]'
                  : 'bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_0_30px_rgba(255,107,74,0.4)]'
              }`}
            >
              {isLoading && loadingPlan === selectedPlan ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Chargement...
                </>
              ) : (
                <>
                  {selectedPlan === 'lifetime' ? (
                    <Sparkles className="h-5 w-5 mr-2" strokeWidth={1.5} />
                  ) : (
                    <Crown className="h-5 w-5 mr-2" strokeWidth={1.5} />
                  )}
                  {selectedPlan === 'lifetime' ? 'DEVENIR FOUNDER' : selectedPlan === 'yearly' ? 'DEVENIR PRO ANNUEL' : 'DEVENIR PRO'}
                  <ArrowRight className="h-5 w-5 ml-2" strokeWidth={1.5} />
                </>
              )}
            </Button>

            {/* B2B Invoice mention for lifetime */}
            {selectedPlan === 'lifetime' && (
              <div className="mt-4 p-3 bg-white/5 border border-white/10 rounded-lg flex items-center gap-3">
                <Building2 className="w-5 h-5 text-foreground/40 shrink-0" strokeWidth={1.5} />
                <p className="font-mono text-[10px] text-foreground/40">
                  Générez une facture pro pour votre remboursement employeur.
                </p>
              </div>
            )}

            {/* Cancel hint */}
            <p className="text-center font-mono text-[10px] text-foreground/30 mt-4">
              {selectedPlan === 'lifetime' ? 'Paiement unique • Accès à vie' : 'Annulable à tout moment'} • Paiement sécurisé Stripe
            </p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Exit Intent Modal for Lifetime */}
      <ExitIntentModal 
        isOpen={showExitIntent}
        onClose={() => {
          setShowExitIntent(false);
          onClose();
        }}
        onAcceptDownsell={handleDownsell}
      />
    </>
  );
}
