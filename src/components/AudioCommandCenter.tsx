import { useRef, useState, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Radio } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';

interface AudioCommandCenterProps {
  audioUrl: string;
  isPlaying: boolean;
  onTogglePlay: () => void;
  timerDisplay: string;
  timerProgress: number; // 0 to 1
  onTimerToggle: () => void;
  isTimerActive: boolean;
}

export function AudioCommandCenter({
  audioUrl,
  isPlaying,
  onTogglePlay,
  timerDisplay,
  timerProgress,
  onTimerToggle,
  isTimerActive,
}: AudioCommandCenterProps) {
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
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

  // Animated waveform bars
  const bars = 24;
  
  return (
    <div className="w-full max-w-lg mx-auto">
      {/* Hidden Audio Element */}
      <audio ref={audioRef} src={audioUrl} preload="metadata" loop />

      {/* Main Command Center Container */}
      <div className="relative bg-zinc-950/80 border border-white/10 rounded-2xl p-6 md:p-8 backdrop-blur-xl">
        {/* Glow effect */}
        <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-primary/10 blur-3xl" />
        </div>

        {/* Header Instruction */}
        <div className="relative text-center mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/10 border border-primary/20 rounded-full">
            <Radio className="w-3 h-3 text-primary animate-pulse" />
            <span className="font-mono text-[10px] uppercase tracking-widest text-primary">
              Mode Audio Actif
            </span>
          </div>
          <p className="mt-3 font-mono text-xs text-foreground/40">
            Éloignez-vous de l'écran. Écoutez. Alignez-vous.
          </p>
        </div>

        {/* Animated Waveform */}
        <div className="relative h-24 md:h-32 mb-6 flex items-center justify-center gap-[2px] md:gap-1">
          {Array.from({ length: bars }).map((_, i) => {
            const centerDistance = Math.abs(i - bars / 2) / (bars / 2);
            const baseHeight = 1 - centerDistance * 0.7;
            
            return (
              <motion.div
                key={i}
                className="w-1 md:w-1.5 rounded-full bg-primary"
                animate={isPlaying || isTimerActive ? {
                  height: [
                    `${baseHeight * 20}%`,
                    `${baseHeight * 100}%`,
                    `${baseHeight * 40}%`,
                    `${baseHeight * 80}%`,
                    `${baseHeight * 20}%`,
                  ],
                } : {
                  height: `${baseHeight * 30}%`,
                }}
                transition={isPlaying || isTimerActive ? {
                  duration: 0.8 + Math.random() * 0.4,
                  repeat: Infinity,
                  delay: i * 0.02,
                  ease: 'easeInOut',
                } : {
                  duration: 0.3,
                }}
                style={{
                  opacity: 0.3 + baseHeight * 0.7,
                }}
              />
            );
          })}
          
          {/* Center glow overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-background pointer-events-none" />
        </div>

        {/* Timer Display */}
        <motion.div 
          className="text-center mb-6"
          animate={isTimerActive ? { scale: [1, 1.02, 1] } : {}}
          transition={{ duration: 1, repeat: Infinity }}
        >
          <span className="font-mono text-5xl md:text-6xl font-bold text-foreground tracking-tight">
            {timerDisplay}
          </span>
          <div className="mt-2 h-1 bg-muted/30 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-primary rounded-full"
              style={{ width: `${timerProgress * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </motion.div>

        {/* Control Buttons */}
        <div className="flex items-center justify-center gap-4">
          {/* Volume Toggle */}
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="p-3 rounded-full border border-white/10 text-foreground/50 hover:text-foreground hover:bg-white/5 transition-all"
          >
            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </button>

          {/* Main Play/Pause Button */}
          <Button
            onClick={() => {
              onTogglePlay();
              onTimerToggle();
            }}
            size="lg"
            className="w-20 h-20 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_0_40px_rgba(74,222,128,0.3)] hover:shadow-[0_0_60px_rgba(74,222,128,0.5)] transition-all duration-300"
          >
            <AnimatePresence mode="wait">
              {isTimerActive ? (
                <motion.div
                  key="pause"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0, rotate: 180 }}
                  transition={{ duration: 0.2 }}
                >
                  <Pause className="w-8 h-8" fill="currentColor" />
                </motion.div>
              ) : (
                <motion.div
                  key="play"
                  initial={{ scale: 0, rotate: 180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0, rotate: -180 }}
                  transition={{ duration: 0.2 }}
                >
                  <Play className="w-8 h-8 ml-1" fill="currentColor" />
                </motion.div>
              )}
            </AnimatePresence>
          </Button>

          {/* Volume Slider (invisible placeholder for symmetry) */}
          <div className="w-11 h-11" />
        </div>

        {/* Status Indicator */}
        <div className="mt-6 text-center">
          <span className="font-mono text-[10px] uppercase tracking-widest text-foreground/30">
            {isTimerActive ? 'Système en calibration...' : 'En attente de démarrage'}
          </span>
        </div>
      </div>
    </div>
  );
}
