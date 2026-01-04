import { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { Crosshair, Headphones, Sparkles, ArrowRight, Rocket } from 'lucide-react';

interface TutorialModalProps {
  isOpen: boolean;
  onComplete: () => void;
}

const SLIDES = [
  {
    icon: Crosshair,
    title: 'Le Scan',
    subtitle: 'CALIBRATION QUOTIDIENNE',
    description: 'Analysez votre posture en 60 secondes avec notre scanner IA. Votre Score NIVO mesure l\'intégrité structurelle de votre colonne.',
    color: 'from-primary to-orange-500',
    glowColor: 'rgba(255, 107, 74, 0.4)',
  },
  {
    icon: Headphones,
    title: 'Le Protocole',
    subtitle: 'ROUTINES AUDIO GUIDÉES',
    description: 'Des séances audio de 5 à 15 minutes conçues par des kinésithérapeutes. Matin et soir pour un maximum de résultats.',
    color: 'from-emerald-500 to-cyan-400',
    glowColor: 'rgba(16, 185, 129, 0.4)',
  },
  {
    icon: Sparkles,
    title: 'L\'Évolution',
    subtitle: 'SKINS & PROGRESSION',
    description: 'Débloquez des armures exclusives en progressant. Montez en niveau, maintenez votre série et devenez un Titan du système.',
    color: 'from-purple-500 to-pink-500',
    glowColor: 'rgba(168, 85, 247, 0.4)',
  },
];

export function TutorialModal({ isOpen, onComplete }: TutorialModalProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const isLastSlide = currentSlide === SLIDES.length - 1;
  const slide = SLIDES[currentSlide];

  const handleNext = () => {
    if (isLastSlide) {
      onComplete();
    } else {
      setCurrentSlide(prev => prev + 1);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent 
        className="sm:max-w-lg bg-zinc-950/90 backdrop-blur-2xl border border-white/10 p-0 overflow-hidden shadow-[0_8px_32px_0_rgba(0,0,0,0.36)]"
        hideClose
      >
        {/* Background glow */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-30"
          style={{ background: `radial-gradient(circle at center, ${slide.glowColor}, transparent 70%)` }}
        />

        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="relative p-8 text-center"
          >
            {/* Icon */}
            <motion.div 
              className={`mx-auto mb-6 w-20 h-20 rounded-2xl bg-gradient-to-br ${slide.color} flex items-center justify-center shadow-lg`}
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1, type: 'spring' }}
            >
              <slide.icon className="w-10 h-10 text-white" strokeWidth={1.5} />
            </motion.div>

            {/* Content */}
            <span className="font-mono text-[10px] text-foreground/40 uppercase tracking-widest block mb-2">
              {slide.subtitle}
            </span>
            <h2 className="font-heading text-3xl font-bold text-foreground mb-4">
              {slide.title}
            </h2>
            <p className="text-foreground/60 leading-relaxed max-w-sm mx-auto">
              {slide.description}
            </p>

            {/* Progress dots */}
            <div className="flex justify-center gap-2 mt-8 mb-6">
              {SLIDES.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentSlide 
                      ? 'bg-primary w-6' 
                      : index < currentSlide 
                        ? 'bg-primary/50' 
                        : 'bg-white/20'
                  }`}
                />
              ))}
            </div>

            {/* Action button */}
            <Button
              onClick={handleNext}
              className={`w-full h-14 font-bold text-lg ${
                isLastSlide 
                  ? 'bg-gradient-to-r from-primary to-orange-500 shadow-[0_0_30px_rgba(255,107,74,0.4)]' 
                  : 'bg-white/10 hover:bg-white/15 border border-white/10'
              }`}
            >
              {isLastSlide ? (
                <>
                  <Rocket className="w-5 h-5 mr-2" strokeWidth={1.5} />
                  COMMENCER L'AVENTURE
                </>
              ) : (
                <>
                  Suivant
                  <ArrowRight className="w-5 h-5 ml-2" strokeWidth={1.5} />
                </>
              )}
            </Button>

            {/* Skip link */}
            {!isLastSlide && (
              <button
                onClick={onComplete}
                className="mt-4 font-mono text-xs text-foreground/30 hover:text-foreground/50 transition-colors"
              >
                Passer le tutoriel
              </button>
            )}
          </motion.div>
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
