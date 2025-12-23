import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CheckCircle, Loader2, Shield, ArrowRight, LockOpen } from 'lucide-react';
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
  const navigate = useNavigate();
  const programId = searchParams.get('program') || 'SYSTEM_REBOOT';
  
  const [currentStep, setCurrentStep] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [typewriterText, setTypewriterText] = useState('');

  const fullText = '> Mise à jour des droits d\'accès base de données...';

  // Typewriter effect
  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index <= fullText.length) {
        setTypewriterText(fullText.slice(0, index));
        index++;
      } else {
        clearInterval(interval);
      }
    }, 40);
    return () => clearInterval(interval);
  }, []);

  // Initialization steps animation
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

  // Auto-redirect after completion - redirect to onboarding
  useEffect(() => {
    if (isComplete) {
      const timeout = setTimeout(() => {
        navigate('/onboarding');
      }, 2500);
      return () => clearTimeout(timeout);
    }
  }, [isComplete, navigate]);

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
      <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-lg mx-4"
      >
        <div className="rounded-2xl bg-black/60 border border-emerald-500/20 backdrop-blur-xl overflow-hidden shadow-2xl p-8">
          {/* Success Icon with bounce animation */}
          <div className="flex justify-center mb-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.2, 1] }}
              transition={{ 
                type: "spring", 
                delay: 0.2,
                duration: 0.8,
                times: [0, 0.6, 1]
              }}
              className="w-24 h-24 rounded-full bg-emerald-500/20 border-2 border-emerald-500/50 flex items-center justify-center shadow-[0_0_40px_rgba(16,185,129,0.3)]"
            >
              {isComplete ? (
                <LockOpen className="w-12 h-12 text-emerald-400" />
              ) : (
                <CheckCircle className="w-12 h-12 text-emerald-400" />
              )}
            </motion.div>
          </div>

          {/* Title */}
          <div className="text-center mb-6">
            <motion.h1 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="font-heading font-bold text-2xl md:text-3xl tracking-tight mb-3 text-emerald-400"
            >
              PAIEMENT VALIDÉ. LICENCE ACTIVÉE.
            </motion.h1>
            <p className="text-emerald-500/80 font-mono text-sm h-6">
              {typewriterText}
              <span className="animate-pulse">_</span>
            </p>
          </div>

          {/* Program Info */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="p-4 rounded-lg bg-emerald-500/5 border border-emerald-500/20 mb-6"
          >
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-4 h-4 text-emerald-500" />
              <span className="font-mono text-xs text-emerald-500 uppercase tracking-widest">
                Package Acquis
              </span>
            </div>
            <span className="font-mono text-lg text-emerald-400">{getProgramName(programId)}</span>
          </motion.div>

          {/* Initialization Steps */}
          <div className="space-y-3 mb-8">
            <div className="flex items-center gap-2 mb-4">
              {!isComplete && <Loader2 className="w-4 h-4 text-emerald-500 animate-spin" />}
              <span className="font-mono text-xs text-emerald-600 uppercase tracking-widest">
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
                  <Loader2 className="w-4 h-4 text-emerald-400 animate-spin" />
                ) : (
                  <div className="w-4 h-4 rounded-full border border-emerald-500/30" />
                )}
                <span className={index <= currentStep ? 'text-emerald-400' : 'text-emerald-600/50'}>
                  {step}
                </span>
              </motion.div>
            ))}
          </div>

          {/* Auto-redirect notice */}
          {isComplete && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center font-mono text-xs text-emerald-500/60 mb-4"
            >
              Redirection automatique vers le cockpit...
            </motion.p>
          )}

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isComplete ? 1 : 0.5 }}
          >
            <Button
              onClick={() => navigate('/onboarding')}
              disabled={!isComplete}
              className="w-full h-14 bg-emerald-500 hover:bg-emerald-400 text-black font-mono font-bold text-sm shadow-[0_0_30px_rgba(16,185,129,0.4)] transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowRight className="w-5 h-5 mr-2" />
              CONFIGURER MON PROFIL
            </Button>
          </motion.div>

          <p className="text-center font-mono text-[10px] text-emerald-600/50 mt-4">
            {'>'} system_status: {isComplete ? 'READY' : 'PROCESSING'}
          </p>
        </div>
      </motion.div>
    </div>
  );
}
