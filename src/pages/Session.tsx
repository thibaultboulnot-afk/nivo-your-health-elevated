import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { X, Play, Pause, SkipBack, SkipForward, Volume2, Moon, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PROGRAMS, getCurrentSession, type ProgramTier } from '@/data/programs';
import { motion, AnimatePresence } from 'framer-motion';

// Audio de test - bruit blanc relaxant
const TEST_AUDIO_URL = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3';

export default function Session() {
  const { programId } = useParams<{ programId: string }>();
  const navigate = useNavigate();
  const audioRef = useRef<HTMLAudioElement>(null);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentExercise, setCurrentExercise] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isBlackoutMode, setIsBlackoutMode] = useState(false);
  const [holdProgress, setHoldProgress] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const holdTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Check for mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Show/hide back to top button on scroll
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Map URL param to program ID
  const programMap: Record<string, ProgramTier> = {
    'rapid-patch': 'RAPID_PATCH',
    'system-reboot': 'SYSTEM_REBOOT',
    'architect-mode': 'ARCHITECT_MODE',
  };

  const currentProgramId = programMap[programId || 'system-reboot'] || 'SYSTEM_REBOOT';
  const currentDay = 1;
  const session = getCurrentSession(currentDay, currentProgramId);
  const totalExercises = session?.steps.length || 5;

  // Audio synchronization
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      if (currentExercise < totalExercises) {
        setCurrentExercise(prev => prev + 1);
      }
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [currentExercise, totalExercises]);

  // Volume control
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePrevious = () => {
    if (currentExercise > 1) {
      setCurrentExercise(currentExercise - 1);
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
      }
    }
  };

  const handleNext = () => {
    if (currentExercise < totalExercises) {
      setCurrentExercise(currentExercise + 1);
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
      }
    }
  };

  const handleExit = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    navigate('/dashboard');
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
    setCurrentTime(time);
  };

  // Blackout mode long-press handlers
  const handleWakeStart = () => {
    holdTimerRef.current = setInterval(() => {
      setHoldProgress(prev => {
        if (prev >= 100) {
          setIsBlackoutMode(false);
          if (holdTimerRef.current) clearInterval(holdTimerRef.current);
          return 0;
        }
        return prev + 5;
      });
    }, 50);
  };

  const handleWakeEnd = () => {
    if (holdTimerRef.current) {
      clearInterval(holdTimerRef.current);
    }
    setHoldProgress(0);
  };

  const sessionProgress = duration > 0 ? (currentTime / duration) * 100 : 0;

  if (!session) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="font-mono text-white/50">Session non trouvée</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex flex-col relative overflow-hidden">
      {/* Hidden Audio Element */}
      <audio ref={audioRef} src={TEST_AUDIO_URL} preload="metadata" />

      {/* Subtle noise texture */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Blackout Mode Overlay */}
      <AnimatePresence>
        {isBlackoutMode && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-50 bg-black flex items-center justify-center"
          >
            <div className="text-center">
              {/* Hold to wake button */}
              <button
                onMouseDown={handleWakeStart}
                onMouseUp={handleWakeEnd}
                onMouseLeave={handleWakeEnd}
                onTouchStart={handleWakeStart}
                onTouchEnd={handleWakeEnd}
                className="relative w-20 h-20 rounded-full border border-white/10 flex items-center justify-center group"
              >
                {/* Progress ring */}
                <svg className="absolute inset-0 w-full h-full -rotate-90">
                  <circle
                    cx="40"
                    cy="40"
                    r="38"
                    fill="none"
                    stroke="rgba(255,107,74,0.3)"
                    strokeWidth="2"
                    strokeDasharray={`${holdProgress * 2.39} 239`}
                    className="transition-all duration-75"
                  />
                </svg>
                <Moon className="w-6 h-6 text-white/20 group-hover:text-white/40 transition-colors" />
              </button>
              <p className="font-mono text-[10px] text-white/20 mt-4 tracking-widest uppercase">
                Maintenir pour réveiller
              </p>
              
              {/* Timer still visible in blackout */}
              <div className="mt-8 font-mono text-lg text-white/10">
                {formatTime(currentTime)}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header HUD */}
      <header className="relative z-20 px-4 md:px-6 py-3 md:py-4">
        <div className="flex items-center justify-between">
          {/* Exit Button */}
          <button
            onClick={handleExit}
            className="flex items-center gap-2 text-white/40 hover:text-white transition-colors group p-2 -ml-2"
          >
            <X className="h-5 w-5" />
            <span className="font-mono text-xs opacity-0 group-hover:opacity-100 transition-opacity hidden md:inline">
              QUITTER
            </span>
          </button>

          {/* Timer - Always visible */}
          <div className="flex items-center gap-2 md:gap-3">
            <div className="font-mono text-xl md:text-2xl text-primary tabular-nums">
              {formatTime(currentTime)}
            </div>
            {isPlaying && (
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            )}
          </div>
        </div>
        
        {/* Session Title - Below on mobile */}
        <div className="text-center mt-2 md:absolute md:left-1/2 md:-translate-x-1/2 md:top-1/2 md:-translate-y-1/2 md:mt-0">
          <h1 className="font-mono text-xs md:text-sm text-white/80 truncate max-w-[200px] md:max-w-none mx-auto">
            {session.title}
          </h1>
          <p className="font-mono text-[10px] md:text-xs text-white/30">
            Jour {currentDay} • {session.subtitle}
          </p>
        </div>
      </header>

      {/* Main Visualization Area */}
      <main className="flex-1 flex items-center justify-center px-6 py-8 relative z-10">
        <div className="relative flex items-center justify-center">
          
          {/* Expanding Radar Waves */}
          {isPlaying && (
            <>
              {[...Array(4)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute rounded-full border border-primary/20"
                  initial={{ width: 100, height: 100, opacity: 0.6 }}
                  animate={{ 
                    width: [100, 400, 600],
                    height: [100, 400, 600],
                    opacity: [0.4, 0.15, 0],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    delay: i * 1,
                    ease: "easeOut",
                  }}
                />
              ))}
            </>
          )}

          {/* Central Breathing Circle */}
          <motion.div
            className="relative w-40 h-40 rounded-full flex items-center justify-center cursor-pointer"
            style={{
              background: 'radial-gradient(circle, rgba(255,107,74,0.15) 0%, rgba(255,107,74,0.05) 50%, transparent 70%)',
              boxShadow: isPlaying ? '0 0 80px rgba(255,107,74,0.2), inset 0 0 40px rgba(255,107,74,0.1)' : 'none',
            }}
            animate={isPlaying ? {
              scale: [1, 1.08, 1],
            } : { scale: 1 }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            onClick={togglePlayPause}
          >
            {/* Inner glow ring */}
            <motion.div
              className="absolute inset-2 rounded-full border border-primary/30"
              animate={isPlaying ? {
                opacity: [0.3, 0.6, 0.3],
              } : { opacity: 0.2 }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            
            {/* Core */}
            <motion.div
              className="w-20 h-20 rounded-full flex items-center justify-center"
              style={{
                background: isPlaying 
                  ? 'radial-gradient(circle, rgba(255,107,74,0.4) 0%, rgba(255,107,74,0.1) 100%)'
                  : 'radial-gradient(circle, rgba(255,107,74,0.2) 0%, rgba(255,107,74,0.05) 100%)',
              }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              {isPlaying ? (
                <Pause className="w-8 h-8 text-primary/80" />
              ) : (
                <Play className="w-8 h-8 text-primary/80 ml-1" />
              )}
            </motion.div>
          </motion.div>

          {/* Exercise Info - Floating below */}
          <div className="absolute -bottom-24 text-center">
            <p className="font-mono text-xs text-primary/60 mb-1 tracking-widest">
              EXERCICE {currentExercise}/{totalExercises}
            </p>
            <h2 className="font-heading text-xl text-white/80">
              {session.steps[currentExercise - 1] || 'Exercice en cours'}
            </h2>
          </div>
        </div>
      </main>

      {/* Volume Slider - Right Side (hidden on mobile) */}
      <div className="hidden md:flex fixed right-6 top-1/2 -translate-y-1/2 z-30 flex-col items-center gap-3">
        <Volume2 className="w-4 h-4 text-white/30" />
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={(e) => setVolume(parseFloat(e.target.value))}
          className="h-32 w-1 appearance-none bg-white/10 rounded-full cursor-pointer"
          style={{
            writingMode: 'vertical-lr',
            direction: 'rtl',
          }}
        />
        <span className="font-mono text-[10px] text-white/30">
          {Math.round(volume * 100)}%
        </span>
      </div>

      {/* Blackout Mode Button - Desktop: left side, Mobile: in footer area */}
      <button
        onClick={() => setIsBlackoutMode(true)}
        className="hidden md:flex fixed left-6 top-1/2 -translate-y-1/2 z-30 flex-col items-center gap-2 text-white/30 hover:text-white/60 transition-colors group"
      >
        <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center group-hover:border-primary/30 group-hover:bg-primary/5 transition-all">
          <Moon className="w-4 h-4" />
        </div>
        <span className="font-mono text-[9px] tracking-wider uppercase opacity-0 group-hover:opacity-100 transition-opacity">
          Immersion
        </span>
      </button>

      {/* Footer Controls */}
      <footer className="relative z-20 px-6 py-6">
        {/* Audio Progress Bar */}
        <div className="w-full max-w-2xl mx-auto mb-4">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs text-white/40 w-12 text-right">
              {formatTime(currentTime)}
            </span>
            <div className="flex-1 relative">
              <input
                type="range"
                min="0"
                max={duration || 100}
                value={currentTime}
                onChange={handleSeek}
                className="w-full h-1 appearance-none bg-white/10 rounded-full cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #10b981 0%, #10b981 ${sessionProgress}%, rgba(255,255,255,0.1) ${sessionProgress}%, rgba(255,255,255,0.1) 100%)`,
                }}
              />
            </div>
            <span className="font-mono text-xs text-white/40 w-12">
              {formatTime(duration)}
            </span>
          </div>
        </div>

        {/* Control Buttons */}
        <div className="flex items-center justify-center gap-4 md:gap-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={handlePrevious}
            disabled={currentExercise <= 1}
            className="w-11 h-11 md:w-12 md:h-12 rounded-full text-white/50 hover:text-white hover:bg-white/10 disabled:opacity-30"
          >
            <SkipBack className="h-5 w-5" />
          </Button>

          <Button
            onClick={togglePlayPause}
            className={`w-14 h-14 md:w-16 md:h-16 rounded-full transition-all duration-300 ${
              isPlaying 
                ? 'bg-white/10 hover:bg-white/20 text-white' 
                : 'bg-primary hover:bg-primary/90 text-black shadow-[0_0_30px_rgba(255,107,74,0.4)]'
            }`}
          >
            {isPlaying ? (
              <Pause className="h-6 w-6 md:h-7 md:w-7" />
            ) : (
              <Play className="h-6 w-6 md:h-7 md:w-7 ml-0.5" />
            )}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={handleNext}
            disabled={currentExercise >= totalExercises}
            className="w-11 h-11 md:w-12 md:h-12 rounded-full text-white/50 hover:text-white hover:bg-white/10 disabled:opacity-30"
          >
            <SkipForward className="h-5 w-5" />
          </Button>
        </div>

        {/* Exercise Steps Indicator + Mobile Blackout Button */}
        <div className="flex items-center justify-center gap-3 mt-4">
          {/* Mobile Blackout Button */}
          <button
            onClick={() => setIsBlackoutMode(true)}
            className="md:hidden w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-white/60 hover:border-primary/30 transition-all"
          >
            <Moon className="w-4 h-4" />
          </button>
          
          <div className="flex gap-2">
            {session.steps.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentExercise(index + 1)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index + 1 === currentExercise
                    ? 'bg-primary w-6 shadow-[0_0_10px_rgba(255,107,74,0.6)]'
                    : index + 1 < currentExercise
                    ? 'bg-emerald-500'
                    : 'bg-white/20 hover:bg-white/40'
                }`}
              />
            ))}
          </div>
        </div>
      </footer>

      {/* Mobile Back to Top Button */}
      {isMobile && (
        <motion.button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-primary text-primary-foreground shadow-glow-primary flex items-center justify-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ 
            opacity: showBackToTop ? 1 : 0, 
            scale: showBackToTop ? 1 : 0.8,
            pointerEvents: showBackToTop ? 'auto' : 'none'
          }}
          transition={{ duration: 0.2 }}
          aria-label="Retour en haut"
        >
          <ChevronUp className="w-6 h-6" />
        </motion.button>
      )}
    </div>
  );
}
