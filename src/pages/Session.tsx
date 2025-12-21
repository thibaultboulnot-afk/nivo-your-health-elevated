import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { X, Play, Pause, SkipBack, SkipForward, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PROGRAMS, getCurrentSession, type ProgramTier } from '@/data/programs';

export default function Session() {
  const { programId } = useParams<{ programId: string }>();
  const navigate = useNavigate();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentExercise, setCurrentExercise] = useState(1);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [sessionProgress, setSessionProgress] = useState(0);

  // Map URL param to program ID
  const programMap: Record<string, ProgramTier> = {
    'rapid-patch': 'RAPID_PATCH',
    'system-reboot': 'SYSTEM_REBOOT',
    'architect-mode': 'ARCHITECT_MODE',
  };

  const currentProgramId = programMap[programId || 'system-reboot'] || 'SYSTEM_REBOOT';
  const currentDay = 1; // TODO: Get from user profile
  const session = getCurrentSession(currentDay, currentProgramId);
  const totalExercises = session?.steps.length || 5;

  // Timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
        setSessionProgress((prev) => Math.min(prev + 0.5, 100));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePrevious = () => {
    if (currentExercise > 1) {
      setCurrentExercise(currentExercise - 1);
    }
  };

  const handleNext = () => {
    if (currentExercise < totalExercises) {
      setCurrentExercise(currentExercise + 1);
    }
  };

  const handleExit = () => {
    navigate('/dashboard');
  };

  if (!session) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="font-mono text-white/50">Session non trouvée</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex flex-col relative overflow-hidden">
      {/* Subtle noise texture */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Header HUD */}
      <header className="relative z-20 flex items-center justify-between px-6 py-4">
        {/* Exit Button */}
        <button
          onClick={handleExit}
          className="flex items-center gap-2 text-white/40 hover:text-white transition-colors group"
        >
          <X className="h-5 w-5" />
          <span className="font-mono text-xs opacity-0 group-hover:opacity-100 transition-opacity">
            QUITTER
          </span>
        </button>

        {/* Session Title */}
        <div className="absolute left-1/2 -translate-x-1/2 text-center">
          <h1 className="font-mono text-sm text-white/80">
            {session.title}
          </h1>
          <p className="font-mono text-xs text-white/30">
            Jour {currentDay} • {session.subtitle}
          </p>
        </div>

        {/* Timer */}
        <div className="flex items-center gap-3">
          <div className="font-mono text-2xl text-[#ff6b4a] tabular-nums">
            {formatTime(elapsedSeconds)}
          </div>
          <div className="w-2 h-2 rounded-full bg-[#ff6b4a] animate-pulse" />
        </div>
      </header>

      {/* Main Player Area */}
      <main className="flex-1 flex items-center justify-center px-6 py-8 relative z-10">
        <div className="w-full max-w-5xl">
          {/* Video Player Placeholder */}
          <div 
            className="relative aspect-video bg-[#0a0a0f] rounded-2xl border border-white/10 overflow-hidden"
            style={{
              boxShadow: '0 0 60px rgba(0,0,0,0.8), inset 0 0 60px rgba(0,0,0,0.5)',
            }}
          >
            {/* Noise overlay */}
            <div 
              className="absolute inset-0 opacity-[0.05] pointer-events-none"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
              }}
            />

            {/* Play Button Overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className={`w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 ${
                  isPlaying 
                    ? 'bg-white/10 hover:bg-white/20' 
                    : 'bg-[#ff6b4a] hover:bg-[#ff8a6a] shadow-[0_0_40px_rgba(255,107,74,0.5)]'
                }`}
              >
                {isPlaying ? (
                  <Pause className="h-10 w-10 text-white" />
                ) : (
                  <Play className="h-10 w-10 text-black ml-1" />
                )}
              </button>
            </div>

            {/* Audio Wave Animation when playing */}
            {isPlaying && (
              <div className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none">
                <div className="flex gap-1 items-center h-32">
                  {[...Array(30)].map((_, i) => (
                    <div
                      key={i}
                      className="w-1 bg-[#ff6b4a] rounded-full"
                      style={{
                        height: `${20 + Math.sin(i * 0.3 + elapsedSeconds * 0.5) * 40 + Math.random() * 20}%`,
                        animation: `pulse ${0.5 + Math.random() * 0.5}s ease-in-out infinite`,
                        animationDelay: `${i * 0.05}s`,
                      }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Exercise Info Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 via-black/50 to-transparent">
              <div className="flex items-end justify-between">
                <div>
                  <p className="font-mono text-xs text-[#ff6b4a] mb-1">
                    EXERCICE {currentExercise}/{totalExercises}
                  </p>
                  <h2 className="font-heading text-xl text-white">
                    {session.steps[currentExercise - 1] || 'Exercice en cours'}
                  </h2>
                </div>
                <div className="flex items-center gap-2 text-white/40">
                  <Volume2 className="h-4 w-4" />
                  <span className="font-mono text-xs">Audio actif</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer Controls */}
      <footer className="relative z-20 px-6 py-6">
        {/* Session Progress Bar */}
        <div className="w-full h-1 bg-white/10 rounded-full mb-6 overflow-hidden">
          <div 
            className="h-full bg-emerald-500 rounded-full transition-all duration-300"
            style={{ 
              width: `${sessionProgress}%`,
              boxShadow: '0 0 10px rgba(16,185,129,0.6)',
            }}
          />
        </div>

        {/* Control Buttons */}
        <div className="flex items-center justify-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={handlePrevious}
            disabled={currentExercise <= 1}
            className="w-12 h-12 rounded-full text-white/50 hover:text-white hover:bg-white/10 disabled:opacity-30"
          >
            <SkipBack className="h-5 w-5" />
          </Button>

          <Button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`w-16 h-16 rounded-full transition-all duration-300 ${
              isPlaying 
                ? 'bg-white/10 hover:bg-white/20 text-white' 
                : 'bg-[#ff6b4a] hover:bg-[#ff8a6a] text-black shadow-[0_0_30px_rgba(255,107,74,0.4)]'
            }`}
          >
            {isPlaying ? (
              <Pause className="h-7 w-7" />
            ) : (
              <Play className="h-7 w-7 ml-0.5" />
            )}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={handleNext}
            disabled={currentExercise >= totalExercises}
            className="w-12 h-12 rounded-full text-white/50 hover:text-white hover:bg-white/10 disabled:opacity-30"
          >
            <SkipForward className="h-5 w-5" />
          </Button>
        </div>

        {/* Exercise Steps Indicator */}
        <div className="flex justify-center gap-2 mt-4">
          {session.steps.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentExercise(index + 1)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index + 1 === currentExercise
                  ? 'bg-[#ff6b4a] w-6 shadow-[0_0_10px_rgba(255,107,74,0.6)]'
                  : index + 1 < currentExercise
                  ? 'bg-emerald-500'
                  : 'bg-white/20 hover:bg-white/40'
              }`}
            />
          ))}
        </div>
      </footer>
    </div>
  );
}
