import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { X, Play, Pause, ChevronLeft, ChevronRight, Volume2, Moon, Check, Trophy, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DAILY_ROUTINE, getRoutineById, type Routine, type RoutineStep } from '@/data/programs';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Audio ambiant
const AMBIENT_AUDIO_URL = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3';

type SessionPhase = 'warmup' | 'exercise' | 'rest' | 'completed';

export default function Session() {
  const { routineId } = useParams<{ routineId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const audioRef = useRef<HTMLAudioElement>(null);
  
  // Core state
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [sessionPhase, setSessionPhase] = useState<SessionPhase>('exercise');
  const [isPlaying, setIsPlaying] = useState(false);
  
  // Timer state
  const [exerciseTimer, setExerciseTimer] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(false);
  
  // Audio state
  const [volume, setVolume] = useState(0.5);
  
  // UI state
  const [isBlackoutMode, setIsBlackoutMode] = useState(false);
  const [holdProgress, setHoldProgress] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const holdTimerRef = useRef<NodeJS.Timeout | null>(null);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Get routine
  const routine: Routine = getRoutineById(routineId || 'daily_loop') || DAILY_ROUTINE;
  const totalSteps = routine.steps.length;
  const currentStep: RoutineStep | undefined = routine.steps[currentStepIndex];
  const isLastStep = currentStepIndex === totalSteps - 1;

  // Session start time
  const sessionStartRef = useRef<Date>(new Date());

  // Timer logic
  const startTimer = useCallback(() => {
    if (currentStep) {
      setExerciseTimer(currentStep.exercise.duration_seconds);
      setIsTimerActive(true);
    }
  }, [currentStep]);

  const pauseTimer = useCallback(() => {
    setIsTimerActive(false);
  }, []);

  const resetTimer = useCallback(() => {
    if (currentStep) {
      setExerciseTimer(currentStep.exercise.duration_seconds);
      setIsTimerActive(false);
    }
  }, [currentStep]);

  // Timer countdown effect
  useEffect(() => {
    if (isTimerActive && exerciseTimer > 0) {
      timerIntervalRef.current = setInterval(() => {
        setExerciseTimer(prev => {
          if (prev <= 1) {
            setIsTimerActive(false);
            // Auto-advance to next step when timer ends
            if (!isLastStep) {
              setTimeout(() => handleNext(), 500);
            } else {
              setSessionPhase('completed');
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, [isTimerActive, exerciseTimer, isLastStep]);

  // Initialize timer when step changes
  useEffect(() => {
    if (currentStep) {
      setExerciseTimer(currentStep.exercise.duration_seconds);
      setIsTimerActive(false);
    }
  }, [currentStepIndex, currentStep]);

  // Audio control
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const toggleAudio = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  // Navigation
  const handlePrevious = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
      setIsTimerActive(false);
    }
  };

  const handleNext = () => {
    if (currentStepIndex < totalSteps - 1) {
      setCurrentStepIndex(prev => prev + 1);
      setIsTimerActive(false);
    } else {
      setSessionPhase('completed');
    }
  };

  const handleExit = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    navigate('/dashboard');
  };

  // Save session to database and update NIVO score
  const saveSession = async () => {
    if (!user) return;

    setIsSaving(true);
    try {
      const sessionEnd = new Date();
      const durationSeconds = Math.round((sessionEnd.getTime() - sessionStartRef.current.getTime()) / 1000);
      const today = new Date().toISOString().split('T')[0];

      // 1. Save the routine session
      const { error: sessionError } = await supabase.from('routine_sessions').insert({
        user_id: user.id,
        routine_type: routine.type,
        duration_seconds: durationSeconds,
        completed: true,
        is_premium: routine.is_pro,
        score_boost: routine.score_boost
      });

      if (sessionError) throw sessionError;

      // 2. Get today's NIVO score and boost it
      const { data: existingScore } = await supabase
        .from('nivo_scores')
        .select('*')
        .eq('user_id', user.id)
        .eq('score_date', today)
        .maybeSingle();

      if (existingScore) {
        // Boost today's score (capped at 100)
        const boostedScore = Math.min(100, existingScore.total_score + (routine.score_boost || 0));
        
        // We can't update nivo_scores due to RLS, so we insert a new boosted score
        await supabase.from('nivo_scores').insert({
          user_id: user.id,
          total_score: boostedScore,
          subjective_index: existingScore.subjective_index,
          functional_index: existingScore.functional_index,
          load_index: existingScore.load_index,
          score_date: today,
          decay_applied: false
        });
      }

      toast.success('Session enregistrée ! +' + (routine.score_boost || 0) + ' points NIVO');
      navigate('/dashboard');
    } catch (error) {
      console.error('Error saving session:', error);
      toast.error('Erreur lors de la sauvegarde');
    } finally {
      setIsSaving(false);
    }
  };

  // Blackout mode handlers
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

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Progress percentage
  const progressPercentage = ((currentStepIndex + 1) / totalSteps) * 100;

  // Completed screen
  if (sessionPhase === 'completed') {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/20 blur-[150px]" />
        </div>

        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="relative z-10 text-center max-w-md"
        >
          {/* Success icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="w-24 h-24 mx-auto mb-8 rounded-full bg-primary/20 flex items-center justify-center"
          >
            <Trophy className="w-12 h-12 text-primary" />
          </motion.div>

          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="font-heading text-3xl md:text-4xl text-foreground mb-4"
          >
            Session Complétée
          </motion.h1>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="space-y-4 mb-8"
          >
            <div className="p-4 rounded-xl bg-card/50 border border-border/50">
              <p className="font-mono text-xs text-muted-foreground mb-2">ROUTINE TERMINÉE</p>
              <p className="font-heading text-xl text-foreground">{routine.name}</p>
            </div>

            <div className="p-4 rounded-xl bg-primary/10 border border-primary/20">
              <p className="font-mono text-xs text-primary/70 mb-2">BÉNÉFICE</p>
              <p className="text-foreground/80">
                Niveau de charge vertébrale réduit<br />
                <span className="text-primary font-semibold">+{routine.score_boost} points NIVO</span>
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <Button
              onClick={saveSession}
              disabled={isSaving}
              className="w-full h-14 text-lg bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              {isSaving ? (
                <span className="flex items-center gap-2">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  >
                    <RotateCcw className="w-5 h-5" />
                  </motion.div>
                  Enregistrement...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Check className="w-5 h-5" />
                  Retour au Dashboard
                </span>
              )}
            </Button>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col relative overflow-hidden">
      {/* Hidden Audio Element */}
      <audio ref={audioRef} src={AMBIENT_AUDIO_URL} preload="metadata" loop />

      {/* Subtle noise texture */}
      <div 
        className="absolute inset-0 opacity-[0.02] pointer-events-none"
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
              <button
                onMouseDown={handleWakeStart}
                onMouseUp={handleWakeEnd}
                onMouseLeave={handleWakeEnd}
                onTouchStart={handleWakeStart}
                onTouchEnd={handleWakeEnd}
                className="relative w-20 h-20 rounded-full border border-white/10 flex items-center justify-center group"
              >
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
              
              {/* Timer visible in blackout */}
              <div className="mt-8 font-mono text-4xl text-primary/30">
                {formatTimer(exerciseTimer)}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progress Bar - Top */}
      <div className="relative z-20 px-4 pt-4">
        <div className="flex gap-1">
          {routine.steps.map((step, index) => (
            <div
              key={index}
              className="flex-1 h-1 rounded-full overflow-hidden bg-muted/30"
            >
              <motion.div
                className="h-full bg-primary"
                initial={{ width: 0 }}
                animate={{ 
                  width: index < currentStepIndex 
                    ? '100%' 
                    : index === currentStepIndex 
                      ? `${((currentStep?.exercise.duration_seconds || 60) - exerciseTimer) / (currentStep?.exercise.duration_seconds || 60) * 100}%`
                      : '0%'
                }}
                transition={{ duration: 0.3 }}
              />
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-1">
          <span className="font-mono text-[10px] text-muted-foreground">
            {currentStepIndex + 1}/{totalSteps}
          </span>
          <span className="font-mono text-[10px] text-muted-foreground">
            {routine.duration_minutes} min
          </span>
        </div>
      </div>

      {/* Header */}
      <header className="relative z-20 px-4 py-3">
        <div className="flex items-center justify-between">
          <button
            onClick={handleExit}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors p-2 -ml-2"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="text-center">
            <p className="font-mono text-[10px] text-primary tracking-widest">
              {currentStep?.phase_label}
            </p>
          </div>

          {/* Audio toggle */}
          <button
            onClick={toggleAudio}
            className="p-2 -mr-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <Volume2 className={`h-5 w-5 ${isPlaying ? 'text-primary' : ''}`} />
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col px-6 py-4 relative z-10">
        
        {/* Exercise Title */}
        <motion.div
          key={currentStepIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="text-center mb-6"
        >
          <h1 className="font-heading text-2xl md:text-3xl text-foreground mb-2">
            {currentStep?.exercise.name}
          </h1>
          <p className="text-muted-foreground text-sm">
            {currentStep?.exercise.description}
          </p>
        </motion.div>

        {/* Timer Circle - Main Focus */}
        <div className="flex-1 flex items-center justify-center">
          <motion.div
            key={currentStepIndex}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative"
          >
            {/* Outer glow ring */}
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{
                background: 'radial-gradient(circle, rgba(255,107,74,0.2) 0%, transparent 70%)',
              }}
              animate={isTimerActive ? {
                scale: [1, 1.1, 1],
                opacity: [0.5, 0.8, 0.5],
              } : {}}
              transition={{ duration: 2, repeat: Infinity }}
            />

            {/* Timer circle */}
            <div 
              className="relative w-56 h-56 md:w-72 md:h-72 rounded-full border-4 border-muted/30 flex items-center justify-center cursor-pointer"
              onClick={() => isTimerActive ? pauseTimer() : startTimer()}
            >
              {/* Progress ring */}
              <svg className="absolute inset-0 w-full h-full -rotate-90">
                <circle
                  cx="50%"
                  cy="50%"
                  r="calc(50% - 8px)"
                  fill="none"
                  stroke="hsl(var(--primary))"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeDasharray={`${(1 - exerciseTimer / (currentStep?.exercise.duration_seconds || 60)) * 100 * 6.28} 628`}
                  className="transition-all duration-1000"
                />
              </svg>

              {/* Timer display */}
              <div className="text-center">
                <motion.p
                  className="font-mono text-5xl md:text-6xl text-foreground tabular-nums"
                  animate={isTimerActive ? { scale: [1, 1.02, 1] } : {}}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  {formatTimer(exerciseTimer)}
                </motion.p>
                <p className="font-mono text-xs text-muted-foreground mt-2 uppercase tracking-wider">
                  {isTimerActive ? 'En cours' : 'Appuyez pour démarrer'}
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Instructions Panel */}
        <motion.div
          key={`instructions-${currentStepIndex}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 p-4 rounded-xl bg-card/50 border border-border/50"
        >
          <p className="font-mono text-[10px] text-primary tracking-widest mb-3">INSTRUCTIONS</p>
          <ul className="space-y-2">
            {currentStep?.exercise.instructions.slice(0, 3).map((instruction, i) => (
              <li key={i} className="flex gap-3 text-sm text-muted-foreground">
                <span className="text-primary font-mono">{i + 1}.</span>
                <span>{instruction}</span>
              </li>
            ))}
          </ul>
          {currentStep?.exercise.audio_cue && (
            <div className="mt-4 pt-3 border-t border-border/30">
              <p className="text-xs italic text-foreground/70">
                💡 {currentStep.exercise.audio_cue}
              </p>
            </div>
          )}
        </motion.div>
      </main>

      {/* Footer Controls */}
      <footer className="relative z-20 px-6 py-6">
        <div className="flex items-center justify-between max-w-md mx-auto">
          {/* Previous */}
          <Button
            variant="ghost"
            size="icon"
            onClick={handlePrevious}
            disabled={currentStepIndex === 0}
            className="w-14 h-14 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/30 disabled:opacity-30"
          >
            <ChevronLeft className="h-8 w-8" />
          </Button>

          {/* Play/Pause Timer */}
          <Button
            onClick={() => isTimerActive ? pauseTimer() : startTimer()}
            className={`w-16 h-16 rounded-full transition-all duration-300 ${
              isTimerActive 
                ? 'bg-muted hover:bg-muted/80 text-foreground' 
                : 'bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_0_30px_rgba(255,107,74,0.3)]'
            }`}
          >
            {isTimerActive ? (
              <Pause className="h-7 w-7" />
            ) : (
              <Play className="h-7 w-7 ml-0.5" />
            )}
          </Button>

          {/* Next */}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleNext}
            className="w-14 h-14 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/30"
          >
            <ChevronRight className="h-8 w-8" />
          </Button>
        </div>

        {/* Blackout mode toggle - Mobile */}
        <div className="flex justify-center mt-4">
          <button
            onClick={() => setIsBlackoutMode(true)}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-xs"
          >
            <Moon className="w-4 h-4" />
            <span className="font-mono tracking-wider uppercase">Mode Immersion</span>
          </button>
        </div>
      </footer>

      {/* Desktop Volume Slider */}
      <div className="hidden md:flex fixed right-6 top-1/2 -translate-y-1/2 z-30 flex-col items-center gap-3">
        <Volume2 className="w-4 h-4 text-muted-foreground" />
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={(e) => setVolume(parseFloat(e.target.value))}
          className="h-32 w-1 appearance-none bg-muted/30 rounded-full cursor-pointer"
          style={{
            writingMode: 'vertical-lr',
            direction: 'rtl',
          }}
        />
        <span className="font-mono text-[10px] text-muted-foreground">
          {Math.round(volume * 100)}%
        </span>
      </div>
    </div>
  );
}
