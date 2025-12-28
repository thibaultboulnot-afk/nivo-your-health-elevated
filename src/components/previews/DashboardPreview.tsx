import React from 'react';
import {
  Settings,
  Activity,
  Zap,
  Shield,
  Clock,
  Headphones,
  Play,
  User,
  Battery,
  Crown,
  TrendingUp,
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer } from 'recharts';

interface DashboardPreviewProps {
  forceMobile?: boolean;
}

// Static mock data for the preview
const mockPostureHistory = [
  { date: '01/12', score: 45 },
  { date: '05/12', score: 52 },
  { date: '10/12', score: 58 },
  { date: '15/12', score: 65 },
  { date: '20/12', score: 72 },
  { date: '25/12', score: 80 },
  { date: '28/12', score: 87 },
];

const mockStats = {
  nivoScore: 87,
  streak: 12,
  totalSessions: 34,
};

const mockDailyRoutineSteps = [
  'Cat-Cow',
  'Bird-Dog',
  'Dead Bug',
  'Glute Bridge',
  'Child\'s Pose',
];

export default function DashboardPreview({ forceMobile = false }: DashboardPreviewProps) {
  const circleRadius = 90;
  const circumference = 2 * Math.PI * circleRadius;
  const strokeDashoffset = circumference - (mockStats.nivoScore / 100) * circumference;

  return (
    <div className={`min-h-full bg-[#050510] relative overflow-hidden ${forceMobile ? 'text-[8px]' : ''}`}>
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none opacity-30" style={{
        background: 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(255,107,74,0.15), transparent)'
      }} />
      
      {/* Header */}
      <header className="relative z-20 border-b border-white/5 bg-[#050510]/80 backdrop-blur-sm">
        <div className={`px-3 ${forceMobile ? 'py-2' : 'py-3'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`${forceMobile ? 'w-5 h-5' : 'w-7 h-7'} rounded-lg bg-[#ff6b4a] flex items-center justify-center shadow-[0_0_15px_rgba(255,107,74,0.4)]`}>
                <span className={`font-bold text-black ${forceMobile ? 'text-[8px]' : 'text-xs'}`}>N</span>
              </div>
              <span className={`font-bold text-white ${forceMobile ? 'text-[10px]' : 'text-sm'}`}>NIVO</span>
              <span className={`px-1.5 py-0.5 bg-[#ff6b4a]/20 border border-[#ff6b4a]/30 rounded-full font-mono ${forceMobile ? 'text-[6px]' : 'text-[8px]'} text-[#ff6b4a] flex items-center gap-0.5`}>
                <Crown className={`${forceMobile ? 'w-2 h-2' : 'w-2.5 h-2.5'}`} />
                PRO
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className={`${forceMobile ? 'p-1' : 'p-1.5'} rounded-lg bg-white/5 border border-white/10`}>
                <Settings className={`${forceMobile ? 'h-2.5 w-2.5' : 'h-3 w-3'} text-white/60`} />
              </div>
              <div className={`${forceMobile ? 'w-5 h-5' : 'w-6 h-6'} rounded-full bg-[#ff6b4a]/20 border border-[#ff6b4a]/30 flex items-center justify-center`}>
                <User className={`${forceMobile ? 'h-2.5 w-2.5' : 'h-3 w-3'} text-[#ff6b4a]`} />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className={`relative z-10 ${forceMobile ? 'px-2 py-2' : 'px-3 py-4'}`}>
        {/* Hero - NIVO Score */}
        <section className={`${forceMobile ? 'mb-2' : 'mb-4'}`}>
          <div className={`bg-black/60 ${forceMobile ? 'rounded-lg p-2' : 'rounded-xl p-4'} border border-white/10 relative overflow-hidden`}>
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-32 h-32 bg-[#ff6b4a]/5 rounded-full blur-3xl" />
            </div>

            <div className="relative z-10 flex flex-col items-center gap-3">
              {/* Score Circle */}
              <div className="relative">
                <svg className={`${forceMobile ? 'w-20 h-20' : 'w-28 h-28'} -rotate-90`} viewBox="0 0 200 200">
                  <circle
                    cx="100"
                    cy="100"
                    r={circleRadius}
                    fill="none"
                    stroke="rgba(255,255,255,0.1)"
                    strokeWidth="8"
                  />
                  <circle
                    cx="100"
                    cy="100"
                    r={circleRadius}
                    fill="none"
                    stroke="url(#previewScoreGradient)"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                  />
                  <defs>
                    <linearGradient id="previewScoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#ff6b4a" />
                      <stop offset="100%" stopColor="#ff8a6a" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className={`font-mono ${forceMobile ? 'text-lg' : 'text-2xl'} font-bold text-white`}>
                    {mockStats.nivoScore}
                  </span>
                  <span className={`font-mono ${forceMobile ? 'text-[5px]' : 'text-[8px]'} text-white/40 mt-0.5`}>NIVO SCORE</span>
                </div>
              </div>

              {/* Status */}
              <div className={`inline-block ${forceMobile ? 'px-2 py-1' : 'px-3 py-1.5'} rounded-lg bg-emerald-500/10 border border-emerald-500/30`}>
                <p className={`font-mono ${forceMobile ? 'text-[6px]' : 'text-[9px]'} text-emerald-400`}>SYSTÈME OPTIMAL. MODE MAINTENANCE.</p>
              </div>

              {/* Stats Widgets */}
              <div className={`grid grid-cols-2 ${forceMobile ? 'gap-1.5' : 'gap-2'} w-full max-w-[200px]`}>
                <div className={`bg-white/5 border border-white/10 ${forceMobile ? 'rounded p-1.5' : 'rounded-lg p-2'}`}>
                  <div className="flex items-center gap-1 mb-0.5">
                    <Clock className={`${forceMobile ? 'h-2 w-2' : 'h-2.5 w-2.5'} text-white/40`} />
                    <span className={`font-mono ${forceMobile ? 'text-[5px]' : 'text-[7px]'} text-white/40`}>SÉRIE</span>
                  </div>
                  <p className={`font-mono ${forceMobile ? 'text-sm' : 'text-base'} font-bold text-white`}>{mockStats.streak} <span className={`${forceMobile ? 'text-[6px]' : 'text-[8px]'} text-white/40`}>J</span></p>
                </div>
                <div className={`bg-white/5 border border-white/10 ${forceMobile ? 'rounded p-1.5' : 'rounded-lg p-2'}`}>
                  <div className="flex items-center gap-1 mb-0.5">
                    <Activity className={`${forceMobile ? 'h-2 w-2' : 'h-2.5 w-2.5'} text-white/40`} />
                    <span className={`font-mono ${forceMobile ? 'text-[5px]' : 'text-[7px]'} text-white/40`}>SESSIONS</span>
                  </div>
                  <p className={`font-mono ${forceMobile ? 'text-sm' : 'text-base'} font-bold text-white`}>{mockStats.totalSessions}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Posture Evolution Chart */}
        <section className={`${forceMobile ? 'mb-2' : 'mb-4'}`}>
          <div className={`bg-black/60 ${forceMobile ? 'rounded-lg p-2' : 'rounded-xl p-3'} border border-white/10 relative overflow-hidden`}>
            <div className="flex items-center gap-1.5 mb-2">
              <TrendingUp className={`${forceMobile ? 'h-2.5 w-2.5' : 'h-3 w-3'} text-[#ff6b4a]`} />
              <span className={`font-mono ${forceMobile ? 'text-[6px]' : 'text-[8px]'} text-white/40`}>ÉVOLUTION_ALIGNEMENT //</span>
            </div>
            
            <div className={`${forceMobile ? 'h-16' : 'h-24'}`}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={mockPostureHistory} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="previewPostureGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#4ADE80" stopOpacity={0.4} />
                      <stop offset="100%" stopColor="#4ADE80" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis 
                    dataKey="date" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 6, fontFamily: 'monospace' }}
                  />
                  <YAxis 
                    domain={[0, 100]}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 6, fontFamily: 'monospace' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="score" 
                    stroke="#4ADE80" 
                    strokeWidth={1.5}
                    fill="url(#previewPostureGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>

        {/* Grid Layout */}
        <div className={`grid ${forceMobile ? 'grid-cols-1 gap-2' : 'grid-cols-3 gap-3'}`}>
          {/* Left Column - Daily Loop */}
          <section className={`${forceMobile ? '' : 'col-span-2'}`}>
            <div className={`bg-black/60 ${forceMobile ? 'rounded-lg p-2' : 'rounded-xl p-4'} border border-[#ff6b4a]/20 relative overflow-hidden`}>
              <div className="absolute inset-0 pointer-events-none opacity-50">
                <div className="absolute -top-10 -right-10 w-24 h-24 bg-[#ff6b4a]/10 rounded-full blur-3xl" />
              </div>

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <Headphones className={`${forceMobile ? 'h-2.5 w-2.5' : 'h-3 w-3'} text-[#ff6b4a]`} />
                    <span className={`font-mono ${forceMobile ? 'text-[6px]' : 'text-[8px]'} text-[#ff6b4a]`}>ROUTINE QUOTIDIENNE</span>
                  </div>
                  <span className={`px-1.5 py-0.5 bg-emerald-500/20 border border-emerald-500/30 rounded-full font-mono ${forceMobile ? 'text-[5px]' : 'text-[7px]'} text-emerald-400`}>
                    GRATUIT
                  </span>
                </div>

                <h2 className={`font-bold text-white ${forceMobile ? 'text-sm mb-0.5' : 'text-lg mb-1'}`}>
                  Boucle Quotidienne
                </h2>
                <p className={`font-mono ${forceMobile ? 'text-[6px]' : 'text-[8px]'} text-white/50 ${forceMobile ? 'mb-2' : 'mb-3'}`}>
                  8 min :: 5 exercices // Entretien
                </p>

                {/* Steps Preview */}
                {!forceMobile && (
                  <div className="bg-white/5 border border-white/10 rounded-lg p-2 mb-3">
                    <p className="font-mono text-[7px] text-white/40 mb-1.5">SÉQUENCE</p>
                    <div className="flex flex-wrap gap-1">
                      {mockDailyRoutineSteps.map((step, index) => (
                        <span key={index} className="px-1.5 py-0.5 bg-white/5 border border-white/10 rounded font-mono text-[6px] text-white/60">
                          {step}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Launch Button */}
                <div className={`w-full ${forceMobile ? 'h-6' : 'h-8'} bg-[#ff6b4a] hover:bg-[#ff6b4a]/90 rounded-lg flex items-center justify-center gap-1.5 shadow-[0_0_20px_rgba(255,107,74,0.4)]`}>
                  <Play className={`${forceMobile ? 'h-2.5 w-2.5' : 'h-3 w-3'} text-black`} />
                  <span className={`font-bold text-black ${forceMobile ? 'text-[8px]' : 'text-[10px]'}`}>LANCER LA ROUTINE</span>
                </div>
              </div>
            </div>
          </section>

          {/* Right Column - Stats (hidden on mobile) */}
          {!forceMobile && (
            <section className="space-y-2">
              {/* Energy Level */}
              <div className="bg-black/60 rounded-lg border border-white/10 p-3">
                <div className="flex items-center gap-1.5 mb-2">
                  <Battery className="h-2.5 w-2.5 text-white/40" />
                  <span className="font-mono text-[7px] text-white/40">NIVEAU D'ÉNERGIE</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#ff6b4a] to-amber-500 rounded-full"
                      style={{ width: '87%' }}
                    />
                  </div>
                  <span className="font-mono text-[9px] text-white">87%</span>
                </div>
              </div>

              {/* Access Level */}
              <div className="bg-black/60 rounded-lg border border-white/10 p-3">
                <div className="flex items-center gap-1.5 mb-2">
                  <Shield className="h-2.5 w-2.5 text-white/40" />
                  <span className="font-mono text-[7px] text-white/40">NIVEAU D'ACCÈS</span>
                </div>
                <p className="font-mono text-xs font-semibold text-white flex items-center gap-1">
                  <Crown className="h-2.5 w-2.5 text-[#ff6b4a]" />
                  NIVO PRO
                </p>
              </div>

              {/* Quick Stats */}
              <div className="bg-black/60 rounded-lg border border-white/10 p-3">
                <div className="flex items-center gap-1.5 mb-2">
                  <Zap className="h-2.5 w-2.5 text-white/40" />
                  <span className="font-mono text-[7px] text-white/40">MÉTRIQUES</span>
                </div>
                <div className="space-y-1.5">
                  <div className="flex justify-between">
                    <span className="font-mono text-[7px] text-white/40">SESSIONS</span>
                    <span className="font-mono text-[9px] text-white">34</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-mono text-[7px] text-white/40">SÉRIE</span>
                    <span className="font-mono text-[9px] text-white">12 jours</span>
                  </div>
                </div>
              </div>
            </section>
          )}
        </div>
      </main>
    </div>
  );
}
