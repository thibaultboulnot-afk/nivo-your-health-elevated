import { useRef, useState, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Radio, Waves } from 'lucide-react';
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
  const bars = 28;
  
  return (
    <div className="w-full max-w-lg mx-auto">
      {/* Hidden Audio Element */}
      <audio ref={audioRef} src={audioUrl} preload="metadata" loop />

      {/* Main Command Center Container - Obsidian Glass */}
      <div className="relative nivo-glass-intense rounded-2xl p-6 md:p-8">
        {/* Top glow through glass */}
        <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-40 bg-emerald-500/10 blur-[60px]" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-60 h-20 bg-emerald-500/5 blur-[40px]" />
        </div>

        {/* Header Instruction */}
        <div className="relative text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 nivo-glass-static rounded-full">
            <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-emerald-400">
              Mode Audio Actif
            </span>
          </div>
          <p className="mt-4 font-mono text-xs text-foreground/50 max-w-xs mx-auto leading-relaxed">
            Éloignez-vous de l'écran. Écoutez. Alignez-vous.
          </p>
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
                animate={isPlaying || isTimerActive ? {
                  height: [
                    `${baseHeight * 15}%`,
                    `${baseHeight * 100}%`,
                    `${baseHeight * 35}%`,
                    `${baseHeight * 85}%`,
                    `${baseHeight * 15}%`,
                  ],
                } : {
                  height: `${baseHeight * 25}%`,
                }}
                transition={isPlaying || isTimerActive ? {
                  duration: 0.6 + Math.random() * 0.5,
                  repeat: Infinity,
                  delay: i * 0.015,
                  ease: 'easeInOut',
                } : {
                  duration: 0.4,
                }}
                style={{
                  opacity: 0.4 + baseHeight * 0.6,
                  boxShadow: isPlaying || isTimerActive 
                    ? `0 0 ${10 + baseHeight * 10}px rgba(74, 222, 128, ${0.3 + baseHeight * 0.3})`
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
          animate={isTimerActive ? { scale: [1, 1.01, 1] } : {}}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <div className="nivo-glass-static inline-block px-8 py-4 rounded-xl">
            <span className="font-mono text-5xl md:text-6xl font-bold text-foreground tracking-tight">
              {timerDisplay}
            </span>
          </div>
          <div className="mt-4 mx-auto max-w-xs h-1.5 xp-bar-inset rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full"
              style={{ width: `${timerProgress * 100}%` }}
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
          >
            {isMuted ? <VolumeX className="w-5 h-5 text-foreground/50" /> : <Volume2 className="w-5 h-5 text-emerald-400" />}
          </button>

          {/* Main Play/Pause Button with Refraction */}
          <Button
            onClick={() => {
              onTogglePlay();
              onTimerToggle();
            }}
            size="lg"
            className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white btn-refraction shadow-[0_0_50px_rgba(74,222,128,0.4)] hover:shadow-[0_0_70px_rgba(74,222,128,0.6)] transition-all duration-300 border border-emerald-400/30"
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

          {/* Waves indicator (placeholder for symmetry) */}
          <div className="p-4 rounded-full nivo-glass-static">
            <Waves className="w-5 h-5 text-foreground/30" />
          </div>
        </div>

        {/* Status Indicator */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${isTimerActive ? 'bg-emerald-400 animate-pulse' : 'bg-foreground/20'}`} />
            <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-foreground/40">
              {isTimerActive ? 'Système en calibration...' : 'En attente de démarrage'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
