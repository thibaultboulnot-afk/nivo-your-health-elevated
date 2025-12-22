import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CheckCircle, Loader2, Shield, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const initializationSteps = [
  'Validation du paiement...',
  'Activation de la licence...',
  'Déblocage des modules...',
  'Synchronisation des accès...',
  'Configuration terminée !',
];

export default function Success() {
  const [searchParams] = useSearchParams();
  const programId = searchParams.get('program') || 'SYSTEM_REBOOT';
  
  const [currentStep, setCurrentStep] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= initializationSteps.length - 1) {
          clearInterval(interval);
          setTimeout(() => setIsComplete(true), 500);
          return prev;
        }
        return prev + 1;
      });
    }, 800);

    return () => clearInterval(interval);
  }, []);

  const getProgramName = (id: string) => {
    const names: Record<string, string> = {
      RAPID_PATCH: 'NIVO RAPID PATCH',
      SYSTEM_REBOOT: 'NIVO SYSTEM REBOOT',
      ARCHITECT_MODE: 'NIVO ARCHITECT MODE',
    };
    return names[id] || 'NIVO PROGRAM';
  };

  return (
    <div className="min-h-screen bg-[#050510] relative overflow-hidden text-foreground flex items-center justify-center">
      {/* Background Effects */}
      <div className="aurora absolute inset-0 pointer-events-none opacity-30" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,107,74,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,107,74,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-lg mx-4"
      >
        <div className="rounded-2xl bg-black/60 border border-white/10 backdrop-blur-xl overflow-hidden shadow-2xl p-8">
          {/* Success Icon */}
          <div className="flex justify-center mb-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.2 }}
              className="w-20 h-20 rounded-full bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center"
            >
              <CheckCircle className="w-10 h-10 text-emerald-500" />
            </motion.div>
          </div>

          {/* Title */}
          <div className="text-center mb-8">
            <h1 className="font-heading font-medium text-2xl md:text-3xl tracking-tight mb-2 text-emerald-400">
              Paiement validé
            </h1>
            <p className="text-muted-foreground font-mono text-sm">
              {'>'} transaction_status: <span className="text-emerald-500">SUCCESS</span>
            </p>
          </div>

          {/* Program Info */}
          <div className="p-4 rounded-lg bg-white/5 border border-white/10 mb-6">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-4 h-4 text-primary" />
              <span className="font-mono text-xs text-primary uppercase tracking-widest">
                Package Acquis
              </span>
            </div>
            <span className="font-mono text-lg text-foreground">{getProgramName(programId)}</span>
          </div>

          {/* Initialization Steps */}
          <div className="space-y-3 mb-8">
            <div className="flex items-center gap-2 mb-4">
              {!isComplete && <Loader2 className="w-4 h-4 text-primary animate-spin" />}
              <span className="font-mono text-xs text-muted-foreground uppercase tracking-widest">
                {isComplete ? 'Initialisation complète' : 'Initialisation des droits d\'accès...'}
              </span>
            </div>

            {initializationSteps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ 
                  opacity: index <= currentStep ? 1 : 0.3,
                  x: 0 
                }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-3 font-mono text-sm"
              >
                {index < currentStep ? (
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                ) : index === currentStep ? (
                  <Loader2 className="w-4 h-4 text-primary animate-spin" />
                ) : (
                  <div className="w-4 h-4 rounded-full border border-white/20" />
                )}
                <span className={index <= currentStep ? 'text-foreground' : 'text-muted-foreground'}>
                  {step}
                </span>
              </motion.div>
            ))}
          </div>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isComplete ? 1 : 0.5 }}
          >
            <Link to="/dashboard">
              <Button
                disabled={!isComplete}
                className="w-full h-14 bg-primary hover:bg-primary/90 text-background font-mono font-medium text-sm shadow-radioactive transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ArrowRight className="w-5 h-5 mr-2" />
                ACCÉDER AU DASHBOARD
              </Button>
            </Link>
          </motion.div>

          <p className="text-center font-mono text-[10px] text-muted-foreground mt-4">
            {'>'} redirection_ready: {isComplete ? 'true' : 'pending'}
          </p>
        </div>
      </motion.div>
    </div>
  );
}
