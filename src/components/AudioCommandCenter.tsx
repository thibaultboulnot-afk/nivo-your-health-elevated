import { useRef, useState, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Radio, Waves, CheckCircle2, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';

type SessionState = 'idle' | 'playing' | 'completed';

interface AudioCommandCenterProps {
  audioUrl: string;
  isPlaying: boolean;
  onTogglePlay: () => void;
  timerDisplay: string;
  timerProgress: number; // 0 to 1
  onTimerToggle: () => void;
  isTimerActive: boolean;
  onSessionComplete?: () => void;
}

export function AudioCommandCenter({
  audioUrl,
  isPlaying,
  onTogglePlay,
  timerDisplay,
  timerProgress,
  onTimerToggle,
  isTimerActive,
  onSessionComplete,
}: AudioCommandCenterProps) {
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [sessionState, setSessionState] = useState<SessionState>('idle');
  const [showXpGain, setShowXpGain] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(() => {});
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

  // Update session state based on timer
  useEffect(() => {
    if (isTimerActive && sessionState === 'idle') {
      setSessionState('playing');
    }
  }, [isTimerActive, sessionState]);

  // Handle session completion
  const handleCompleteSession = () => {
    setSessionState('completed');
    setShowXpGain(true);
    
    // Trigger XP animation
    setTimeout(() => {
      setShowXpGain(false);
      onSessionComplete?.();
    }, 3000);
  };

  // Animated waveform bars
  const bars = 28;

  // State-specific content
  const renderStateContent = () => {
    switch (sessionState) {
      case 'idle':
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center"
          >
            <p className="font-mono text-xs text-foreground/50 max-w-xs mx-auto leading-relaxed">
              Préparez-vous. Éloignez-vous de l'écran.
              <br />
              <span className="text-emerald-400">Fermez les yeux.</span>
            </p>
          </motion.div>
        );
      case 'playing':
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center"
          >
            <p className="font-mono text-xs text-foreground/50 max-w-xs mx-auto leading-relaxed">
              Suivez les instructions audio.
              <br />
              <span className="text-emerald-400">Respirez...</span>
            </p>
          </motion.div>
        );
      case 'completed':
        return (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 text-emerald-400">
              <CheckCircle2 className="w-5 h-5" />
              <span className="font-mono text-sm">Session terminée !</span>
            </div>
          </motion.div>
        );
    }
  };
  
  return (
    <div className="w-full max-w-lg mx-auto">
      {/* Hidden Audio Element */}
      <audio ref={audioRef} src={audioUrl} preload="metadata" loop />

      {/* XP Gain Animation Overlay */}
      <AnimatePresence>
        {showXpGain && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.8 }}
            className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
          >
            <div className="relative">
              {/* Glow burst */}
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: [0, 2, 2.5], opacity: [0, 0.5, 0] }}
                transition={{ duration: 1.5 }}
                className="absolute inset-0 w-40 h-40 -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 rounded-full bg-emerald-500/30 blur-3xl"
              />
              
              {/* XP Badge */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.2, 1] }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="relative nivo-glass-intense px-8 py-6 rounded-2xl border border-emerald-500/30"
              >
                <div className="flex items-center gap-3">
                  <Sparkles className="w-8 h-8 text-emerald-400" />
                  <div>
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                      className="font-heading text-4xl font-bold text-emerald-400"
                    >
                      +100 XP
                    </motion.span>
                    <p className="font-mono text-xs text-foreground/50">Session complétée</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Command Center Container - Obsidian Glass */}
      <div className="relative nivo-glass-intense rounded-2xl p-6 md:p-8">
        {/* Top glow through glass */}
        <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-40 bg-emerald-500/10 blur-[60px]" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-60 h-20 bg-emerald-500/5 blur-[40px]" />
        </div>

        {/* Header Status */}
        <div className="relative text-center mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 nivo-glass-static rounded-full">
            <Radio className={`w-3 h-3 ${sessionState === 'playing' ? 'text-emerald-400 animate-pulse' : sessionState === 'completed' ? 'text-emerald-400' : 'text-foreground/30'}`} />
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-emerald-400">
              {sessionState === 'idle' && 'En attente'}
              {sessionState === 'playing' && 'Session en cours'}
              {sessionState === 'completed' && 'Terminé'}
            </span>
          </div>
        </div>

        {/* State-specific message */}
        <div className="mb-6">
          {renderStateContent()}
        </div>

        {/* Animated Waveform with Glow */}
        <div className="relative h-28 md:h-36 mb-8 flex items-center justify-center gap-[2px] md:gap-1 waveform-glow">
          {Array.from({ length: bars }).map((_, i) => {
            const centerDistance = Math.abs(i - bars / 2) / (bars / 2);
            const baseHeight = 1 - centerDistance * 0.6;
            
            return (
              <motion.div
                key={i}
                className="w-1 md:w-1.5 rounded-full bg-gradient-to-t from-emerald-600 to-emerald-400"
                animate={sessionState === 'playing' ? {
                  height: [
                    `${baseHeight * 15}%`,
                    `${baseHeight * 100}%`,
                    `${baseHeight * 35}%`,
                    `${baseHeight * 85}%`,
                    `${baseHeight * 15}%`,
                  ],
                } : sessionState === 'completed' ? {
                  height: `${baseHeight * 60}%`,
                } : {
                  height: `${baseHeight * 25}%`,
                }}
                transition={sessionState === 'playing' ? {
                  duration: 0.6 + Math.random() * 0.5,
                  repeat: Infinity,
                  delay: i * 0.015,
                  ease: 'easeInOut',
                } : {
                  duration: 0.4,
                }}
                style={{
                  opacity: sessionState === 'completed' ? 0.8 : 0.4 + baseHeight * 0.6,
                  boxShadow: sessionState === 'playing' 
                    ? `0 0 ${10 + baseHeight * 10}px rgba(74, 222, 128, ${0.3 + baseHeight * 0.3})`
                    : sessionState === 'completed'
                    ? `0 0 15px rgba(74, 222, 128, 0.5)`
                    : 'none',
                }}
              />
            );
          })}
          
          {/* Edge fade for immersion */}
          <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-[rgba(8,8,12,0.75)] to-transparent pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-[rgba(8,8,12,0.75)] to-transparent pointer-events-none" />
        </div>

        {/* Timer Display */}
        <motion.div 
          className="text-center mb-8"
          animate={sessionState === 'playing' ? { scale: [1, 1.01, 1] } : {}}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <div className="nivo-glass-static inline-block px-8 py-4 rounded-xl">
            <span className={`font-mono text-5xl md:text-6xl font-bold tracking-tight ${sessionState === 'completed' ? 'text-emerald-400' : 'text-foreground'}`}>
              {sessionState === 'completed' ? '00:00' : timerDisplay}
            </span>
          </div>
          <div className="mt-4 mx-auto max-w-xs h-1.5 xp-bar-inset rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full"
              style={{ width: sessionState === 'completed' ? '100%' : `${timerProgress * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </motion.div>

        {/* Control Buttons */}
        <div className="flex items-center justify-center gap-6">
          {/* Volume Toggle */}
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="p-4 rounded-full nivo-glass hover:border-emerald-500/30 transition-all"
            disabled={sessionState === 'completed'}
          >
            {isMuted ? <VolumeX className="w-5 h-5 text-foreground/50" /> : <Volume2 className="w-5 h-5 text-emerald-400" />}
          </button>

          {/* Main Button - Changes based on state */}
          {sessionState === 'completed' ? (
            <Button
              onClick={handleCompleteSession}
              size="lg"
              className="h-24 px-8 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white btn-refraction shadow-[0_0_50px_rgba(74,222,128,0.4)] hover:shadow-[0_0_70px_rgba(74,222,128,0.6)] transition-all duration-300 border border-emerald-400/30"
            >
              <CheckCircle2 className="w-6 h-6 mr-2" />
              <span className="font-mono text-sm">Terminer</span>
            </Button>
          ) : (
            <Button
              onClick={() => {
                onTogglePlay();
                onTimerToggle();
              }}
              size="lg"
              className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white btn-refraction shadow-[0_0_50px_rgba(74,222,128,0.4)] hover:shadow-[0_0_70px_rgba(74,222,128,0.6)] transition-all duration-300 border border-emerald-400/30"
            >
              <AnimatePresence mode="wait">
                {sessionState === 'playing' ? (
                  <motion.div
                    key="pause"
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    exit={{ scale: 0, rotate: 180 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Pause className="w-10 h-10" fill="currentColor" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="play"
                    initial={{ scale: 0, rotate: 180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    exit={{ scale: 0, rotate: -180 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Play className="w-10 h-10 ml-1" fill="currentColor" />
                  </motion.div>
                )}
              </AnimatePresence>
            </Button>
          )}

          {/* Waves indicator (placeholder for symmetry) */}
          <div className="p-4 rounded-full nivo-glass-static">
            <Waves className={`w-5 h-5 ${sessionState === 'playing' ? 'text-emerald-400/50' : 'text-foreground/30'}`} />
          </div>
        </div>

        {/* Status Indicator */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${
              sessionState === 'playing' ? 'bg-emerald-400 animate-pulse' : 
              sessionState === 'completed' ? 'bg-emerald-400' : 
              'bg-foreground/20'
            }`} />
            <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-foreground/40">
              {sessionState === 'idle' && 'Prêt pour la calibration'}
              {sessionState === 'playing' && 'Système en calibration...'}
              {sessionState === 'completed' && 'Calibration terminée'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
