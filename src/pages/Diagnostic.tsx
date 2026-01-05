import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  AlertTriangle, 
  Activity, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Minus,
  Plus,
  ArrowRight,
  Loader2,
  Camera
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { calculateNivoScore, DailyLog, PhysicalAssessment } from '@/lib/nivo-engine';
import { toast } from 'sonner';
import PostureScanner from '@/components/PostureScanner';

type ScanStep = 'IDLE' | 'SUBJECTIVE' | 'LOAD' | 'FUNCTIONAL' | 'COMPUTING' | 'COMPLETE';

interface SubjectiveData {
  pain: number;
  stiffness: number;
  fatigue: number;
}

interface LoadData {
  hoursSeated: number;
}

interface FunctionalData {
  wallAngelScore: number; // 0, 1.5, or 3
}

type FunctionalMode = 'scanner' | 'manual';

const computingLines = [
  '> Analyse des données sensorielles...',
  '> Évaluation de la charge environnementale...',
  '> Test fonctionnel traité...',
  '> Calcul du NIVO Score...',
  '> Génération du rapport...',
  '> Scan terminé.',
];

export default function Diagnostic() {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [step, setStep] = useState<ScanStep>('IDLE');
  const [subjective, setSubjective] = useState<SubjectiveData>({ pain: 20, stiffness: 30, fatigue: 25 });
  const [load, setLoad] = useState<LoadData>({ hoursSeated: 4 });
  const [functional, setFunctional] = useState<FunctionalData>({ wallAngelScore: 1.5 });
  const [computingLine, setComputingLine] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [functionalMode, setFunctionalMode] = useState<FunctionalMode>('scanner');
  const [cooldownHours, setCooldownHours] = useState<number | null>(null);
  const [isCheckingCooldown, setIsCheckingCooldown] = useState(true);

  // Check 24h calibration cooldown
  useEffect(() => {
    if (!user) {
      setIsCheckingCooldown(false);
      return;
    }

    const checkCooldown = async () => {
      const { data } = await supabase
        .from('profiles')
        .select('last_calibration_date')
        .eq('id', user.id)
        .single();

      if (data?.last_calibration_date) {
        const lastCal = new Date(data.last_calibration_date);
        const now = new Date();
        const hoursSince = (now.getTime() - lastCal.getTime()) / (1000 * 60 * 60);
        
        if (hoursSince < 24) {
          setCooldownHours(Math.ceil(24 - hoursSince));
        }
      }
      setIsCheckingCooldown(false);
    };

    checkCooldown();
  }, [user]);

  const handleStartScan = () => {
    if (cooldownHours !== null) {
      toast.error(`Système en refroidissement. Disponible dans ${cooldownHours}h.`);
      return;
    }
    setStep('SUBJECTIVE');
  };

  const handleSubjectiveNext = () => {
    setStep('LOAD');
  };

  const handleLoadNext = () => {
    setStep('FUNCTIONAL');
  };

  const handleFunctionalComplete = async (score: number) => {
    setFunctional({ wallAngelScore: score });
    setStep('COMPUTING');
    
    // Start computing animation
    let currentLine = 0;
    const interval = setInterval(() => {
      currentLine++;
      setComputingLine(currentLine);
      
      if (currentLine >= computingLines.length - 1) {
        clearInterval(interval);
        // After animation, save data
        setTimeout(() => saveAndRedirect(score), 500);
      }
    }, 400);
  };

  const saveAndRedirect = async (wallAngelScore: number) => {
    if (!user) {
      toast.error('Vous devez être connecté pour sauvegarder vos données.');
      navigate('/login');
      return;
    }

    setIsSaving(true);

    try {
      const today = new Date().toISOString().split('T')[0];

      // 1. Insert daily check-in
      const { error: checkinError } = await supabase
        .from('daily_checkins')
        .upsert({
          user_id: user.id,
          checkin_date: today,
          pain_vas: subjective.pain,
          stiffness_vas: subjective.stiffness,
          fatigue_vas: subjective.fatigue,
          hours_seated: load.hoursSeated,
          stress_level: Math.ceil(subjective.fatigue / 20), // Convert 0-100 to 1-5
        }, { onConflict: 'user_id,checkin_date' });

      if (checkinError) {
        console.error('Checkin error:', checkinError);
        throw checkinError;
      }

      // 2. Insert physical test
      // Convert wall angel score (0, 1.5, 3) to contacts (0-5)
      const wallAngelContacts = Math.round((wallAngelScore / 3) * 5);
      
      const { error: testError } = await supabase
        .from('physical_tests')
        .upsert({
          user_id: user.id,
          test_date: today,
          wall_angel_contacts: wallAngelContacts,
          finger_floor_distance_cm: null,
          mcgill_plank_seconds: null,
        }, { onConflict: 'user_id,test_date' });

      if (testError) {
        console.error('Test error:', testError);
        throw testError;
      }

      // 3. Calculate NIVO Score
      const dailyLog: DailyLog = {
        pain_vas: subjective.pain,
        fatigue_vas: subjective.fatigue,
        stiffness_vas: subjective.stiffness,
        hours_seated: load.hoursSeated,
        stress_level: Math.ceil(subjective.fatigue / 20),
      };

      const physicalAssessment: PhysicalAssessment = {
        finger_floor_distance_cm: 15, // Default value
        wall_angel_contacts: wallAngelContacts,
        mcgill_plank_seconds: 30, // Default value
      };

      const nivoResult = calculateNivoScore(dailyLog, physicalAssessment);

      // 4. Insert NIVO Score
      const { error: scoreError } = await supabase
        .from('nivo_scores')
        .insert({
          user_id: user.id,
          score_date: today,
          total_score: nivoResult.globalScore,
          subjective_index: nivoResult.details.subj,
          functional_index: nivoResult.details.func,
          load_index: nivoResult.details.load,
        });

      if (scoreError) {
        console.error('Score error:', scoreError);
        throw scoreError;
      }

      // 5. Update last calibration date
      await supabase
        .from('profiles')
        .update({ last_calibration_date: today })
        .eq('id', user.id);

      setStep('COMPLETE');
      toast.success('Scan terminé avec succès !');
      
      // Redirect after short delay
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);

    } catch (error) {
      console.error('Error saving diagnostic:', error);
      toast.error('Erreur lors de la sauvegarde. Veuillez réessayer.');
      setStep('FUNCTIONAL');
    } finally {
      setIsSaving(false);
    }
  };

  const adjustHours = (delta: number) => {
    setLoad(prev => ({
      hoursSeated: Math.max(0, Math.min(16, prev.hoursSeated + delta))
    }));
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden text-foreground">
      {/* Background Effects */}
      <div className="aurora absolute inset-0 pointer-events-none opacity-30" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,107,74,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,107,74,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-border backdrop-blur-md">
        <div className="container mx-auto px-4 md:px-6 h-14 md:h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-primary flex items-center justify-center shadow-[0_0_15px_-3px_hsl(var(--primary))]">
              <span className="font-sans font-bold text-base md:text-lg text-primary-foreground">N</span>
            </div>
            <span className="font-sans text-lg md:text-xl font-bold tracking-tight">NIVO</span>
          </Link>

          {/* Status Indicator */}
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${step === 'IDLE' ? 'bg-muted-foreground' : 'bg-primary animate-pulse'}`} />
            <span className="font-mono text-[9px] md:text-[10px] text-muted-foreground uppercase tracking-wider hidden sm:block">
              {step === 'IDLE' && 'Système en attente'}
              {step === 'SUBJECTIVE' && 'Analyse sensorielle'}
              {step === 'LOAD' && 'Charge environnementale'}
              {step === 'FUNCTIONAL' && 'Test fonctionnel'}
              {step === 'COMPUTING' && 'Calcul en cours'}
              {step === 'COMPLETE' && 'Scan terminé'}
            </span>
          </div>
        </div>
      </nav>

      <main className="pt-20 md:pt-24 pb-8 md:pb-12 px-4 md:px-6 min-h-screen flex items-center justify-center">
        <AnimatePresence mode="wait">
          {/* IDLE State */}
          {step === 'IDLE' && (
            <motion.div
              key="idle"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center max-w-xl"
            >
              <div className="mb-8">
                <span className="text-primary font-mono text-xs tracking-widest uppercase mb-4 block">
                  Daily System Scan v2.0
                </span>
                <h1 className="font-sans font-semibold text-3xl md:text-4xl tracking-tight leading-[1.1] mb-4">
                  Check-in <span className="text-primary">Quotidien</span>
                </h1>
                <p className="text-muted-foreground font-sans leading-relaxed">
                  60 secondes pour calibrer votre NIVO Score et adapter votre routine.
                </p>
              </div>

              {/* Cooldown Warning */}
              {cooldownHours !== null && (
                <div className="mb-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
                  <div className="flex items-center justify-center gap-3">
                    <Clock className="w-5 h-5 text-amber-400" strokeWidth={1.5} />
                    <p className="font-mono text-sm text-amber-400">
                      SYSTÈME EN REFROIDISSEMENT. Disponible dans {cooldownHours}h.
                    </p>
                  </div>
                </div>
              )}

              {/* System Check Card */}
              <div className="p-8 rounded-3xl bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] mb-8">
                <div className="flex items-center justify-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                    <Activity className="w-8 h-8 text-primary" strokeWidth={1.5} />
                  </div>
                </div>
                <div className="font-mono text-sm text-muted-foreground space-y-1">
                  <p>{'>'} modules: [subjectif, charge, fonctionnel]</p>
                  <p>{'>'} durée_estimée: 60s</p>
                  <p>{'>'} awaiting_input...</p>
                </div>
              </div>

              <Button
                onClick={handleStartScan}
                disabled={cooldownHours !== null || isCheckingCooldown}
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium shadow-radioactive group disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Play className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" strokeWidth={1.5} />
                {cooldownHours !== null ? `Disponible dans ${cooldownHours}h` : 'Lancer le Scan'}
              </Button>
            </motion.div>
          )}

          {/* SUBJECTIVE Step */}
          {step === 'SUBJECTIVE' && (
            <motion.div
              key="subjective"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="w-full max-w-lg"
            >
              <div className="text-center mb-8">
                <span className="inline-flex items-center gap-2 text-primary font-mono text-xs tracking-widest uppercase mb-4 px-3 py-1 rounded-full border border-primary/30 bg-primary/10">
                  <Activity className="w-3 h-3" />
                  Étape 1/3 — Analyse Sensorielle
                </span>
                <h2 className="font-sans font-semibold text-2xl md:text-3xl tracking-tight">
                  Comment vous sentez-vous ?
                </h2>
              </div>

              <div className="space-y-8 p-6 rounded-2xl glass-card">
                {/* Pain Slider */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <label className="font-sans font-medium text-sm">Douleur / Gêne</label>
                    <span className="font-mono text-sm text-primary">{subjective.pain}/100</span>
                  </div>
                  <Slider
                    value={[subjective.pain]}
                    onValueChange={(v) => setSubjective(prev => ({ ...prev, pain: v[0] }))}
                    max={100}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground font-mono">
                    <span>Aucune</span>
                    <span>Intense</span>
                  </div>
                </div>

                {/* Stiffness Slider */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <label className="font-sans font-medium text-sm">Raideur</label>
                    <span className="font-mono text-sm text-primary">{subjective.stiffness}/100</span>
                  </div>
                  <Slider
                    value={[subjective.stiffness]}
                    onValueChange={(v) => setSubjective(prev => ({ ...prev, stiffness: v[0] }))}
                    max={100}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground font-mono">
                    <span>Fluide</span>
                    <span>Bloqué</span>
                  </div>
                </div>

                {/* Fatigue Slider */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <label className="font-sans font-medium text-sm">Fatigue / Stress</label>
                    <span className="font-mono text-sm text-primary">{subjective.fatigue}/100</span>
                  </div>
                  <Slider
                    value={[subjective.fatigue]}
                    onValueChange={(v) => setSubjective(prev => ({ ...prev, fatigue: v[0] }))}
                    max={100}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground font-mono">
                    <span>Énergique</span>
                    <span>Épuisé</span>
                  </div>
                </div>
              </div>

              {/* Progress Dots & Next Button */}
              <div className="mt-8 flex flex-col items-center gap-4">
                <Button
                  onClick={handleSubjectiveNext}
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium w-full max-w-xs"
                >
                  Continuer
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <div className="w-2 h-2 rounded-full bg-muted" />
                  <div className="w-2 h-2 rounded-full bg-muted" />
                </div>
              </div>
            </motion.div>
          )}

          {/* LOAD Step */}
          {step === 'LOAD' && (
            <motion.div
              key="load"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="w-full max-w-lg"
            >
              <div className="text-center mb-8">
                <span className="inline-flex items-center gap-2 text-primary font-mono text-xs tracking-widest uppercase mb-4 px-3 py-1 rounded-full border border-primary/30 bg-primary/10">
                  <Clock className="w-3 h-3" />
                  Étape 2/3 — Charge Environnementale
                </span>
                <h2 className="font-sans font-semibold text-2xl md:text-3xl tracking-tight">
                  Temps assis aujourd'hui ?
                </h2>
              </div>

              <div className="p-8 rounded-2xl glass-card">
                {/* Hours Stepper */}
                <div className="flex items-center justify-center gap-6">
                  <button
                    onClick={() => adjustHours(-1)}
                    className="w-14 h-14 rounded-xl bg-muted/50 border border-border flex items-center justify-center hover:bg-muted transition-colors"
                  >
                    <Minus className="w-6 h-6" />
                  </button>
                  
                  <div className="text-center">
                    <span className="font-mono text-6xl font-bold text-primary">{load.hoursSeated}</span>
                    <p className="font-mono text-sm text-muted-foreground mt-1">heures</p>
                  </div>
                  
                  <button
                    onClick={() => adjustHours(1)}
                    className="w-14 h-14 rounded-xl bg-muted/50 border border-border flex items-center justify-center hover:bg-muted transition-colors"
                  >
                    <Plus className="w-6 h-6" />
                  </button>
                </div>

                {/* Warning Message */}
                {load.hoursSeated > 6 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6 p-4 rounded-xl bg-destructive/10 border border-destructive/20"
                  >
                    <div className="flex items-center gap-3">
                      <AlertTriangle className="w-5 h-5 text-destructive flex-shrink-0" />
                      <p className="font-mono text-sm text-destructive">
                        ⚠️ Charge discale élevée détectée
                      </p>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Progress Dots & Next Button */}
              <div className="mt-8 flex flex-col items-center gap-4">
                <Button
                  onClick={handleLoadNext}
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium w-full max-w-xs"
                >
                  Continuer
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <div className="w-2 h-2 rounded-full bg-muted" />
                </div>
              </div>
            </motion.div>
          )}

          {/* FUNCTIONAL Step */}
          {step === 'FUNCTIONAL' && (
            <motion.div
              key="functional"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="w-full max-w-lg"
            >
              <div className="text-center mb-6">
                <span className="inline-flex items-center gap-2 text-primary font-mono text-xs tracking-widest uppercase mb-4 px-3 py-1 rounded-full border border-primary/30 bg-primary/10">
                  <Camera className="w-3 h-3" />
                  Étape 3/3 — Bilan Postural
                </span>
                <h2 className="font-sans font-semibold text-2xl md:text-3xl tracking-tight">
                  {functionalMode === 'scanner' ? 'Analyse Posturale' : 'Seated Wall Angel'}
                </h2>
                {functionalMode === 'scanner' && (
                  <p className="text-muted-foreground text-sm mt-2">
                    Placez-vous de profil face à la caméra
                  </p>
                )}
              </div>

              <div className="p-6 rounded-2xl glass-card mb-6">
                {functionalMode === 'scanner' ? (
                  <PostureScanner
                    onScoreCapture={(score) => handleFunctionalComplete(score)}
                    onFallback={() => setFunctionalMode('manual')}
                  />
                ) : (
                  <>
                    {/* Manual Mode - Original UI */}
                    <div className="text-center mb-6">
                      <div className="w-20 h-20 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-4">
                        <Activity className="w-10 h-10 text-primary" />
                      </div>
                      <p className="text-muted-foreground font-sans text-sm leading-relaxed">
                        Assis, dos au mur. Levez les bras en "W" puis en "Y".<br />
                        Gardez le contact avec le mur.
                      </p>
                    </div>

                    {/* Result Buttons */}
                    <div className="space-y-3">
                      <button
                        onClick={() => handleFunctionalComplete(3)}
                        disabled={isSaving}
                        className="w-full p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 hover:bg-emerald-500/20 transition-colors flex items-center gap-4"
                      >
                        <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                        </div>
                        <div className="text-left">
                          <p className="font-sans font-medium text-emerald-400">Succès</p>
                          <p className="font-mono text-xs text-muted-foreground">Je touche partout</p>
                        </div>
                      </button>

                      <button
                        onClick={() => handleFunctionalComplete(1.5)}
                        disabled={isSaving}
                        className="w-full p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 hover:bg-amber-500/20 transition-colors flex items-center gap-4"
                      >
                        <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
                          <AlertTriangle className="w-5 h-5 text-amber-400" />
                        </div>
                        <div className="text-left">
                          <p className="font-sans font-medium text-amber-400">Partiel</p>
                          <p className="font-mono text-xs text-muted-foreground">Je décolle les poignets</p>
                        </div>
                      </button>

                      <button
                        onClick={() => handleFunctionalComplete(0)}
                        disabled={isSaving}
                        className="w-full p-4 rounded-xl bg-destructive/10 border border-destructive/30 hover:bg-destructive/20 transition-colors flex items-center gap-4"
                      >
                        <div className="w-10 h-10 rounded-lg bg-destructive/20 flex items-center justify-center">
                          <XCircle className="w-5 h-5 text-destructive" />
                        </div>
                        <div className="text-left">
                          <p className="font-sans font-medium text-destructive">Échec</p>
                          <p className="font-mono text-xs text-muted-foreground">Douleur ou impossible</p>
                        </div>
                      </button>
                    </div>

                    {/* Switch to scanner */}
                    <button
                      onClick={() => setFunctionalMode('scanner')}
                      className="w-full text-center text-xs text-primary hover:text-primary/80 transition-colors py-3 mt-4"
                    >
                      ← Utiliser le scan par caméra
                    </button>
                  </>
                )}
              </div>

              {/* Progress Dots */}
              <div className="flex items-center justify-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary" />
                <div className="w-2 h-2 rounded-full bg-primary" />
                <div className="w-2 h-2 rounded-full bg-primary" />
              </div>
            </motion.div>
          )}

          {/* COMPUTING State */}
          {step === 'COMPUTING' && (
            <motion.div
              key="computing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center max-w-lg w-full"
            >
              <div className="mb-8">
                <span className="text-primary font-mono text-xs tracking-widest uppercase mb-4 block animate-pulse">
                  Traitement des Données
                </span>
                <h2 className="font-sans font-semibold text-2xl md:text-3xl tracking-tight mb-2">
                  Calcul du NIVO Score...
                </h2>
              </div>

              <div className="p-8 rounded-2xl glass-card">
                {/* Loading Animation */}
                <div className="flex items-center justify-center mb-6">
                  <div className="relative">
                    <Loader2 className="w-16 h-16 text-primary animate-spin" />
                    <div className="absolute inset-0 rounded-full shadow-[0_0_40px_rgba(255,107,74,0.3)]" />
                  </div>
                </div>

                {/* Terminal Output */}
                <div className="font-mono text-sm text-left space-y-1">
                  {computingLines.slice(0, computingLine + 1).map((line, index) => (
                    <motion.p
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={index === computingLine ? 'text-primary' : 'text-muted-foreground'}
                    >
                      {line}
                    </motion.p>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* COMPLETE State */}
          {step === 'COMPLETE' && (
            <motion.div
              key="complete"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="text-center max-w-lg w-full"
            >
              <div className="mb-8">
                <span className="text-primary font-mono text-xs tracking-widest uppercase mb-4 block">
                  Scan Terminé
                </span>
                <h2 className="font-sans font-semibold text-2xl md:text-3xl tracking-tight mb-2">
                  Données enregistrées !
                </h2>
                <p className="text-muted-foreground">
                  Redirection vers votre Dashboard...
                </p>
              </div>

              <div className="p-8 rounded-2xl glass-card">
                <div className="flex items-center justify-center">
                  <div className="w-20 h-20 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center">
                    <CheckCircle2 className="w-10 h-10 text-primary" />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
