export type ThemeId = 'RAPID_PATCH' | 'SYSTEM_REBOOT' | 'ARCHITECT_MODE';

export interface NivoTheme {
  name: string;
  bg: string;
  glassBg: string;
  cardBg: string;
  iconBg: string;
  border: string;
  cardBorder: string;
  borderAccent: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  accent: string;
  buttonPrimary: string;
  buttonText: string;
  progressBg: string;
  progressFill: string;
  glowEffect: string;
  accentGlow: string;
}

export const NIVO_THEMES: Record<ThemeId, NivoTheme> = {
  RAPID_PATCH: {
    name: 'Rapid Patch',
    bg: 'bg-[#050510]',
    glassBg: 'bg-cyan-950/20 backdrop-blur-sm',
    cardBg: 'bg-cyan-950/30',
    iconBg: 'bg-cyan-500/10',
    border: 'border-cyan-500/10',
    cardBorder: 'border-cyan-500/20',
    borderAccent: 'border-cyan-500/30',
    textPrimary: 'text-cyan-50',
    textSecondary: 'text-cyan-200/70',
    textMuted: 'text-cyan-300/50',
    accent: 'text-cyan-400',
    buttonPrimary: 'bg-cyan-500 hover:bg-cyan-400',
    buttonText: 'text-black font-semibold',
    progressBg: 'bg-cyan-950/50',
    progressFill: 'bg-gradient-to-r from-cyan-500 to-cyan-300',
    glowEffect: 'shadow-[0_0_30px_rgba(34,211,238,0.1)]',
    accentGlow: 'shadow-[0_0_20px_rgba(34,211,238,0.3)]',
  },
  SYSTEM_REBOOT: {
    name: 'System Reboot',
    bg: 'bg-[#050510]',
    glassBg: 'bg-white/5 backdrop-blur-sm',
    cardBg: 'bg-white/5',
    iconBg: 'bg-[#ff6b4a]/10',
    border: 'border-white/10',
    cardBorder: 'border-white/10',
    borderAccent: 'border-[#ff6b4a]/30',
    textPrimary: 'text-white',
    textSecondary: 'text-white/70',
    textMuted: 'text-white/40',
    accent: 'text-[#ff6b4a]',
    buttonPrimary: 'bg-[#ff6b4a] hover:bg-[#ff8a6a]',
    buttonText: 'text-black font-semibold',
    progressBg: 'bg-white/10',
    progressFill: 'bg-gradient-to-r from-[#ff6b4a] to-[#fbbf24]',
    glowEffect: 'shadow-[0_0_30px_rgba(255,107,74,0.1)]',
    accentGlow: 'shadow-[0_0_20px_rgba(255,107,74,0.3)]',
  },
  ARCHITECT_MODE: {
    name: 'Architect Mode',
    bg: 'bg-[#0a0a0f]',
    glassBg: 'bg-white/5 backdrop-blur-sm',
    cardBg: 'bg-white/5',
    iconBg: 'bg-white/10',
    border: 'border-white/10',
    cardBorder: 'border-white/10',
    borderAccent: 'border-white/20',
    textPrimary: 'text-white',
    textSecondary: 'text-slate-300',
    textMuted: 'text-slate-500',
    accent: 'text-slate-200',
    buttonPrimary: 'bg-white hover:bg-slate-100',
    buttonText: 'text-black font-semibold',
    progressBg: 'bg-white/10',
    progressFill: 'bg-gradient-to-r from-white to-slate-300',
    glowEffect: 'shadow-[0_0_30px_rgba(255,255,255,0.05)]',
    accentGlow: 'shadow-[0_0_20px_rgba(255,255,255,0.2)]',
  },
};
