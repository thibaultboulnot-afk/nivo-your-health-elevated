import { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useUserStats } from '@/hooks/useUserStats';
import { useAccess } from '@/hooks/useAccess';
import { useGamification } from '@/hooks/useGamification';
import { useRankSystem } from '@/hooks/useRankSystem';
import { UpgradeModal } from '@/components/UpgradeModal';
import { VaultModal } from '@/components/VaultModal';
import { SpineHologram } from '@/components/SpineHologram';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/integrations/supabase/client';
import {
  Settings,
  Flame,
  Sparkles,
  Crown,
  Play,
  User,
  ChevronUp,
  Crosshair,
  Shield,
  Zap,
  Lock,
  Terminal,
  Activity,
  Cpu,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Terminal log messages
const TERMINAL_LOGS = [
  '> SYSTÈME EN LIGNE...',
  '> Connexion sécurisée établie',
  '> Chargement des modules vertébraux...',
  '> Calibration des capteurs...',
  '> Analyse structurelle en cours...',
  '> Protocoles de maintenance activés',
  '> Scan biométrique OK',
  '> Interface opérateur prête',
];

export default function Dashboard() {
  const { signOut, user } = useAuth();
  const navigate = useNavigate();
  const { stats, isLoading } = useUserStats();
  const { isPro } = useAccess();
  const { 
    xp, 
    level, 
    currentStreak: streak, 
    streakFreezes,
    subscriptionStartDate,
    xpProgress,
    xpForNextLevel,
  } = useGamification();
  
  const { currentRank, nextRank, monthsToNextRank } = useRankSystem(subscriptionStartDate);
  
  const [isMobile, setIsMobile] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showVaultModal, setShowVaultModal] = useState(false);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);
  const [currentLogIndex, setCurrentLogIndex] = useState(0);

  // Calculate structural integrity from NIVO score
  const structuralIntegrity = stats?.nivoScore ?? 100;

  // Terminal log animation
  useEffect(() => {
    if (currentLogIndex >= TERMINAL_LOGS.length) return;
    
    const timer = setTimeout(() => {
      setTerminalLogs(prev => [...prev, TERMINAL_LOGS[currentLogIndex]]);
      setCurrentLogIndex(prev => prev + 1);
    }, 800 + Math.random() * 400);

    return () => clearTimeout(timer);
  }, [currentLogIndex]);

  // Add integrity log after initial logs
  useEffect(() => {
    if (currentLogIndex === TERMINAL_LOGS.length && stats?.nivoScore !== undefined) {
      const timer = setTimeout(() => {
        setTerminalLogs(prev => [...prev, `> INTÉGRITÉ STRUCTURELLE: ${stats.nivoScore}%`]);
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [currentLogIndex, stats?.nivoScore]);

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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#050510] relative overflow-hidden flex items-center justify-center">
        <div className="aurora absolute inset-0 pointer-events-none opacity-30" />
        <div className="grid-background absolute inset-0 pointer-events-none opacity-10" />
        <div className="relative z-10 flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center animate-pulse">
            <Cpu className="w-8 h-8 text-primary" />
          </div>
          <p className="font-mono text-xs text-foreground/50">INITIALISATION DU SYSTÈME...</p>
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

      {/* XP Progress Bar (Top) */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-black/50 z-50">
        <motion.div 
          className="h-full bg-gradient-to-r from-emerald-500 to-cyan-400"
          initial={{ width: 0 }}
          animate={{ width: `${xpProgress * 100}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>

      {/* Header HUD */}
      <header className="relative z-20 border-b border-white/5 nivo-glass-static">
        <div className="container mx-auto px-4 md:px-6 py-3 md:py-4">
          <div className="flex items-center justify-between">
            {/* Left - Rank Badge & Level */}
            <div className="flex items-center gap-3">
              {/* Rank Badge */}
              <div className={`px-3 py-1.5 rounded-lg border font-mono text-xs uppercase tracking-wider ${currentRank.badgeClass}`}>
                {currentRank.name}
              </div>
              
              {/* Level */}
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span className="font-mono text-sm font-bold text-foreground">NIV. {level}</span>
              </div>

              {/* XP Info (Desktop) */}
              <div className="hidden md:block font-mono text-[10px] text-foreground/40">
                {xp} / {xpForNextLevel} XP
              </div>

              {isPro && (
                <span className="px-2 py-0.5 bg-primary/20 border border-primary/30 rounded-full font-mono text-[10px] text-primary flex items-center gap-1">
                  <Crown className="w-3 h-3" />
                  PRO
                </span>
              )}
            </div>

            {/* Right - Streak, Vault & Settings */}
            <div className="flex items-center gap-2 md:gap-3">
              {/* Streak Counter */}
              <div className="nivo-glass-static rounded-lg px-3 py-1.5 flex items-center gap-2">
                <div className="relative">
                  <Flame className="h-4 w-4 text-orange-400" />
                  <motion.div
                    className="absolute inset-0 bg-orange-400 blur-md opacity-50"
                    animate={{ 
                      scale: [1, 1.3, 1],
                      opacity: [0.3, 0.6, 0.3],
                    }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                </div>
                <span className="font-mono text-sm font-bold text-foreground">{streak}</span>
                <span className="font-mono text-[10px] text-foreground/40 hidden sm:inline">JOURS</span>
                {streakFreezes > 0 && (
                  <span className="ml-1 px-1 py-0.5 bg-blue-500/20 rounded text-[8px] font-mono text-blue-400">
                    🛡️{streakFreezes}
                  </span>
                )}
              </div>

              {/* Vault Button */}
              <button
                onClick={() => setShowVaultModal(true)}
                className="p-2 rounded-lg nivo-glass hover:border-emerald-500/30 transition-all"
              >
                <Sparkles className="h-4 w-4 md:h-5 md:w-5 text-emerald-400" />
              </button>

              <Link 
                to="/settings"
                className="p-2 rounded-lg nivo-glass transition-all"
              >
                <Settings className="h-4 w-4 md:h-5 md:w-5 text-foreground/60" />
              </Link>

              {/* Rank Icon instead of Avatar */}
              <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center border ${currentRank.badgeClass}`}>
                {currentRank.id === 'titan' ? (
                  <Crown className="h-4 w-4 md:h-5 md:w-5" />
                ) : currentRank.id === 'architect' ? (
                  <Cpu className="h-4 w-4 md:h-5 md:w-5" />
                ) : currentRank.id === 'operator' ? (
                  <Shield className="h-4 w-4 md:h-5 md:w-5" />
                ) : (
                  <User className="h-4 w-4 md:h-5 md:w-5" />
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main HUD Content */}
      <main className="relative z-10 container mx-auto px-4 md:px-6 py-6 md:py-10">
        {/* Central Hologram Section */}
        <section className="mb-8 animate-fade-in">
          <div className="nivo-glass-intense rounded-2xl md:rounded-3xl p-6 md:p-10 relative overflow-hidden">
            {/* Background glow */}
            <div className="absolute inset-0 pointer-events-none">
              <div 
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full blur-3xl opacity-20"
                style={{
                  backgroundColor: structuralIntegrity >= 80 
                    ? 'rgba(16, 185, 129, 0.4)' 
                    : structuralIntegrity >= 50 
                      ? 'rgba(245, 158, 11, 0.4)' 
                      : 'rgba(239, 68, 68, 0.4)',
                }}
              />
            </div>

            <div className="relative z-10 grid md:grid-cols-[1fr_auto_1fr] gap-6 md:gap-10 items-center">
              {/* Left Panel - System Info */}
              <div className="order-2 md:order-1 space-y-4">
                {/* Rank Progress */}
                <div className="nivo-glass rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Shield className="h-4 w-4 text-foreground/40" />
                    <span className="font-mono text-[10px] text-foreground/40 uppercase">Rang Actuel</span>
                  </div>
                  <p className={`font-mono text-lg font-bold ${currentRank.colorClass}`}>
                    {currentRank.name.toUpperCase()}
                  </p>
                  {nextRank && (
                    <p className="font-mono text-[10px] text-foreground/40 mt-1">
                      → {nextRank.name} dans {monthsToNextRank} mois
                    </p>
                  )}
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="nivo-glass rounded-lg p-3">
                    <span className="font-mono text-[8px] text-foreground/40 block mb-1">SESSIONS</span>
                    <span className="font-mono text-xl font-bold text-foreground">{stats?.totalSessions || 0}</span>
                  </div>
                  <div className="nivo-glass rounded-lg p-3">
                    <span className="font-mono text-[8px] text-foreground/40 block mb-1">SÉQUENCE</span>
                    <span className="font-mono text-xl font-bold text-orange-400">{streak}J</span>
                  </div>
                </div>

                {/* Upgrade CTA (Free users) */}
                {!isPro && (
                  <button 
                    onClick={() => setShowUpgradeModal(true)}
                    className="w-full nivo-glass rounded-xl p-4 text-left hover:border-primary/30 transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/15 border border-primary/25 flex items-center justify-center group-hover:bg-primary/20 transition-all">
                        <Crown className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-mono text-xs text-primary">UPGRADE</p>
                        <p className="font-mono text-sm font-bold text-foreground">Débloquer PRO</p>
                      </div>
                    </div>
                  </button>
                )}
              </div>

              {/* Center - Spine Hologram */}
              <div className="order-1 md:order-2 flex flex-col items-center">
                <div className="w-48 h-72 md:w-56 md:h-80">
                  <SpineHologram integrity={structuralIntegrity} className="w-full h-full" />
                </div>
                
                {/* Integrity Score */}
                <div className="mt-4 text-center">
                  <p className="font-mono text-[10px] text-foreground/40 uppercase tracking-widest mb-1">
                    Intégrité Structurelle
                  </p>
                  <p className={`font-mono text-4xl md:text-5xl font-bold ${
                    structuralIntegrity >= 80 ? 'text-emerald-400' :
                    structuralIntegrity >= 50 ? 'text-amber-400' : 'text-red-400'
                  }`}>
                    {structuralIntegrity}%
                  </p>
                </div>
              </div>

              {/* Right Panel - Terminal */}
              <div className="order-3 space-y-4">
                {/* Terminal Log */}
                <div className="nivo-glass rounded-xl p-4 h-64 overflow-hidden">
                  <div className="flex items-center gap-2 mb-3">
                    <Terminal className="h-4 w-4 text-emerald-400" />
                    <span className="font-mono text-[10px] text-emerald-400">CONSOLE_SYSTÈME</span>
                    <motion.div 
                      className="w-2 h-2 rounded-full bg-emerald-400"
                      animate={{ opacity: [1, 0.3, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    />
                  </div>
                  
                  <div className="space-y-1 font-mono text-[11px] text-emerald-400/70 overflow-y-auto h-48">
                    <AnimatePresence>
                      {terminalLogs.map((log, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          {log}
                        </motion.div>
                      ))}
                    </AnimatePresence>
                    
                    {/* Blinking cursor */}
                    <motion.span
                      animate={{ opacity: [1, 0, 1] }}
                      transition={{ duration: 0.8, repeat: Infinity }}
                      className="inline-block"
                    >
                      █
                    </motion.span>
                  </div>
                </div>

                {/* Status Indicators */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="nivo-glass rounded-lg p-3">
                    <span className="font-mono text-[8px] text-foreground/40 block mb-1">NIVEAU</span>
                    <span className="font-mono text-xl font-bold text-emerald-400">{level}</span>
                  </div>
                  <div className="nivo-glass rounded-lg p-3">
                    <span className="font-mono text-[8px] text-foreground/40 block mb-1">XP</span>
                    <span className="font-mono text-lg font-bold text-cyan-400">{xp}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Action Button */}
            <div className="relative z-10 mt-8 flex justify-center">
              <Link to="/diagnostic" className="w-full max-w-md">
                <Button 
                  size="lg"
                  className="w-full h-16 md:h-20 bg-gradient-to-r from-primary via-primary to-orange-500 hover:from-primary/90 hover:to-orange-500/90 text-primary-foreground font-bold text-lg md:text-xl shadow-[0_0_40px_rgba(255,107,74,0.5)] hover:shadow-[0_0_60px_rgba(255,107,74,0.7)] transition-all duration-300 rounded-xl border border-primary/50"
                >
                  <Crosshair className="h-6 w-6 md:h-7 md:w-7 mr-3" />
                  LANCER CALIBRATION
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Quick Actions Grid */}
        <section className="grid md:grid-cols-3 gap-4 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          {/* Daily Routine */}
          <Link to="/session/daily_loop" className="block">
            <div className="nivo-glass rounded-xl p-6 h-full hover:border-emerald-500/30 transition-all group">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center group-hover:bg-emerald-500/20 transition-all">
                  <Activity className="h-5 w-5 text-emerald-400" />
                </div>
                <div>
                  <p className="font-mono text-[10px] text-emerald-400">ROUTINE QUOTIDIENNE</p>
                  <p className="font-mono text-sm font-bold text-foreground">Boucle Maintenance</p>
                </div>
              </div>
              <p className="font-mono text-xs text-foreground/50 mb-4">8 min :: Entretien structurel quotidien</p>
              <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs">
                <Play className="w-4 h-4" />
                LANCER
              </div>
            </div>
          </Link>

          {/* Vault */}
          <button onClick={() => setShowVaultModal(true)} className="text-left">
            <div className="nivo-glass rounded-xl p-6 h-full hover:border-purple-500/30 transition-all group">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-purple-500/15 border border-purple-500/25 flex items-center justify-center group-hover:bg-purple-500/20 transition-all">
                  <Sparkles className="h-5 w-5 text-purple-400" />
                </div>
                <div>
                  <p className="font-mono text-[10px] text-purple-400">ARMURERIE</p>
                  <p className="font-mono text-sm font-bold text-foreground">Modules Visuels</p>
                </div>
              </div>
              <p className="font-mono text-xs text-foreground/50 mb-4">30+ skins à débloquer par progression</p>
              <div className="flex items-center gap-2 text-purple-400 font-mono text-xs">
                <Sparkles className="w-4 h-4" />
                OUVRIR
              </div>
            </div>
          </button>

          {/* Pro Protocols */}
          <div 
            onClick={() => isPro ? navigate('/session/cervical_release') : setShowUpgradeModal(true)}
            className="cursor-pointer"
          >
            <div className={`nivo-glass rounded-xl p-6 h-full transition-all group ${
              isPro ? 'hover:border-primary/30' : 'opacity-80 hover:border-primary/20'
            }`}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-primary/15 border border-primary/25 flex items-center justify-center group-hover:bg-primary/20 transition-all">
                  {isPro ? <Zap className="h-5 w-5 text-primary" /> : <Lock className="h-5 w-5 text-primary/60" />}
                </div>
                <div>
                  <p className="font-mono text-[10px] text-primary">PROTOCOLES CIBLÉS</p>
                  <p className="font-mono text-sm font-bold text-foreground">Sessions PRO</p>
                </div>
              </div>
              <p className="font-mono text-xs text-foreground/50 mb-4">
                {isPro ? 'Cervicales, Lombaires, Sciatique...' : 'Accès réservé aux opérateurs PRO'}
              </p>
              <div className="flex items-center gap-2 font-mono text-xs text-primary">
                {isPro ? <Play className="w-4 h-4" /> : <Crown className="w-4 h-4" />}
                {isPro ? 'ACCÉDER' : 'UPGRADE'}
              </div>
            </div>
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

      {/* Modals */}
      <UpgradeModal isOpen={showUpgradeModal} onClose={() => setShowUpgradeModal(false)} />
      <VaultModal isOpen={showVaultModal} onClose={() => setShowVaultModal(false)} />
    </div>
  );
}
