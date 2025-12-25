import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useUserStats } from '@/hooks/useUserStats';
import { useAccess } from '@/hooks/useAccess';
import { UpgradeModal } from '@/components/UpgradeModal';
import { Button } from '@/components/ui/button';
import {
  Settings,
  Activity,
  Zap,
  Shield,
  Clock,
  Headphones,
  Lock,
  Play,
  User,
  Battery,
  AlertTriangle,
  ArrowRight,
  ChevronUp,
  Crown,
} from 'lucide-react';
import { Loader2 } from 'lucide-react';
import { DAILY_ROUTINE, SPECIFIC_PROTOCOLS, PILOT_PROGRAMS, type Protocol, type PilotProgram } from '@/data/programs';
import { motion } from 'framer-motion';

export default function Dashboard() {
  const { signOut, user } = useAuth();
  const navigate = useNavigate();
  const { stats, isLoading } = useUserStats();
  const { isPro, accessLevel } = useAccess();
  const [isMobile, setIsMobile] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

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
      setShowBackToTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Determine status based on NIVO score
  const getStatusConfig = () => {
    if (!stats?.nivoScore) {
      return {
        text: 'FAIRE VOTRE CHECK-IN QUOTIDIEN',
        color: 'text-foreground/50',
        bgColor: 'bg-white/5',
        borderColor: 'border-white/10',
      };
    }
    if (stats.nivoScore < 40) {
      return {
        text: 'SYSTÈME CRITIQUE. ROUTINE D\'URGENCE RECOMMANDÉE.',
        color: 'text-red-400',
        bgColor: 'bg-red-500/10',
        borderColor: 'border-red-500/30',
      };
    }
    if (stats.nivoScore < 60) {
      return {
        text: 'TENSIONS DÉTECTÉES. ROUTINE RECOMMANDÉE.',
        color: 'text-primary',
        bgColor: 'bg-primary/10',
        borderColor: 'border-primary/30',
      };
    }
    if (stats.nivoScore >= 80) {
      return {
        text: 'SYSTÈME OPTIMAL. MODE MAINTENANCE.',
        color: 'text-emerald-400',
        bgColor: 'bg-emerald-500/10',
        borderColor: 'border-emerald-500/30',
      };
    }
    return {
      text: 'SYSTÈME STABLE. CONTINUEZ AINSI.',
      color: 'text-amber-400',
      bgColor: 'bg-amber-500/10',
      borderColor: 'border-amber-500/30',
    };
  };

  const statusConfig = getStatusConfig();

  // Calculate SVG circle parameters
  const circleRadius = 90;
  const circumference = 2 * Math.PI * circleRadius;
  const displayScore = stats?.nivoScore ?? 0;
  const strokeDashoffset = circumference - (displayScore / 100) * circumference;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#050510] flex items-center justify-center">
        <div className="text-center">
          <div className="font-mono text-primary animate-pulse mb-4">
            <div className="text-sm mb-2">&gt; CHARGEMENT EN COURS...</div>
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          </div>
          <div className="font-mono text-xs text-foreground/30">
            Préparation de votre espace...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050510] relative overflow-hidden">
      {/* Background Effects */}
      <div className="aurora absolute inset-0 pointer-events-none opacity-30" />
      <div className="grid-background absolute inset-0 pointer-events-none opacity-10" />
      
      {/* Noise Texture */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.015]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Header */}
      <header className="relative z-20 border-b border-white/5 bg-[#050510]/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 md:px-6 py-3 md:py-4">
          <div className="flex items-center justify-between">
            {/* Left - Logo */}
            <div className="flex items-center gap-2 md:gap-3">
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-primary flex items-center justify-center shadow-[0_0_20px_rgba(255,107,74,0.4)]">
                <span className="font-bold text-black text-base md:text-lg">N</span>
              </div>
              <span className="font-bold text-foreground text-base md:text-lg">NIVO</span>
              {isPro && (
                <span className="px-2 py-0.5 bg-primary/20 border border-primary/30 rounded-full font-mono text-[10px] text-primary flex items-center gap-1">
                  <Crown className="w-3 h-3" />
                  PRO
                </span>
              )}
            </div>

            {/* Right - Avatar & Settings */}
            <div className="flex items-center gap-2 md:gap-4">
              <Link 
                to="/settings"
                className="p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all"
              >
                <Settings className="h-4 w-4 md:h-5 md:w-5 text-foreground/60" />
              </Link>
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center">
                <User className="h-4 w-4 md:h-5 md:w-5 text-primary" />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 container mx-auto px-4 md:px-6 py-4 md:py-8">
        {/* Hero - NIVO Score */}
        <section className="mb-6 md:mb-10 animate-fade-in">
          <div className="bg-black/60 rounded-xl md:rounded-2xl border border-white/10 p-4 md:p-8 relative overflow-hidden">
            {/* Subtle glow effect */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
            </div>

            <div className="relative z-10 flex flex-col items-center gap-6 md:gap-8">
              {/* Score Circle */}
              <div className="relative">
                <svg className="w-36 h-36 md:w-52 md:h-52 -rotate-90" viewBox="0 0 200 200">
                  {/* Background circle */}
                  <circle
                    cx="100"
                    cy="100"
                    r={circleRadius}
                    fill="none"
                    stroke="rgba(255,255,255,0.1)"
                    strokeWidth="8"
                  />
                  {/* Progress circle */}
                  <circle
                    cx="100"
                    cy="100"
                    r={circleRadius}
                    fill="none"
                    stroke="url(#scoreGradient)"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    className="transition-all duration-1000 ease-out"
                  />
                  <defs>
                    <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="hsl(var(--primary))" />
                      <stop offset="100%" stopColor="#ff8a6a" />
                    </linearGradient>
                  </defs>
                </svg>
                {/* Score Text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="font-mono text-3xl md:text-5xl font-bold text-foreground">
                    {stats?.nivoScore ? `${stats.nivoScore}` : 'N/A'}
                  </span>
                  <span className="font-mono text-[10px] md:text-xs text-foreground/40 mt-1">NIVO SCORE</span>
                </div>
              </div>

              {/* Status & Stats */}
              <div className="flex-1 text-center w-full">
                <div className={`inline-block px-3 md:px-4 py-2 rounded-lg ${statusConfig.bgColor} border ${statusConfig.borderColor} mb-4 md:mb-6`}>
                  <p className={`font-mono text-xs md:text-sm ${statusConfig.color}`}>{statusConfig.text}</p>
                </div>

                {/* No Score CTA */}
                {!stats?.nivoScore && (
                  <div className="mb-4 md:mb-6">
                    <Link to="/diagnostic">
                      <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-sm">
                        <AlertTriangle className="h-4 w-4 mr-2" />
                        FAIRE MON CHECK-IN
                      </Button>
                    </Link>
                  </div>
                )}

                {/* Stats Widgets */}
                <div className="grid grid-cols-2 gap-3 md:gap-4 max-w-md mx-auto">
                  {/* Streak */}
                  <div className="bg-white/5 border border-white/10 rounded-lg md:rounded-xl p-3 md:p-4 hover:border-primary/30 transition-colors">
                    <div className="flex items-center gap-1 md:gap-2 mb-1 md:mb-2">
                      <Clock className="h-3 w-3 md:h-4 md:w-4 text-foreground/40" />
                      <span className="font-mono text-[8px] md:text-[10px] text-foreground/40">SÉRIE</span>
                    </div>
                    <p className="font-mono text-xl md:text-2xl font-bold text-foreground">{stats?.streak || 0} <span className="text-xs md:text-sm text-foreground/40">J</span></p>
                  </div>
                  {/* Total Sessions */}
                  <div className="bg-white/5 border border-white/10 rounded-lg md:rounded-xl p-3 md:p-4 hover:border-primary/30 transition-colors">
                    <div className="flex items-center gap-1 md:gap-2 mb-1 md:mb-2">
                      <Activity className="h-3 w-3 md:h-4 md:w-4 text-foreground/40" />
                      <span className="font-mono text-[8px] md:text-[10px] text-foreground/40">SESSIONS</span>
                    </div>
                    <p className="font-mono text-xl md:text-2xl font-bold text-foreground">{stats?.totalSessions || 0}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          {/* Left Column - Daily Loop (FREE) */}
          <section className="lg:col-span-2 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <div className="bg-black/60 rounded-xl md:rounded-2xl border border-primary/20 p-5 md:p-8 relative overflow-hidden group hover:border-primary/40 transition-all duration-500">
              {/* Glow effect */}
              <div className="absolute inset-0 pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity">
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/10 rounded-full blur-3xl" />
              </div>

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3 md:mb-4">
                  <div className="flex items-center gap-2">
                    <Headphones className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                    <span className="font-mono text-[11px] md:text-xs text-primary">ROUTINE QUOTIDIENNE</span>
                  </div>
                  <span className="px-2 py-1 bg-emerald-500/20 border border-emerald-500/30 rounded-full font-mono text-[10px] text-emerald-400">
                    GRATUIT
                  </span>
                </div>

                <h2 className="font-heading text-xl md:text-3xl font-bold text-foreground mb-1 md:mb-2">
                  {DAILY_ROUTINE.name}
                </h2>
                <p className="font-mono text-xs md:text-sm text-foreground/50 mb-4 md:mb-6">
                  {DAILY_ROUTINE.duration_minutes} min :: {DAILY_ROUTINE.steps.length} exercices // {DAILY_ROUTINE.focus}
                </p>

                {/* Daily Loop Steps Preview */}
                <div className="bg-white/5 border border-white/10 rounded-lg md:rounded-xl p-3 md:p-4 mb-4 md:mb-6">
                  <p className="font-mono text-[10px] md:text-xs text-foreground/40 mb-2">SÉQUENCE</p>
                  <div className="flex flex-wrap gap-2">
                    {DAILY_ROUTINE.steps.map((step, index) => (
                      <span key={index} className="px-2 py-1 bg-white/5 border border-white/10 rounded font-mono text-[10px] text-foreground/60">
                        {step.exercise.name}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Launch Button */}
                <Link to="/session/daily_loop" className="block">
                  <Button className="w-full h-12 md:h-14 min-h-[48px] bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-base md:text-lg shadow-[0_0_30px_rgba(255,107,74,0.4)] hover:shadow-[0_0_50px_rgba(255,107,74,0.6)] transition-all duration-300">
                    <Play className="h-5 w-5 md:h-6 md:w-6 mr-2" />
                    LANCER LA ROUTINE
                  </Button>
                </Link>
              </div>
            </div>
          </section>

          {/* Right Column - System Stats */}
          <section className="space-y-4 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            {/* Upgrade to Pro CTA (Free users only) */}
            {!isPro && (
              <div className="bg-black/60 rounded-xl border border-primary/30 p-6 relative overflow-hidden hover:border-primary/50 transition-colors">
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute -top-16 -right-16 w-40 h-40 bg-primary/10 rounded-full blur-3xl" />
                </div>

                <div className="relative z-10">
                  <div className="flex items-center justify-between gap-4 mb-3">
                    <div>
                      <p className="font-mono text-[10px] text-primary uppercase tracking-widest">NIVO PRO</p>
                      <p className="font-heading text-lg font-semibold text-foreground mt-1">
                        Débloquez les protocoles ciblés
                      </p>
                    </div>
                    <div className="shrink-0 w-10 h-10 rounded-lg bg-primary/15 border border-primary/25 flex items-center justify-center">
                      <Crown className="h-5 w-5 text-primary" />
                    </div>
                  </div>

                  <Link to="/checkout" className="block">
                    <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold">
                      <ArrowRight className="h-4 w-4 mr-2" />
                      DEVENIR PRO
                    </Button>
                  </Link>
                </div>
              </div>
            )}

            {/* Energy Level */}
            <div className="bg-black/60 rounded-xl border border-white/10 p-6 hover:border-primary/30 transition-colors">
              <div className="flex items-center gap-2 mb-3">
                <Battery className="h-4 w-4 text-foreground/40" />
                <span className="font-mono text-[10px] text-foreground/40">NIVEAU D'ÉNERGIE</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary to-amber-500 rounded-full transition-all"
                    style={{ width: `${displayScore}%` }}
                  />
                </div>
                <span className="font-mono text-sm text-foreground">{displayScore}%</span>
              </div>
            </div>

            {/* Access Level */}
            <div className="bg-black/60 rounded-xl border border-white/10 p-6 hover:border-primary/30 transition-colors">
              <div className="flex items-center gap-2 mb-3">
                <Shield className="h-4 w-4 text-foreground/40" />
                <span className="font-mono text-[10px] text-foreground/40">NIVEAU D'ACCÈS</span>
              </div>
              <p className="font-mono text-lg font-semibold text-foreground flex items-center gap-2">
                {isPro ? (
                  <>
                    <Crown className="h-4 w-4 text-primary" />
                    NIVO PRO
                  </>
                ) : (
                  'GRATUIT'
                )}
              </p>
              <p className="font-mono text-xs text-foreground/40">
                {isPro ? 'Accès complet aux protocoles' : 'Routine quotidienne uniquement'}
              </p>
            </div>

            {/* Quick Stats */}
            <div className="bg-black/60 rounded-xl border border-white/10 p-6 hover:border-primary/30 transition-colors">
              <div className="flex items-center gap-2 mb-4">
                <Zap className="h-4 w-4 text-foreground/40" />
                <span className="font-mono text-[10px] text-foreground/40">MÉTRIQUES</span>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="font-mono text-xs text-foreground/40">SESSIONS</span>
                  <span className="font-mono text-sm text-foreground">{stats?.totalSessions || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-mono text-xs text-foreground/40">SÉRIE</span>
                  <span className="font-mono text-sm text-emerald-400">{stats?.streak || 0} jours</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-mono text-xs text-foreground/40">STATUT</span>
                  <span className="font-mono text-sm text-emerald-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    ACTIF
                  </span>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Pro Protocols Section */}
        <section className="mt-10 animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <div className="flex items-center gap-3 mb-6">
            <span className="font-mono text-xs text-foreground/40">PROTOCOLES_CIBLÉS //</span>
            <div className="flex-1 h-px bg-white/10" />
            {!isPro && (
              <span className="px-2 py-1 bg-primary/10 border border-primary/20 rounded font-mono text-[10px] text-primary">
                PRO REQUIS
              </span>
            )}
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {SPECIFIC_PROTOCOLS.map((protocol: Protocol) => (
              <div 
                key={protocol.id}
                onClick={() => !isPro && setShowUpgradeModal(true)}
                className={`relative bg-black/60 rounded-xl border p-6 transition-all duration-300 ${
                  isPro 
                    ? 'border-white/10 hover:border-primary/30 cursor-pointer' 
                    : 'border-white/5 opacity-70 cursor-pointer hover:opacity-80'
                }`}
              >
                {/* Lock Badge & Blur Overlay */}
                {!isPro && (
                  <>
                    <div className="absolute inset-0 bg-black/20 backdrop-blur-[1px] rounded-xl" />
                    <div className="absolute top-4 right-4 z-10">
                      <div className="w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center">
                        <Lock className="h-4 w-4 text-foreground/50" />
                      </div>
                    </div>
                  </>
                )}

                <div className={!isPro ? 'relative z-10' : ''}>
                  <h3 className={`font-heading text-lg font-semibold mb-2 ${isPro ? 'text-foreground' : 'text-foreground/60'}`}>
                    {protocol.name}
                  </h3>
                  <p className={`font-mono text-xs mb-3 ${isPro ? 'text-foreground/50' : 'text-foreground/40'}`}>
                    {protocol.description}
                  </p>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-mono text-foreground/40">{protocol.duration_minutes} min</span>
                    <span className="text-foreground/20">•</span>
                    <span className="font-mono text-primary/60">{protocol.target_symptom}</span>
                  </div>

                  {isPro ? (
                    <Link to={`/session/${protocol.routines[0]?.id}`} className="block mt-4" onClick={(e) => e.stopPropagation()}>
                      <Button variant="outline" size="sm" className="w-full border-primary/30 text-primary hover:bg-primary/10">
                        <Play className="h-3 w-3 mr-2" />
                        LANCER
                      </Button>
                    </Link>
                  ) : (
                    <div className="mt-4 flex items-center gap-2">
                      <Lock className="h-3 w-3 text-primary/60" />
                      <span className="font-mono text-[10px] text-primary/60">{protocol.locked_label}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Pilot Programs Section */}
        <section className="mt-10 animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <div className="flex items-center gap-3 mb-6">
            <span className="font-mono text-xs text-foreground/40">PROGRAMMES_PILOTES //</span>
            <div className="flex-1 h-px bg-white/10" />
            {!isPro && (
              <span className="px-2 py-1 bg-primary/10 border border-primary/20 rounded font-mono text-[10px] text-primary">
                PRO REQUIS
              </span>
            )}
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {PILOT_PROGRAMS.map((program: PilotProgram) => (
              <div 
                key={program.id}
                onClick={() => !isPro && setShowUpgradeModal(true)}
                className={`relative bg-black/60 rounded-xl border p-6 transition-all duration-300 ${
                  isPro 
                    ? 'border-white/10 hover:border-primary/30 cursor-pointer' 
                    : 'border-white/5 opacity-70 cursor-pointer hover:opacity-80'
                }`}
              >
                {/* Lock Badge & Blur Overlay */}
                {!isPro && (
                  <>
                    <div className="absolute inset-0 bg-black/20 backdrop-blur-[1px] rounded-xl" />
                    <div className="absolute top-4 right-4 z-10">
                      <div className="w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center">
                        <Lock className="h-4 w-4 text-foreground/50" />
                      </div>
                    </div>
                  </>
                )}

                <div className={!isPro ? 'relative z-10' : ''}>
                  <h3 className={`font-heading text-lg font-semibold mb-2 ${isPro ? 'text-foreground' : 'text-foreground/60'}`}>
                    {program.name}
                  </h3>
                  <p className={`font-mono text-xs mb-3 ${isPro ? 'text-foreground/50' : 'text-foreground/40'}`}>
                    {program.description}
                  </p>
                  <div className="flex items-center gap-2 text-xs">
                    {program.duration_weeks > 0 && (
                      <>
                        <span className="font-mono text-foreground/40">{program.duration_weeks} semaines</span>
                        <span className="text-foreground/20">•</span>
                      </>
                    )}
                    <span className="font-mono text-primary/60">{program.focus}</span>
                  </div>

                  {isPro ? (
                    <div className="mt-4">
                      <Button variant="outline" size="sm" className="w-full border-primary/30 text-primary hover:bg-primary/10">
                        <Play className="h-3 w-3 mr-2" />
                        VOIR LE PROGRAMME
                      </Button>
                    </div>
                  ) : (
                    <div className="mt-4 flex items-center gap-2">
                      <Lock className="h-3 w-3 text-primary/60" />
                      <span className="font-mono text-[10px] text-primary/60">{program.locked_label}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

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

      {/* Upgrade Modal */}
      <UpgradeModal isOpen={showUpgradeModal} onClose={() => setShowUpgradeModal(false)} />
    </div>
  );
}
