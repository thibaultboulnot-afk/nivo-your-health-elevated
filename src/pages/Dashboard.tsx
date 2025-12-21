import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { 
  LogOut, 
  Play, 
  Home,
  Target, 
  Activity,
  Zap,
  FlaskConical,
  ChevronDown,
  ChevronUp,
  Volume2,
  CheckCircle2,
  Settings,
  BarChart3,
  User,
  Radio,
  History,
  Droplets,
  Brain,
  HeartPulse
} from 'lucide-react';
import { Loader2 } from 'lucide-react';
import { PROGRAMS, getPhaseLabel, getCurrentSession, type ProgramTier } from '@/data/programs';
import { NIVO_THEMES, type ThemeId } from '@/lib/themes';

const ZONE_LABELS: Record<string, string> = {
  lombaires: 'Lombaires',
  cervicales: 'Cervicales',
  epaules: 'Épaules',
  poignets: 'Poignets',
  hanches: 'Hanches',
  general: 'Général',
};

const ZONE_ICONS: Record<string, string> = {
  lombaires: '🦴',
  cervicales: '🦒',
  epaules: '💪',
  poignets: '🖐️',
  hanches: '🦵',
  general: '🧘',
};

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [currentProgramId, setCurrentProgramId] = useState<ProgramTier>('SYSTEM_REBOOT');
  const [showRationale, setShowRationale] = useState(false);
  const [activeNav, setActiveNav] = useState('home');

  // Get current theme based on program
  const theme = NIVO_THEMES[currentProgramId as ThemeId];

  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();
      
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  // Terminal-style loading
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#050510] flex items-center justify-center">
        <div className="text-center">
          <div className="font-mono text-[#ff6b4a] animate-pulse mb-4">
            <div className="text-sm mb-2">&gt; CHARGEMENT_SYSTÈME...</div>
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-[#ff6b4a]" />
          </div>
          <div className="font-mono text-xs text-white/30">
            Initialisation du cockpit...
          </div>
        </div>
      </div>
    );
  }

  const currentDay = profile?.current_day || 1;
  const painZone = profile?.pain_zone || 'general';
  const currentProgram = PROGRAMS[currentProgramId];
  const totalDays = currentProgram.totalDays;
  const progress = Math.min((currentDay / totalDays) * 100, 100);
  const currentSession = getCurrentSession(currentDay, currentProgramId);
  const phaseLabel = getPhaseLabel(currentDay, currentProgramId);
  const isProgramComplete = currentDay > totalDays;

  const navItems = [
    { id: 'home', icon: Home, label: 'Cockpit', path: '/dashboard' },
    { id: 'program', icon: Target, label: 'Mon Programme', path: '/dashboard' },
    { id: 'history', icon: History, label: 'Historique', path: '/dashboard' },
    { id: 'settings', icon: Settings, label: 'Réglages', path: '/settings' },
  ];

  const handleNavClick = (item: typeof navItems[0]) => {
    if (item.path !== '/dashboard') {
      navigate(item.path);
    } else {
      setActiveNav(item.id);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  // Fake telemetry data
  const telemetryData = {
    stress: 35,
    mobility: 68,
    hydration: 72,
  };

  return (
    <div className="min-h-screen bg-[#050510] flex relative">
      {/* Background Effects */}
      <div className="aurora absolute inset-0 pointer-events-none opacity-30" />
      <div className="grid-background absolute inset-0 pointer-events-none opacity-10" />

      {/* Sidebar - Télémétrie & Navigation */}
      <aside className="w-72 bg-[#050510]/80 backdrop-blur-sm border-r border-white/5 flex flex-col relative z-20">
        {/* Logo */}
        <div className="p-6 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#ff6b4a] flex items-center justify-center shadow-[0_0_20px_rgba(255,107,74,0.4)]">
              <span className="font-bold text-black text-lg">N</span>
            </div>
            <div>
              <span className="font-bold text-white text-lg">NIVO</span>
              <p className="font-mono text-[10px] text-white/30">OS v2.0.4</p>
            </div>
          </div>
        </div>

        {/* Télémétrie Section */}
        <div className="p-6 border-b border-white/5">
          <p className="font-mono text-[10px] text-white/40 uppercase tracking-wider mb-4">
            Biométrie Pilote
          </p>
          
          {/* Avatar & Name */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-[#ff6b4a]/20 border border-[#ff6b4a]/30 flex items-center justify-center">
              <User className="h-6 w-6 text-[#ff6b4a]" />
            </div>
            <div>
              <p className="font-semibold text-white text-sm">
                {profile?.first_name || 'Utilisateur'} {profile?.last_name || ''}
              </p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-mono text-[10px] text-emerald-500">SYSTÈME ACTIF</span>
              </div>
            </div>
          </div>

          {/* Gauges */}
          <div className="space-y-3">
            {/* Stress */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <Brain className="h-3 w-3 text-white/30" />
                  <span className="font-mono text-[10px] text-white/40">Niveau de Stress</span>
                </div>
                <span className="font-mono text-[10px] text-[#ff6b4a]">{telemetryData.stress}%</span>
              </div>
              <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-emerald-500 to-[#ff6b4a] rounded-full transition-all"
                  style={{ width: `${telemetryData.stress}%` }}
                />
              </div>
            </div>

            {/* Mobility */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <HeartPulse className="h-3 w-3 text-white/30" />
                  <span className="font-mono text-[10px] text-white/40">Mobilité</span>
                </div>
                <span className="font-mono text-[10px] text-emerald-400">{telemetryData.mobility}%</span>
              </div>
              <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-emerald-500 rounded-full transition-all"
                  style={{ width: `${telemetryData.mobility}%` }}
                />
              </div>
            </div>

            {/* Hydration */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <Droplets className="h-3 w-3 text-white/30" />
                  <span className="font-mono text-[10px] text-white/40">Hydratation</span>
                </div>
                <span className="font-mono text-[10px] text-cyan-400">{telemetryData.hydration}%</span>
              </div>
              <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-cyan-500 rounded-full transition-all"
                  style={{ width: `${telemetryData.hydration}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <p className="font-mono text-[10px] text-white/40 uppercase tracking-wider mb-3 px-2">
            Navigation
          </p>
          <div className="space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item)}
                className={`relative w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-300 group ${
                  activeNav === item.id 
                    ? 'text-[#ff6b4a] bg-[#ff6b4a]/10' 
                    : 'text-white/40 hover:text-white/70 hover:bg-white/5'
                }`}
              >
                {activeNav === item.id && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-[#ff6b4a] rounded-r shadow-[0_0_10px_rgba(255,107,74,0.8)]" />
                )}
                <item.icon className="h-4 w-4" />
                <span className="font-mono text-xs">{item.label}</span>
              </button>
            ))}
          </div>
        </nav>

        {/* Bottom Section */}
        <div className="p-4 border-t border-white/5">
          <button 
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-white/30 hover:text-red-400 hover:bg-red-500/10 transition-all group"
          >
            <LogOut className="h-4 w-4" />
            <span className="font-mono text-xs">Arrêter le Système</span>
          </button>
          
          <div className="flex items-center justify-center gap-2 mt-4 pt-4 border-t border-white/5">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.8)]" />
            <span className="font-mono text-[10px] text-emerald-500/80 tracking-wider">SYSTÈME EN LIGNE</span>
          </div>
        </div>
      </aside>

      {/* Main Content - Cockpit */}
      <main className="flex-1 overflow-auto relative z-10">
        <div className="container mx-auto px-8 py-8">
          {/* Header */}
          <header className="mb-10 animate-fade-in">
            <p className="font-mono text-sm text-white/40 mb-1">
              &gt; system.greet()
            </p>
            <h1 className="font-heading text-3xl font-bold text-white mb-2">
              Bonjour, <span className="text-[#ff6b4a]">{profile?.first_name || 'Utilisateur'}</span>.
            </h1>
            <p className="font-mono text-xs text-white/50">
              &gt; PROTOCOLE_ACTIF :: <span className="text-[#ff6b4a]">{currentProgramId}</span> // {phaseLabel}
            </p>
          </header>

          {/* Program Tabs */}
          <div className="mb-8 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <div className="flex gap-2 p-1 bg-white/5 rounded-lg border border-white/5 inline-flex">
              {Object.values(PROGRAMS).map((program) => {
                const isActive = currentProgramId === program.id;
                return (
                  <button
                    key={program.id}
                    onClick={() => setCurrentProgramId(program.id)}
                    className={`px-4 py-2 rounded-md font-mono text-xs transition-all duration-300 ${
                      isActive
                        ? 'bg-[#ff6b4a] text-black font-semibold shadow-[0_0_15px_rgba(255,107,74,0.4)]'
                        : 'text-white/40 hover:text-white/70 hover:bg-white/5'
                    }`}
                  >
                    {program.name.replace('NIVO ', '')}
                  </button>
                );
              })}
            </div>
          </div>

          {isProgramComplete ? (
            /* Program Complete State */
            <div className="bg-black/50 rounded-2xl border border-white/10 p-10 text-center animate-fade-in shadow-[inset_0_0_30px_rgba(0,0,0,0.5)]">
              <CheckCircle2 className="h-16 w-16 text-[#ff6b4a] mx-auto mb-4" />
              <h2 className="font-heading text-2xl font-bold mb-2 text-white">Système Recalibré</h2>
              <p className="text-white/60 mb-6 font-mono text-sm">
                Programme {currentProgram.name} :: TERMINÉ
              </p>
              <Button className="bg-[#ff6b4a] text-black font-semibold hover:bg-[#ff8a6a] shadow-[0_0_20px_rgba(255,107,74,0.4)]">
                INITIALISER ARCHITECT_MODE
              </Button>
            </div>
          ) : currentSession ? (
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Central Monitor - Session du Jour */}
              <div className="lg:col-span-2 space-y-6">
                <div 
                  className="bg-black/60 rounded-2xl border border-white/10 p-8 animate-fade-in relative overflow-hidden group hover:border-[#ff6b4a]/30 transition-colors duration-500"
                  style={{ 
                    animationDelay: '0.2s',
                    boxShadow: 'inset 0 0 40px rgba(0,0,0,0.8), 0 0 30px rgba(255,107,74,0.05)'
                  }}
                >
                  {/* Audio Wave Animation */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
                    <div className="flex gap-1 items-end h-32">
                      {[...Array(20)].map((_, i) => (
                        <div
                          key={i}
                          className="w-1 bg-[#ff6b4a] rounded-full"
                          style={{
                            height: `${20 + Math.sin(i * 0.5) * 50 + Math.random() * 30}%`,
                            animation: `pulse ${1 + Math.random()}s ease-in-out infinite`,
                            animationDelay: `${i * 0.1}s`,
                          }}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-3 h-3 rounded-full bg-[#ff6b4a] animate-pulse shadow-[0_0_10px_rgba(255,107,74,0.8)]" />
                      <span className="font-mono text-xs text-[#ff6b4a]">{currentSession.subtitle}</span>
                      <span className="font-mono text-xs text-white/30">• {currentSession.duration}</span>
                    </div>

                    <h2 className="font-heading text-4xl font-bold text-white mb-3">
                      {currentSession.title}
                    </h2>

                    <p className="text-white/50 text-sm mb-6 font-mono">
                      OBJECTIF :: {currentSession.clinicalGoal}
                    </p>

                    {/* Audio Cue */}
                    <div className="bg-white/5 rounded-xl border border-white/10 p-4 mb-6">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-[#ff6b4a]/10 flex items-center justify-center flex-shrink-0">
                          <Volume2 className="h-4 w-4 text-[#ff6b4a]" />
                        </div>
                        <div>
                          <p className="font-mono text-xs text-[#ff6b4a] mb-1">CONSIGNE_AUDIO</p>
                          <p className="text-white/80 italic">"{currentSession.audioCue}"</p>
                        </div>
                      </div>
                    </div>

                    {/* Scientific Rationale */}
                    <button
                      onClick={() => setShowRationale(!showRationale)}
                      className="flex items-center gap-2 text-white/30 hover:text-white/60 transition-colors w-full mb-4"
                    >
                      <FlaskConical className="h-4 w-4" />
                      <span className="font-mono text-xs">JUSTIFICATION_SCIENTIFIQUE</span>
                      {showRationale ? <ChevronUp className="h-4 w-4 ml-auto" /> : <ChevronDown className="h-4 w-4 ml-auto" />}
                    </button>
                    {showRationale && (
                      <div className="bg-white/5 rounded-lg border border-white/10 p-4 mb-6 animate-fade-in">
                        <p className="text-sm text-white/60">{currentSession.scientificRationale}</p>
                      </div>
                    )}

                    {/* Launch Button */}
                    <Link to={`/session/${currentProgramId.toLowerCase().replace('_', '-')}`} className="block w-full">
                      <Button className="w-full h-14 bg-[#ff6b4a] hover:bg-[#ff8a6a] text-black font-bold text-lg shadow-[0_0_30px_rgba(255,107,74,0.4)] hover:shadow-[0_0_50px_rgba(255,107,74,0.6)] transition-all duration-300">
                        <Play className="h-6 w-6 mr-2" />
                        LANCER LA SÉQUENCE
                      </Button>
                    </Link>
                  </div>
                </div>

                {/* Steps */}
                <div className="bg-black/40 rounded-xl border border-white/10 p-6 animate-fade-in" style={{ animationDelay: '0.3s' }}>
                  <p className="font-mono text-xs text-white/40 mb-4">ÉTAPES_SESSION</p>
                  <div className="flex flex-wrap gap-2">
                    {currentSession.steps.map((step, index) => (
                      <span 
                        key={index}
                        className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg font-mono text-xs text-white/70 hover:border-[#ff6b4a]/30 transition-colors"
                      >
                        [{index + 1}] {step}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Telemetry Grid - HUD Modules */}
              <div className="space-y-4">
                {/* Module 1 - Streak */}
                <div className="bg-black/50 rounded-xl border border-white/10 p-6 animate-fade-in hover:border-[#ff6b4a]/30 transition-colors group" style={{ animationDelay: '0.2s' }}>
                  <div className="flex items-center gap-2 mb-3">
                    <Radio className="h-4 w-4 text-white/30 group-hover:text-[#ff6b4a] transition-colors" />
                    <span className="font-mono text-xs text-white/40">SÉRIE_ACTIVE</span>
                  </div>
                  <div className="text-center">
                    <span className="font-mono text-6xl font-bold text-white">J-{currentDay}</span>
                    <p className="font-mono text-xs text-white/30 mt-2">sur {totalDays} jours</p>
                  </div>
                </div>

                {/* Module 2 - Progress */}
                <div className="bg-black/50 rounded-xl border border-white/10 p-6 animate-fade-in hover:border-[#ff6b4a]/30 transition-colors group" style={{ animationDelay: '0.3s' }}>
                  <div className="flex items-center gap-2 mb-3">
                    <Activity className="h-4 w-4 text-white/30 group-hover:text-[#ff6b4a] transition-colors" />
                    <span className="font-mono text-xs text-white/40">PROGRESSION</span>
                    <span className="font-mono text-xs text-[#ff6b4a] ml-auto">{Math.round(progress)}%</span>
                  </div>
                  {/* Segmented Progress Bar */}
                  <div className="flex gap-1">
                    {[...Array(totalDays > 21 ? 10 : totalDays)].map((_, i) => {
                      const segmentProgress = (totalDays > 21 ? totalDays / 10 : 1);
                      const isFilled = i < (currentDay / segmentProgress);
                      return (
                        <div
                          key={i}
                          className={`h-3 flex-1 rounded-sm transition-all duration-300 ${
                            isFilled 
                              ? 'bg-[#ff6b4a] shadow-[0_0_8px_rgba(255,107,74,0.6)]' 
                              : 'bg-white/10'
                          }`}
                        />
                      );
                    })}
                  </div>
                </div>

                {/* Module 3 - Zone Focus */}
                <div className="bg-black/50 rounded-xl border border-white/10 p-6 animate-fade-in hover:border-[#ff6b4a]/30 transition-colors group" style={{ animationDelay: '0.4s' }}>
                  <div className="flex items-center gap-2 mb-3">
                    <Target className="h-4 w-4 text-white/30 group-hover:text-[#ff6b4a] transition-colors" />
                    <span className="font-mono text-xs text-white/40">ZONE_FOCUS</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div 
                      className="w-16 h-16 rounded-full bg-[#ff6b4a]/10 border border-[#ff6b4a]/20 flex items-center justify-center text-3xl"
                      style={{ animation: 'spin 20s linear infinite' }}
                    >
                      {ZONE_ICONS[painZone]}
                    </div>
                    <div>
                      <p className="font-semibold text-white">{ZONE_LABELS[painZone]}</p>
                      <p className="font-mono text-xs text-white/40">Zone ciblée</p>
                    </div>
                  </div>
                </div>

                {/* Module 4 - System Stats */}
                <div className="bg-black/50 rounded-xl border border-white/10 p-6 animate-fade-in hover:border-[#ff6b4a]/30 transition-colors group" style={{ animationDelay: '0.5s' }}>
                  <div className="flex items-center gap-2 mb-4">
                    <Zap className="h-4 w-4 text-white/30 group-hover:text-[#ff6b4a] transition-colors" />
                    <span className="font-mono text-xs text-white/40">STATUT_SYSTÈME</span>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="font-mono text-xs text-white/40">DURÉE</span>
                      <span className="font-mono text-sm text-white">{currentSession.duration}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-mono text-xs text-white/40">SESSIONS</span>
                      <span className="font-mono text-sm text-white">{currentDay - 1} / {totalDays}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-mono text-xs text-white/40">STATUT</span>
                      <span className="font-mono text-sm text-emerald-400 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        ACTIF
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* No session found */
            <div className="bg-black/50 rounded-2xl border border-white/10 p-10 text-center animate-fade-in shadow-[inset_0_0_30px_rgba(0,0,0,0.5)]">
              <p className="text-white/60 font-mono">
                &gt; ERREUR :: Session non trouvée pour J-{currentDay}
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
