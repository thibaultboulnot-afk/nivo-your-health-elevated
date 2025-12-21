import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, AlertTriangle, Activity, Gauge, Check, Zap, ArrowRight } from 'lucide-react';

type ScanState = 'IDLE' | 'SCANNING' | 'QUESTION_1' | 'QUESTION_2' | 'QUESTION_3' | 'COMPUTING' | 'RESULT';

interface Answer {
  crashSource: string | null;
  alertFrequency: string | null;
  performanceImpact: string | null;
}

const scanningTexts = [
  'Initialisation du système...',
  'Connexion aux capteurs biomécaniques...',
  'Check vertèbres cervicales...',
  'Analyse posture lombaire...',
  'Détection des tensions musculaires...',
  'Évaluation du système nerveux...',
  'Compilation des données...',
];

const questions = {
  Q1: {
    label: 'ERROR LOG DETECTED',
    title: 'Où se situe la défaillance principale ?',
    choices: [
      { id: 'cervicales', label: 'Cervicales', subtitle: 'Tech Neck' },
      { id: 'lombaires', label: 'Lombaires', subtitle: 'Core Failure' },
      { id: 'fatigue', label: 'Fatigue', subtitle: 'System Crash' },
    ],
  },
  Q2: {
    label: 'ALERT FREQUENCY',
    title: 'À quelle fréquence le système envoie-t-il des signaux ?',
    choices: [
      { id: 'constante', label: 'Constante', subtitle: 'Alerte permanente' },
      { id: 'fin-journee', label: 'Fin de journée', subtitle: 'Accumulation' },
      { id: 'reveil', label: 'Au réveil', subtitle: 'Post-repos' },
    ],
  },
  Q3: {
    label: 'PERFORMANCE IMPACT',
    title: 'Quel est l\'impact sur votre bande passante ?',
    choices: [
      { id: 'nul', label: 'Nul', subtitle: 'Maintenance préventive' },
      { id: 'genant', label: 'Gênant', subtitle: 'Latence détectée' },
      { id: 'critique', label: 'Critique', subtitle: 'Shutdown imminent' },
    ],
  },
};

const computingLines = [
  '> Analysing crash_log.dat...',
  '> Mapping tension_points[]...',
  '> Calculating recovery_index...',
  '> Generating patch_recommendation...',
  '> Compiling final_report.json...',
  '> System analysis complete.',
];

