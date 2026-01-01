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
import { Crown, Zap, Shield, Headphones, ArrowRight, Loader2, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { safeStripeRedirect } from '@/lib/url-validator';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultBillingCycle?: 'monthly' | 'yearly';
}

// Stripe Price IDs - Placeholders to be configured in .env
const PRICE_IDS = {
  monthly: 'price_1SjzmGJZ4N5U4jZsYBcSCSoo',
  yearly: 'price_1Sjzn6JZ4N5U4jZsu2S22ZCf',
};

export function UpgradeModal({ isOpen, onClose, defaultBillingCycle }: UpgradeModalProps) {
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Determine initial billing cycle from: prop > URL param > localStorage > default yearly
  const getInitialBillingCycle = (): 'monthly' | 'yearly' => {
    if (defaultBillingCycle) return defaultBillingCycle;
    
    const urlPlan = searchParams.get('plan');
    if (urlPlan === 'monthly' || urlPlan === 'yearly') return urlPlan;
    
    const storedPlan = localStorage.getItem('nivo_preferred_plan');
    if (storedPlan === 'monthly' || storedPlan === 'yearly') return storedPlan;
    
    return 'yearly';
  };

  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>(getInitialBillingCycle);

  // Update billing cycle when URL param changes
  useEffect(() => {
    const urlPlan = searchParams.get('plan');
    if (urlPlan === 'monthly' || urlPlan === 'yearly') {
      setBillingCycle(urlPlan);
    }
  }, [searchParams]);

  // Store preference when changed
  const handleBillingCycleChange = (cycle: 'monthly' | 'yearly') => {
    setBillingCycle(cycle);
    localStorage.setItem('nivo_preferred_plan', cycle);
  };

  const features = [
    { icon: Headphones, text: 'Protocoles ciblés (Sciatique, Cou Texto...)' },
    { icon: Zap, text: 'Programmes pilotes de 6+ semaines' },
    { icon: Shield, text: 'Algorithme personnalisé NIVO' },
    { icon: Crown, text: '30+ Skins Exclusifs (Scanner)' },
  ];

  const pricing = {
    monthly: { amount: 9.90, period: '/mois', savings: null },
    yearly: { amount: 99, period: '/an', savings: '20%' },
  };

  const handleUpgrade = async () => {
    setIsLoading(true);
    try {
      const priceId = PRICE_IDS[billingCycle];
      
      const { data, error } = await supabase.functions.invoke('create-checkout-session', {
        body: { priceId }
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
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-[#0a0a12] border border-white/10 p-0 overflow-hidden">
        {/* Glow effect */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-80 h-40 bg-primary/20 rounded-full blur-3xl" />
        </div>

        <div className="relative p-6 md:p-8">
          <DialogHeader className="text-center mb-6">
            {/* Pro Badge */}
            <div className="mx-auto mb-4 w-16 h-16 rounded-2xl bg-primary/20 border border-primary/30 flex items-center justify-center">
              <Crown className="h-8 w-8 text-primary" />
            </div>
            
            <DialogTitle className="font-heading text-2xl md:text-3xl font-bold text-foreground">
              Passez à NIVO PRO
            </DialogTitle>
            
            <DialogDescription className="font-mono text-sm text-foreground/50 mt-2">
              Débloquez l'intégralité de votre potentiel physique
            </DialogDescription>
          </DialogHeader>

          {/* Billing Toggle */}
          <div className="flex justify-center mb-6">
            <div className="inline-flex p-1 bg-white/5 rounded-lg border border-white/10">
              <button
                onClick={() => handleBillingCycleChange('monthly')}
                className={`
                  px-4 py-2 rounded-md font-mono text-xs transition-all
                  ${billingCycle === 'monthly' 
                    ? 'bg-white/10 text-foreground' 
                    : 'text-foreground/50 hover:text-foreground/70'
                  }
                `}
              >
                Mensuel
              </button>
              <button
                onClick={() => handleBillingCycleChange('yearly')}
                className={`
                  px-4 py-2 rounded-md font-mono text-xs transition-all relative
                  ${billingCycle === 'yearly' 
                    ? 'bg-primary/20 text-primary' 
                    : 'text-foreground/50 hover:text-foreground/70'
                  }
                `}
              >
                Annuel
                {pricing.yearly.savings && (
                  <span className="absolute -top-2 -right-2 px-1.5 py-0.5 bg-primary text-primary-foreground text-[9px] font-bold rounded">
                    -{pricing.yearly.savings}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Price Display */}
          <div className="text-center mb-6">
            <motion.div
              key={billingCycle}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              <span className="font-heading text-4xl font-bold text-foreground">
                {pricing[billingCycle].amount}€
              </span>
              <span className="font-mono text-sm text-foreground/40">
                {pricing[billingCycle].period}
              </span>
            </motion.div>
            {billingCycle === 'yearly' && (
              <p className="font-mono text-xs text-primary mt-1">
                Soit 8.25€/mois • Économisez 19.80€
              </p>
            )}
          </div>

          {/* Features */}
          <div className="space-y-3 mb-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-3 p-3 bg-white/5 rounded-lg border border-white/5"
              >
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <feature.icon className="h-4 w-4 text-primary" />
                </div>
                <span className="font-mono text-xs text-foreground/70">{feature.text}</span>
                <Check className="w-4 h-4 text-primary ml-auto shrink-0" />
              </motion.div>
            ))}
          </div>

          {/* CTA Button */}
          <Button 
            onClick={handleUpgrade}
            disabled={isLoading}
            className="w-full h-14 bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-lg shadow-[0_0_30px_rgba(74,222,128,0.4)] hover:shadow-[0_0_50px_rgba(74,222,128,0.6)] transition-all duration-300 disabled:opacity-70"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                Chargement...
              </>
            ) : (
              <>
                <Crown className="h-5 w-5 mr-2" />
                {billingCycle === 'yearly' ? 'DEVENIR PRO ANNUEL' : 'DEVENIR PRO'}
                <ArrowRight className="h-5 w-5 ml-2" />
              </>
            )}
          </Button>

          {/* Cancel hint */}
          <p className="text-center font-mono text-[10px] text-foreground/30 mt-4">
            Annulable à tout moment • Paiement sécurisé Stripe
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
