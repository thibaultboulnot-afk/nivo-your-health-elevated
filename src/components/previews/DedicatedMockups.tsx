import React from 'react';

// Mobile Mockup Screen (9:19 ratio)
export const MobileMockupScreen = () => (
  <div className="flex flex-col h-full w-full bg-zinc-950 p-4 pt-12 font-mono">
    {/* Header */}
    <div className="flex items-center justify-between mb-8">
      <div>
        <p className="text-white/50 text-xs">Bonjour</p>
        <p className="text-white font-semibold text-lg">Thibault</p>
      </div>
      <div className="w-10 h-10 rounded-full bg-zinc-800 border border-white/10" />
    </div>

    {/* Score Ring - Hero */}
    <div className="flex-1 flex items-center justify-center">
      <div className="relative">
        {/* Glow effect */}
        <div className="absolute inset-0 blur-xl bg-[#4ADE80]/20 rounded-full" />
        
        {/* Ring SVG */}
        <svg width="180" height="180" viewBox="0 0 180 180" className="relative z-10">
          {/* Background ring */}
          <circle
            cx="90"
            cy="90"
            r="80"
            fill="none"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="8"
          />
          {/* Progress ring */}
          <circle
            cx="90"
            cy="90"
            r="80"
            fill="none"
            stroke="#4ADE80"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={`${0.92 * 2 * Math.PI * 80} ${2 * Math.PI * 80}`}
            transform="rotate(-90 90 90)"
            className="drop-shadow-[0_0_8px_rgba(74,222,128,0.5)]"
          />
          {/* Score text */}
          <text
            x="90"
            y="85"
            textAnchor="middle"
            className="fill-white font-bold"
            style={{ fontSize: '48px' }}
          >
            92
          </text>
          <text
            x="90"
            y="110"
            textAnchor="middle"
            className="fill-white/50"
            style={{ fontSize: '14px' }}
          >
            Score NIVO
          </text>
        </svg>
      </div>
    </div>

    {/* Action Button */}
    <button className="w-full bg-[#4ADE80] text-black font-bold uppercase rounded-lg py-3 text-sm tracking-wider mb-4">
      Scan Rapide
    </button>

    {/* Last session card */}
    <div className="bg-zinc-900/50 border border-white/10 rounded-lg p-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-[#4ADE80]/20 flex items-center justify-center">
          <div className="w-3 h-3 rounded-full bg-[#4ADE80]" />
        </div>
        <div>
          <p className="text-white/50 text-xs">Dernière session</p>
          <p className="text-white text-sm font-medium">8 min</p>
        </div>
      </div>
      <span className="text-[#4ADE80] text-xs">Hier</span>
    </div>
  </div>
);

// Desktop Mockup Screen (16:10 ratio)
export const DesktopMockupScreen = () => (
  <div className="flex h-full w-full bg-zinc-950 font-mono">
    {/* Sidebar */}
    <div className="w-14 border-r border-white/10 flex flex-col items-center py-4 gap-4">
      <div className="w-8 h-8 rounded-lg bg-[#4ADE80]/20 flex items-center justify-center">
        <div className="w-4 h-4 rounded bg-[#4ADE80]" />
      </div>
      <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center">
        <div className="w-4 h-4 rounded bg-zinc-600" />
      </div>
      <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center">
        <div className="w-4 h-4 rounded bg-zinc-600" />
      </div>
      <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center">
        <div className="w-4 h-4 rounded bg-zinc-600" />
      </div>
    </div>

    {/* Main Content - Bento Grid */}
    <div className="flex-1 p-4">
      <div className="grid grid-cols-3 gap-3 h-full">
        {/* Card 1 - Score */}
        <div className="bg-zinc-900/50 border border-white/10 rounded-xl p-4 flex flex-col">
          <span className="text-white/50 text-xs uppercase tracking-wider">Score Santé</span>
          <div className="flex-1 flex items-center justify-center">
            <span className="text-5xl font-bold text-white">87</span>
          </div>
          <div className="flex justify-center">
            <span className="bg-[#4ADE80]/20 text-[#4ADE80] text-xs px-3 py-1 rounded-full border border-[#4ADE80]/30">
              Excellent
            </span>
          </div>
        </div>

        {/* Card 2 - Graph (spans 2 columns) */}
        <div className="col-span-2 bg-zinc-900/50 border border-white/10 rounded-xl p-4 flex flex-col">
          <span className="text-white/50 text-xs uppercase tracking-wider mb-3">Mobilité Vertébrale</span>
          <div className="flex-1 flex items-end">
            <svg viewBox="0 0 100 40" className="w-full h-full" preserveAspectRatio="none">
              <defs>
                <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#4ADE80" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#4ADE80" stopOpacity="0" />
                </linearGradient>
              </defs>
              {/* Gradient fill area */}
              <path
                d="M0 40 L0 35 C 20 35, 40 10, 100 5 L100 40 Z"
                fill="url(#chartGradient)"
              />
              {/* Line */}
              <path
                d="M0 35 C 20 35, 40 10, 100 5"
                fill="none"
                stroke="#4ADE80"
                strokeWidth="2"
                strokeLinecap="round"
                className="drop-shadow-[0_0_6px_rgba(74,222,128,0.5)]"
              />
              {/* End dot */}
              <circle cx="100" cy="5" r="3" fill="#4ADE80" className="drop-shadow-[0_0_6px_rgba(74,222,128,0.8)]" />
            </svg>
          </div>
          <div className="flex justify-between mt-2 text-white/30 text-xs">
            <span>Lun</span>
            <span>Mar</span>
            <span>Mer</span>
            <span>Jeu</span>
            <span>Ven</span>
          </div>
        </div>

        {/* Card 3 - Checklist */}
        <div className="bg-zinc-900/50 border border-white/10 rounded-xl p-4 flex flex-col">
          <span className="text-white/50 text-xs uppercase tracking-wider mb-3">Checklist du jour</span>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded border border-[#4ADE80] bg-[#4ADE80]/20 flex items-center justify-center">
                <svg className="w-2.5 h-2.5 text-[#4ADE80]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-white/70 text-xs">Étirements matinaux</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded border border-[#4ADE80] bg-[#4ADE80]/20 flex items-center justify-center">
                <svg className="w-2.5 h-2.5 text-[#4ADE80]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-white/70 text-xs">Pause active</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded border border-white/20 bg-transparent" />
              <span className="text-white/40 text-xs">Session soir</span>
            </div>
          </div>
        </div>

        {/* Card 4 - Next Session */}
        <div className="bg-zinc-900/50 border border-white/10 rounded-xl p-4 flex flex-col">
          <span className="text-white/50 text-xs uppercase tracking-wider mb-2">Prochaine session</span>
          <div className="flex-1 flex flex-col justify-center">
            <span className="text-white font-semibold text-sm">Mobilité Cervicale</span>
            <span className="text-[#4ADE80] text-xs mt-1">Dans 2h</span>
          </div>
        </div>

        {/* Card 5 - Streak */}
        <div className="bg-zinc-900/50 border border-white/10 rounded-xl p-4 flex flex-col items-center justify-center">
          <span className="text-3xl mb-1">🔥</span>
          <span className="text-white font-bold text-lg">12 jours</span>
          <span className="text-white/40 text-xs">Streak actif</span>
        </div>
      </div>
    </div>
  </div>
);