export default function Diagnostic() {
  const [state, setState] = useState<ScanState>('IDLE');
  const [scanProgress, setScanProgress] = useState(0);
  const [currentScanText, setCurrentScanText] = useState(0);
  const [answers, setAnswers] = useState<Answer>({
    crashSource: null,
    alertFrequency: null,
    performanceImpact: null,
  });
  const [computingLine, setComputingLine] = useState(0);
  const [healthScore, setHealthScore] = useState(0);

  // Scanning animation
  useEffect(() => {
    if (state === 'SCANNING') {
      const progressInterval = setInterval(() => {
        setScanProgress((prev) => {
          if (prev >= 100) {
            clearInterval(progressInterval);
            setState('QUESTION_1');
            return 100;
          }
          return prev + 2;
        });
      }, 80);

      const textInterval = setInterval(() => {
        setCurrentScanText((prev) => (prev + 1) % scanningTexts.length);
      }, 600);

      return () => {
        clearInterval(progressInterval);
        clearInterval(textInterval);
      };
    }
  }, [state]);

  // Computing animation
  useEffect(() => {
    if (state === 'COMPUTING') {
      const interval = setInterval(() => {
        setComputingLine((prev) => {
          if (prev >= computingLines.length - 1) {
            clearInterval(interval);
            // Calculate health score based on answers
            let score = 75;
            if (answers.crashSource === 'fatigue') score -= 15;
            if (answers.alertFrequency === 'constante') score -= 10;
            if (answers.performanceImpact === 'critique') score -= 20;
            if (answers.performanceImpact === 'genant') score -= 8;
            setHealthScore(Math.max(35, Math.min(85, score)));
            
            setTimeout(() => setState('RESULT'), 500);
            return prev;
          }
          return prev + 1;
        });
      }, 400);

      return () => clearInterval(interval);
    }
  }, [state, answers]);

  const handleStartScan = () => {
    setScanProgress(0);
    setCurrentScanText(0);
    setState('SCANNING');
  };

  const handleAnswer = (question: 'Q1' | 'Q2' | 'Q3', answerId: string) => {
    if (question === 'Q1') {
      setAnswers((prev) => ({ ...prev, crashSource: answerId }));
      setState('QUESTION_2');
    } else if (question === 'Q2') {
      setAnswers((prev) => ({ ...prev, alertFrequency: answerId }));
      setState('QUESTION_3');
    } else if (question === 'Q3') {
      setAnswers((prev) => ({ ...prev, performanceImpact: answerId }));
      setComputingLine(0);
      setState('COMPUTING');
    }
  };

  const getRecommendation = () => {
    if (answers.crashSource === 'cervicales') {
      return { name: 'Rapid Patch (Neck)', price: '49€', plan: 'RAPID_PATCH' };
    } else if (answers.crashSource === 'lombaires') {
      return { name: 'Rapid Patch (Back)', price: '49€', plan: 'RAPID_PATCH' };
    } else if (answers.performanceImpact === 'critique' || answers.crashSource === 'fatigue') {
      return { name: 'System Reboot (Full)', price: '99€', plan: 'SYSTEM_REBOOT' };
    } else {
      return { name: 'Rapid Patch', price: '49€', plan: 'RAPID_PATCH' };
    }
  };

  const getZoneLabel = () => {
    if (answers.crashSource === 'cervicales') return 'Zone Cervicale';
    if (answers.crashSource === 'lombaires') return 'Zone Lombaire';
    return 'Système Global';
  };

  return (
    <div className="min-h-screen bg-[#050510] relative overflow-hidden text-foreground">
      {/* Background Effects */}
      <div className="aurora absolute inset-0 pointer-events-none opacity-30" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,107,74,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,107,74,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-border backdrop-blur-md">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-[0_0_15px_-3px_hsl(var(--primary))]">
              <span className="font-body font-bold text-lg text-background">N</span>
            </div>
            <span className="font-body text-xl font-bold tracking-tight">NIVO</span>
          </Link>

          {/* Status Indicator */}
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${state === 'IDLE' ? 'bg-muted-foreground' : 'bg-primary animate-pulse'}`} />
            <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider">
              {state === 'IDLE' && 'Système en attente'}
              {state === 'SCANNING' && 'Scan en cours'}
              {(state === 'QUESTION_1' || state === 'QUESTION_2' || state === 'QUESTION_3') && 'Analyse interactive'}
              {state === 'COMPUTING' && 'Calcul en cours'}
              {state === 'RESULT' && 'Rapport généré'}
            </span>
          </div>
        </div>
      </nav>

      <main className="pt-24 pb-12 px-6 min-h-screen flex items-center justify-center">
        <AnimatePresence mode="wait">
          {/* IDLE State */}
          {state === 'IDLE' && (
            <motion.div
              key="idle"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center max-w-xl"
            >
              <div className="mb-8">
                <span className="text-primary font-mono text-xs tracking-widest uppercase mb-4 block">
                  Bio-System Diagnostic v3.0
                </span>
                <h1 className="font-heading font-medium text-4xl md:text-5xl tracking-tight leading-[1.1] mb-4">
                  Analysez votre <span className="text-primary">système</span>
                </h1>
                <p className="text-slate-400 font-body leading-relaxed">
                  Lancez un diagnostic complet pour identifier les défaillances posturales et recevoir un protocole de récupération personnalisé.
                </p>
              </div>

              {/* System Check Card */}
              <div className="p-8 rounded-3xl bg-gradient-to-b from-white/5 to-transparent border border-white/10 mb-8">
                <div className="flex items-center justify-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                    <Activity className="w-8 h-8 text-primary" />
                  </div>
                </div>
                <div className="font-mono text-sm text-slate-500 space-y-1">
                  <p>{'>'} ready_to_scan: true</p>
                  <p>{'>'} modules_loaded: 6/6</p>
                  <p>{'>'} awaiting_user_input...</p>
                </div>
              </div>

              <Button
                onClick={handleStartScan}
                size="lg"
                className="bg-primary hover:bg-primary/90 text-background font-medium shadow-radioactive shimmer-btn group"
              >
                <Play className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                Lancer l'analyse système
              </Button>
            </motion.div>
          )}

          {/* SCANNING State */}
          {state === 'SCANNING' && (
            <motion.div
              key="scanning"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="text-center max-w-lg w-full"
            >
              <div className="mb-8">
                <span className="text-primary font-mono text-xs tracking-widest uppercase mb-4 block animate-pulse">
                  System Scan in Progress
                </span>
                <h2 className="font-heading font-medium text-3xl tracking-tight mb-2">
                  Analyse en cours...
                </h2>
              </div>

              <div className="p-8 rounded-3xl bg-gradient-to-b from-white/5 to-transparent border border-white/10">
                {/* Circular Progress */}
                <div className="relative w-32 h-32 mx-auto mb-6">
                  <svg className="w-full h-full -rotate-90">
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      strokeWidth="4"
                      fill="none"
                      className="stroke-white/10"
                    />
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      strokeWidth="4"
                      fill="none"
                      className="stroke-primary"
                      strokeLinecap="round"
                      strokeDasharray={351.86}
                      strokeDashoffset={351.86 - (351.86 * scanProgress) / 100}
                      style={{ transition: 'stroke-dashoffset 0.1s ease-out' }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="font-mono text-2xl font-bold text-primary">{scanProgress}%</span>
                  </div>
                  <div className="absolute inset-0 rounded-full shadow-[0_0_40px_rgba(255,107,74,0.3)]" />
                </div>

                {/* Scanning Text */}
                <div className="h-6 overflow-hidden">
                  <motion.p
                    key={currentScanText}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="font-mono text-sm text-slate-400"
                  >
                    {scanningTexts[currentScanText]}
                  </motion.p>
                </div>

                {/* Progress Bar */}
                <div className="mt-6 w-full h-1 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary to-primary/60 transition-all duration-100"
                    style={{ width: `${scanProgress}%` }}
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* QUESTION States */}
          {(state === 'QUESTION_1' || state === 'QUESTION_2' || state === 'QUESTION_3') && (
            <motion.div
              key={state}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="text-center max-w-2xl w-full"
            >
              {(() => {
                const q = state === 'QUESTION_1' ? questions.Q1 : state === 'QUESTION_2' ? questions.Q2 : questions.Q3;
                const qKey = state === 'QUESTION_1' ? 'Q1' : state === 'QUESTION_2' ? 'Q2' : 'Q3';
                return (
                  <>
                    <div className="mb-10">
                      <span className="inline-flex items-center gap-2 text-primary font-mono text-xs tracking-widest uppercase mb-4 px-3 py-1 rounded-full border border-primary/30 bg-primary/10">
                        <AlertTriangle className="w-3 h-3" />
                        {q.label}
                      </span>
                      <h2 className="font-heading font-medium text-3xl md:text-4xl tracking-tight">
                        {q.title}
                      </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {q.choices.map((choice, index) => (
                        <motion.button
                          key={choice.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          onClick={() => handleAnswer(qKey, choice.id)}
                          className="group p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 text-left"
                        >
                          <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <Gauge className="w-6 h-6 text-primary" />
                          </div>
                          <h3 className="font-heading font-medium text-xl tracking-tight mb-1">
                            {choice.label}
                          </h3>
                          <p className="font-mono text-xs text-slate-500">
                            {choice.subtitle}
                          </p>
                        </motion.button>
                      ))}
                    </div>

                    {/* Progress Dots */}
                    <div className="flex items-center justify-center gap-2 mt-8">
                      {[1, 2, 3].map((n) => (
                        <div
                          key={n}
                          className={`w-2 h-2 rounded-full transition-all ${
                            (state === 'QUESTION_1' && n === 1) ||
                            (state === 'QUESTION_2' && n <= 2) ||
                            (state === 'QUESTION_3' && n <= 3)
                              ? 'bg-primary'
                              : 'bg-white/20'
                          }`}
                        />
                      ))}
                    </div>
                  </>
                );
              })()}
            </motion.div>
          )}

          {/* COMPUTING State */}
          {state === 'COMPUTING' && (
            <motion.div
              key="computing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center max-w-lg w-full"
            >
              <div className="mb-8">
                <span className="text-primary font-mono text-xs tracking-widest uppercase mb-4 block animate-pulse">
                  Processing Results
                </span>
                <h2 className="font-heading font-medium text-3xl tracking-tight">
                  Calcul du diagnostic...
                </h2>
              </div>

              <div className="p-6 rounded-2xl bg-black/50 border border-white/10 font-mono text-sm text-left">
                {computingLines.slice(0, computingLine + 1).map((line, index) => (
                  <motion.p
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`${index === computingLine ? 'text-primary' : 'text-slate-500'} ${index === computingLine ? 'animate-pulse' : ''}`}
                  >
                    {line}
                  </motion.p>
                ))}
                <span className="inline-block w-2 h-4 bg-primary animate-pulse ml-1" />
              </div>
            </motion.div>
          )}

          {/* RESULT State */}
          {state === 'RESULT' && (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center max-w-2xl w-full"
            >
              <div className="mb-8">
                <span className="inline-flex items-center gap-2 text-primary font-mono text-xs tracking-widest uppercase mb-4 px-3 py-1 rounded-full border border-primary/30 bg-primary/10">
                  <Check className="w-3 h-3" />
                  Analyse Complète
                </span>
                <h2 className="font-heading font-medium text-3xl md:text-4xl tracking-tight">
                  Rapport Système
                </h2>
              </div>

              {/* Result Card - Holographic Style */}
              <div className="p-8 rounded-3xl bg-gradient-to-br from-primary/10 via-white/5 to-transparent border border-primary/30 relative overflow-hidden mb-8">
                {/* Holographic shimmer effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_3s_infinite]" />
                
                <div className="relative z-10">
                  {/* Health Score Circle */}
                  <div className="flex items-center justify-center gap-8 mb-8">
                    <div className="relative">
                      <svg className="w-36 h-36 -rotate-90">
                        <circle
                          cx="72"
                          cy="72"
                          r="64"
                          strokeWidth="6"
                          fill="none"
                          className="stroke-white/10"
                        />
                        <motion.circle
                          cx="72"
                          cy="72"
                          r="64"
                          strokeWidth="6"
                          fill="none"
                          className="stroke-primary"
                          strokeLinecap="round"
                          strokeDasharray={402.12}
                          initial={{ strokeDashoffset: 402.12 }}
                          animate={{ strokeDashoffset: 402.12 - (402.12 * healthScore) / 100 }}
                          transition={{ duration: 1.5, ease: 'easeOut' }}
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <motion.span
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.5 }}
                          className="font-mono text-3xl font-bold text-primary"
                        >
                          {healthScore}%
                        </motion.span>
                        <span className="font-mono text-[10px] text-slate-500 uppercase">
                          Santé Système
                        </span>
                      </div>
                      <div className="absolute inset-0 rounded-full shadow-[0_0_60px_rgba(255,107,74,0.3)]" />
                    </div>
                  </div>

                  {/* Diagnostic Summary */}
                  <div className="text-left space-y-4 mb-8 p-4 rounded-xl bg-black/30 border border-white/5">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-primary mt-0.5" />
                      <div>
                        <h4 className="font-heading font-medium text-lg tracking-tight">Latence Sévère Détectée</h4>
                        <p className="text-sm text-slate-400">
                          au niveau de la <span className="text-primary">{getZoneLabel()}</span>
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Recommendation */}
                  <div className="p-6 rounded-2xl bg-primary/10 border border-primary/30">
                    <div className="flex items-center gap-2 mb-3">
                      <Zap className="w-5 h-5 text-primary" />
                      <span className="font-mono text-xs text-primary uppercase tracking-wider">
                        Patch Recommandé
                      </span>
                    </div>
                    <h3 className="font-heading font-medium text-2xl tracking-tight mb-2">
                      {getRecommendation().name}
                    </h3>
                    <p className="text-slate-400 text-sm mb-4">
                      Protocole ciblé pour corriger les défaillances identifiées.
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-2xl font-bold text-primary">
                        {getRecommendation().price}
                      </span>
                      <span className="font-mono text-xs text-slate-500">
                        Accès immédiat
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* CTA Button */}
              <Link to={`/checkout?plan=${getRecommendation().plan}`}>
                <Button
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-background font-medium shadow-radioactive shimmer-btn group animate-pulse"
                >
                  Installer le Patch
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>

              <p className="mt-4 font-mono text-xs text-slate-600">
                Accès immédiat • Protocole personnalisé • Garantie 30 jours
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
