import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useUserStats } from '@/hooks/useUserStats';
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
} from 'lucide-react';
import { Loader2 } from 'lucide-react';
import { PROGRAMS, getCurrentSession, type ProgramTier } from '@/data/programs';
import { motion } from 'framer-motion';

export default function Dashboard() {
  const { signOut, user } = useAuth();
  const navigate = useNavigate();
  const { stats, isLoading } = useUserStats();
  const [isMobile, setIsMobile] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);

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

  // Get current session data
  const currentProgram = stats ? PROGRAMS[stats.currentProgram] : PROGRAMS['SYSTEM_REBOOT'];
  const currentSession = stats ? getCurrentSession(stats.currentDay, stats.currentProgram) : null;

  // Check if current program is unlocked
  const isProgramUnlocked = stats?.unlockedPrograms.includes(stats?.currentProgram || 'SYSTEM_REBOOT') || false;

  // Upsell: Basic (Rapid Patch) -> Upgrade
  const showUpgradeSystem =
    !!stats &&
    stats.unlockedPrograms.includes('RAPID_PATCH') &&
    !stats.unlockedPrograms.includes('SYSTEM_REBOOT') &&
    !stats.unlockedPrograms.includes('ARCHITECT_MODE');

  // Determine status based on health score
  const getStatusConfig = () => {
    if (!stats?.healthScore) {
      return {
        color: 'text-foreground/50',
        bgColor: 'bg-white/5',
        borderColor: 'border-white/10',
      };
    }
    if (stats.healthScore < 50) {
      return {
        text: 'NIVEAU DE FORME CRITIQUE. ROUTINE RECOMMANDÉE.',
        color: 'text-primary',
        bgColor: 'bg-primary/10',
        borderColor: 'border-primary/30',
      };
    } else if (stats.healthScore >= 80) {
      return {
        text: 'NIVEAU DE FORME OPTIMAL. CONTINUEZ AINSI !',
        color: 'text-emerald-400',
        bgColor: 'bg-emerald-500/10',
        borderColor: 'border-emerald-500/30',
      };
    }
    return {
      text: 'NIVEAU DE FORME EN PROGRESSION.',
      color: 'text-amber-400',
      bgColor: 'bg-amber-500/10',
      borderColor: 'border-amber-500/30',
    };
  };

  const statusConfig = getStatusConfig();

  // Calculate SVG circle parameters
  const circleRadius = 90;
  const circumference = 2 * Math.PI * circleRadius;
  const displayScore = stats?.healthScore ?? 0;
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
        {/* Hero - État du Système */}
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
                    {stats?.healthScore ? `${stats.healthScore}%` : 'N/A'}
                  </span>
                  <span className="font-mono text-[10px] md:text-xs text-foreground/40 mt-1">NIVEAU DE FORME</span>
                </div>
              </div>

              {/* Status & Stats */}
              <div className="flex-1 text-center w-full">
                <div className={`inline-block px-3 md:px-4 py-2 rounded-lg ${statusConfig.bgColor} border ${statusConfig.borderColor} mb-4 md:mb-6`}>
                  <p className={`font-mono text-xs md:text-sm ${statusConfig.color}`}>{statusConfig.text}</p>
                </div>

                {/* No Score CTA */}
                {!stats?.healthScore && (
                  <div className="mb-4 md:mb-6">
                    <Link to="/diagnostic">
                      <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-sm">
                        <AlertTriangle className="h-4 w-4 mr-2" />
                        FAIRE MON BILAN
                      </Button>
                    </Link>
                  </div>
                )}

                {/* Stats Widgets */}
                <div className="grid grid-cols-2 gap-3 md:gap-4 max-w-md mx-auto">
                  {/* Uptime */}
                  <div className="bg-white/5 border border-white/10 rounded-lg md:rounded-xl p-3 md:p-4 hover:border-primary/30 transition-colors">
                    <div className="flex items-center gap-1 md:gap-2 mb-1 md:mb-2">
                      <Clock className="h-3 w-3 md:h-4 md:w-4 text-foreground/40" />
                      <span className="font-mono text-[8px] md:text-[10px] text-foreground/40">SÉRIE</span>
                    </div>
                    <p className="font-mono text-xl md:text-2xl font-bold text-foreground">{stats?.streak || 0} <span className="text-xs md:text-sm text-foreground/40">J</span></p>
                  </div>
                  {/* Total Patches */}
                  <div className="bg-white/5 border border-white/10 rounded-lg md:rounded-xl p-3 md:p-4 hover:border-primary/30 transition-colors">
                    <div className="flex items-center gap-1 md:gap-2 mb-1 md:mb-2">
                      <Activity className="h-3 w-3 md:h-4 md:w-4 text-foreground/40" />
                      <span className="font-mono text-[8px] md:text-[10px] text-foreground/40">ROUTINES</span>
                    </div>
                    <p className="font-mono text-xl md:text-2xl font-bold text-foreground">{stats?.totalPatches || 0}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          {/* Left Column - Next Action */}
          <section className="lg:col-span-2 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <div className="bg-black/60 rounded-2xl border border-primary/20 p-8 relative overflow-hidden group hover:border-primary/40 transition-all duration-500">
              {/* Glow effect */}
              <div className="absolute inset-0 pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity">
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/10 rounded-full blur-3xl" />
              </div>

              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-4">
                  <Headphones className="h-5 w-5 text-primary" />
                  <span className="font-mono text-xs text-primary">ROUTINE DU JOUR</span>
                </div>

                <h2 className="font-heading text-3xl font-bold text-foreground mb-2">
                  {currentSession?.title || 'Session du jour'}
                </h2>
                <p className="font-mono text-sm text-foreground/50 mb-6">
                  J-{stats?.currentDay || 1} :: {currentProgram.name} // {currentSession?.duration}
                </p>

                {/* Objective */}
                <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-6">
                  <p className="font-mono text-xs text-foreground/40 mb-1">OBJECTIF</p>
                  <p className="text-foreground/80">{currentSession?.clinicalGoal}</p>
                </div>

                {/* Launch Button - Show based on unlock status */}
                {isProgramUnlocked ? (
                  <Link to={`/session/${(stats?.currentProgram || 'system-reboot').toLowerCase().replace('_', '-')}`} className="block">
                    <Button className="w-full h-14 bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-lg shadow-[0_0_30px_rgba(255,107,74,0.4)] hover:shadow-[0_0_50px_rgba(255,107,74,0.6)] transition-all duration-300">
                      <Play className="h-6 w-6 mr-2" />
                      LANCER LA SESSION
                    </Button>
                  </Link>
                ) : (
                  <Link to="/checkout" className="block">
                    <Button className="w-full h-14 bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-lg shadow-[0_0_30px_rgba(255,107,74,0.4)] hover:shadow-[0_0_50px_rgba(255,107,74,0.6)] transition-all duration-300">
                      <Lock className="h-6 w-6 mr-2" />
                      ACCÉDER AU SAVOIR (49€)
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </section>

          {/* Right Column - System Stats */}
          <section className="space-y-4 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            {/* Upgrade System (Rapid Patch owners) */}
            {showUpgradeSystem && (
              <div className="bg-black/60 rounded-xl border border-primary/30 p-6 relative overflow-hidden hover:border-primary/50 transition-colors">
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute -top-16 -right-16 w-40 h-40 bg-primary/10 rounded-full blur-3xl" />
                </div>

                <div className="relative z-10">
                  <div className="flex items-center justify-between gap-4 mb-3">
                    <div>
                      <p className="font-mono text-[10px] text-primary uppercase tracking-widest">NIVEAU SUPÉRIEUR</p>
                      <p className="font-heading text-lg font-semibold text-foreground mt-1">
                        Accédez au Reset Fondamental complet (-20%)
                      </p>
                    </div>
                    <div className="shrink-0 w-10 h-10 rounded-lg bg-primary/15 border border-primary/25 flex items-center justify-center">
                      <Zap className="h-5 w-5 text-primary" />
                    </div>
                  </div>

                  <Link to="/checkout?plan=SYSTEM_REBOOT" className="block">
                    <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold">
                      <ArrowRight className="h-4 w-4 mr-2" />
                      ACCÉDER AU RESET FONDAMENTAL
                    </Button>
                  </Link>
                </div>
              </div>
            )}

            {/* Battery Status */}
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

            {/* Current Program */}
            <div className="bg-black/60 rounded-xl border border-white/10 p-6 hover:border-primary/30 transition-colors">
              <div className="flex items-center gap-2 mb-3">
                <Shield className="h-4 w-4 text-foreground/40" />
                <span className="font-mono text-[10px] text-foreground/40">PROGRAMME ACTIF</span>
              </div>
              <p className="font-mono text-lg font-semibold text-foreground">{currentProgram.name.replace('NIVO ', '')}</p>
              <p className="font-mono text-xs text-foreground/40">Jour {stats?.currentDay || 1} / {currentProgram.totalDays}</p>
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
                  <span className="font-mono text-sm text-foreground">{stats?.totalPatches || 0}</span>
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

        {/* Available Modules Section */}
        <section className="mt-10 animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <div className="flex items-center gap-3 mb-6">
            <span className="font-mono text-xs text-foreground/40">AVAILABLE_MODULES //</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {Object.values(PROGRAMS).map((program) => {
              const isActive = stats?.currentProgram === program.id;
              const isUnlocked = stats?.unlockedPrograms.includes(program.id) || false;
              
              return (
                <div 
                  key={program.id}
                  className={`relative bg-black/60 rounded-xl border p-6 transition-all duration-300 ${
                    isActive 
                      ? 'border-primary/50 shadow-[0_0_30px_rgba(255,107,74,0.15)]' 
                      : isUnlocked 
                        ? 'border-white/10 hover:border-white/20' 
                        : 'border-white/5 opacity-60'
                  }`}
                >
                  {/* Status Badge */}
                  <div className="absolute top-4 right-4">
                    {isActive ? (
                      <span className="px-2 py-1 bg-primary/20 border border-primary/30 rounded-full font-mono text-[10px] text-primary">
                        ACTIVE
                      </span>
                    ) : !isUnlocked ? (
                      <Lock className="h-4 w-4 text-foreground/30" />
                    ) : null}
                  </div>

                  <h3 className={`font-heading text-lg font-semibold mb-2 ${isUnlocked ? 'text-foreground' : 'text-foreground/50'}`}>
                    {program.name.replace('NIVO ', '')}
                  </h3>
                  <p className={`font-mono text-xs mb-4 ${isUnlocked ? 'text-foreground/50' : 'text-foreground/30'}`}>
                    {program.description}
                  </p>

                  {/* Progress or Lock indicator */}
                  {isUnlocked ? (
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary rounded-full"
                          style={{ 
                            width: isActive 
                              ? `${((stats?.currentDay || 1) / program.totalDays) * 100}%` 
                              : '0%' 
                          }}
                        />
                      </div>
                      <span className="font-mono text-[10px] text-foreground/40">
                        {isActive ? `J${stats?.currentDay || 1}/${program.totalDays}` : `${program.totalDays}j`}
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Lock className="h-3 w-3 text-foreground/30" />
                      <span className="font-mono text-[10px] text-foreground/30">VERROUILLÉ</span>
                    </div>
                  )}
                </div>
              );
            })}
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
    </div>
  );
}
