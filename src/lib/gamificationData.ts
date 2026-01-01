import { Flame, Trophy, Skull, Crown, Zap, Star, Shield, Gem, Eye, Snowflake, Sun, Moon, Sparkles, Heart, Target, Crosshair, Hexagon, Circle, Diamond } from 'lucide-react';

// Types for skins registry
export type SkinRequirementType = 'free' | 'level' | 'streak' | 'pro' | 'top100';

export interface SkinRequirement {
  type: SkinRequirementType;
  value?: number; // Level number or streak days
}

export interface SkinDefinition {
  id: string;
  name: string;
  description: string;
  colorFrom: string;
  colorTo: string;
  colorVia?: string;
  glowColor: string;
  requirement: SkinRequirement;
  iconName: string;
  category: 'level' | 'streak' | 'pro' | 'special';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

// 30+ Skins Registry - RPG Style Collection
export const SKINS_REGISTRY: SkinDefinition[] = [
  // === FREE / DEFAULT ===
  {
    id: 'standard',
    name: 'Standard',
    description: 'Module de base - Vert NIVO classique',
    colorFrom: 'green-500',
    colorTo: 'emerald-500',
    glowColor: 'rgba(34, 197, 94, 0.4)',
    requirement: { type: 'free' },
    iconName: 'Circle',
    category: 'level',
    rarity: 'common',
  },

  // === LEVEL SKINS (Grind Rewards) ===
  {
    id: 'neon-blue',
    name: 'Neon Blue',
    description: 'Premier upgrade - Éclat Cyan',
    colorFrom: 'cyan-400',
    colorTo: 'blue-500',
    glowColor: 'rgba(34, 211, 238, 0.4)',
    requirement: { type: 'level', value: 3 },
    iconName: 'Zap',
    category: 'level',
    rarity: 'common',
  },
  {
    id: 'matrix',
    name: 'Matrix',
    description: 'Code vert tombant - Hacker vibes',
    colorFrom: 'green-400',
    colorTo: 'lime-500',
    glowColor: 'rgba(74, 222, 128, 0.5)',
    requirement: { type: 'level', value: 5 },
    iconName: 'Eye',
    category: 'level',
    rarity: 'rare',
  },
  {
    id: 'cyber-samurai',
    name: 'Cyber-Samurai',
    description: 'Néon Rouge/Bleu - Style Cyberpunk',
    colorFrom: 'red-500',
    colorTo: 'cyan-400',
    colorVia: 'purple-500',
    glowColor: 'rgba(239, 68, 68, 0.4)',
    requirement: { type: 'level', value: 10 },
    iconName: 'Flame',
    category: 'level',
    rarity: 'rare',
  },
  {
    id: 'phantom',
    name: 'Phantom',
    description: 'Spectral violet - Essence éthérée',
    colorFrom: 'purple-500',
    colorTo: 'pink-500',
    glowColor: 'rgba(168, 85, 247, 0.4)',
    requirement: { type: 'level', value: 15 },
    iconName: 'Sparkles',
    category: 'level',
    rarity: 'rare',
  },
  {
    id: 'master',
    name: 'Master',
    description: 'Argent pur - Maîtrise atteinte',
    colorFrom: 'gray-300',
    colorTo: 'slate-500',
    glowColor: 'rgba(148, 163, 184, 0.4)',
    requirement: { type: 'level', value: 20 },
    iconName: 'Shield',
    category: 'level',
    rarity: 'epic',
  },
  {
    id: 'electric',
    name: 'Electric Storm',
    description: 'Éclairs purs - Énergie brute',
    colorFrom: 'yellow-400',
    colorTo: 'amber-500',
    glowColor: 'rgba(250, 204, 21, 0.5)',
    requirement: { type: 'level', value: 25 },
    iconName: 'Zap',
    category: 'level',
    rarity: 'epic',
  },
  {
    id: 'bloodmoon',
    name: 'Blood Moon',
    description: 'Rouge sang - Puissance ancestrale',
    colorFrom: 'red-600',
    colorTo: 'rose-700',
    glowColor: 'rgba(220, 38, 38, 0.5)',
    requirement: { type: 'level', value: 30 },
    iconName: 'Moon',
    category: 'level',
    rarity: 'epic',
  },
  {
    id: 'void',
    name: 'Void Walker',
    description: 'Noir absolu - Entre les dimensions',
    colorFrom: 'slate-900',
    colorTo: 'gray-800',
    colorVia: 'purple-900',
    glowColor: 'rgba(30, 27, 75, 0.6)',
    requirement: { type: 'level', value: 35 },
    iconName: 'Skull',
    category: 'level',
    rarity: 'epic',
  },
  {
    id: 'grandmaster',
    name: 'Grandmaster',
    description: 'Blanc immaculé - Perfection',
    colorFrom: 'white',
    colorTo: 'gray-100',
    glowColor: 'rgba(255, 255, 255, 0.5)',
    requirement: { type: 'level', value: 40 },
    iconName: 'Crown',
    category: 'level',
    rarity: 'legendary',
  },
  {
    id: 'transcendent',
    name: 'Transcendent',
    description: 'Arc-en-ciel - Au-delà des limites',
    colorFrom: 'red-500',
    colorTo: 'blue-500',
    colorVia: 'yellow-400',
    glowColor: 'rgba(168, 85, 247, 0.5)',
    requirement: { type: 'level', value: 50 },
    iconName: 'Star',
    category: 'level',
    rarity: 'legendary',
  },

  // === STREAK SKINS (Habit Rewards) ===
  {
    id: 'ember',
    name: 'Ember',
    description: 'Première flamme - 3 jours consécutifs',
    colorFrom: 'orange-400',
    colorTo: 'red-500',
    glowColor: 'rgba(251, 146, 60, 0.4)',
    requirement: { type: 'streak', value: 3 },
    iconName: 'Flame',
    category: 'streak',
    rarity: 'common',
  },
  {
    id: 'flame-walker',
    name: 'Flame Walker',
    description: 'Maître du feu - 7 jours de série',
    colorFrom: 'orange-500',
    colorTo: 'yellow-400',
    glowColor: 'rgba(249, 115, 22, 0.5)',
    requirement: { type: 'streak', value: 7 },
    iconName: 'Flame',
    category: 'streak',
    rarity: 'rare',
  },
  {
    id: 'inferno',
    name: 'Inferno',
    description: 'Brasier ardent - 14 jours inarrêtables',
    colorFrom: 'red-500',
    colorTo: 'orange-600',
    colorVia: 'yellow-500',
    glowColor: 'rgba(239, 68, 68, 0.5)',
    requirement: { type: 'streak', value: 14 },
    iconName: 'Flame',
    category: 'streak',
    rarity: 'rare',
  },
  {
    id: 'consistency-god',
    name: 'Consistency God',
    description: 'Discipline absolue - 30 jours consécutifs',
    colorFrom: 'amber-500',
    colorTo: 'orange-600',
    glowColor: 'rgba(245, 158, 11, 0.5)',
    requirement: { type: 'streak', value: 30 },
    iconName: 'Target',
    category: 'streak',
    rarity: 'epic',
  },
  {
    id: 'eternal-flame',
    name: 'Eternal Flame',
    description: 'Feu immortel - 60 jours sans interruption',
    colorFrom: 'orange-400',
    colorTo: 'red-600',
    colorVia: 'yellow-300',
    glowColor: 'rgba(251, 146, 60, 0.6)',
    requirement: { type: 'streak', value: 60 },
    iconName: 'Sun',
    category: 'streak',
    rarity: 'epic',
  },
  {
    id: 'phoenix',
    name: 'Phoenix',
    description: 'Renaissance perpétuelle - 100 jours légendaires',
    colorFrom: 'red-500',
    colorTo: 'amber-400',
    colorVia: 'orange-500',
    glowColor: 'rgba(239, 68, 68, 0.6)',
    requirement: { type: 'streak', value: 100 },
    iconName: 'Flame',
    category: 'streak',
    rarity: 'legendary',
  },

  // === PRO SKINS (Subscriber Exclusives) ===
  {
    id: 'gold',
    name: 'Gold',
    description: 'Or pur - Exclusif abonnés',
    colorFrom: 'amber-400',
    colorTo: 'yellow-500',
    glowColor: 'rgba(251, 191, 36, 0.5)',
    requirement: { type: 'pro' },
    iconName: 'Crown',
    category: 'pro',
    rarity: 'rare',
  },
  {
    id: 'platinum',
    name: 'Platinum',
    description: 'Platine brillant - Élite PRO',
    colorFrom: 'slate-300',
    colorTo: 'gray-400',
    glowColor: 'rgba(203, 213, 225, 0.5)',
    requirement: { type: 'pro' },
    iconName: 'Gem',
    category: 'pro',
    rarity: 'epic',
  },
  {
    id: 'diamond',
    name: 'Diamond',
    description: 'Diamant pur - Brillance éternelle',
    colorFrom: 'cyan-300',
    colorTo: 'blue-400',
    glowColor: 'rgba(34, 211, 238, 0.5)',
    requirement: { type: 'pro' },
    iconName: 'Diamond',
    category: 'pro',
    rarity: 'epic',
  },
  {
    id: 'obsidian',
    name: 'Obsidian',
    description: 'Verre volcanique - Sombre et puissant',
    colorFrom: 'slate-800',
    colorTo: 'gray-900',
    glowColor: 'rgba(30, 41, 59, 0.6)',
    requirement: { type: 'pro' },
    iconName: 'Hexagon',
    category: 'pro',
    rarity: 'epic',
  },
  {
    id: 'aurora',
    name: 'Aurora',
    description: 'Aurore boréale - Lumière du nord',
    colorFrom: 'green-400',
    colorTo: 'purple-500',
    colorVia: 'cyan-400',
    glowColor: 'rgba(74, 222, 128, 0.4)',
    requirement: { type: 'pro' },
    iconName: 'Sparkles',
    category: 'pro',
    rarity: 'epic',
  },
  {
    id: 'golden-god',
    name: 'Golden God',
    description: 'Or métallique - Ultime exclusivité',
    colorFrom: 'amber-400',
    colorTo: 'amber-600',
    colorVia: 'yellow-300',
    glowColor: 'rgba(251, 191, 36, 0.6)',
    requirement: { type: 'pro' },
    iconName: 'Trophy',
    category: 'pro',
    rarity: 'legendary',
  },
  {
    id: 'cosmic',
    name: 'Cosmic',
    description: 'Étoiles infinies - L\'univers en vous',
    colorFrom: 'purple-600',
    colorTo: 'pink-500',
    colorVia: 'indigo-500',
    glowColor: 'rgba(168, 85, 247, 0.5)',
    requirement: { type: 'pro' },
    iconName: 'Star',
    category: 'pro',
    rarity: 'legendary',
  },

  // === SPECIAL / TOP 100 ===
  {
    id: 'elite',
    name: 'Elite',
    description: 'Top 100 mondial - Les meilleurs',
    colorFrom: 'rose-500',
    colorTo: 'pink-600',
    glowColor: 'rgba(244, 63, 94, 0.5)',
    requirement: { type: 'top100' },
    iconName: 'Target',
    category: 'special',
    rarity: 'legendary',
  },
  {
    id: 'champion',
    name: 'Champion',
    description: 'Top 50 mondial - Légendes vivantes',
    colorFrom: 'emerald-400',
    colorTo: 'teal-500',
    glowColor: 'rgba(52, 211, 153, 0.5)',
    requirement: { type: 'top100' },
    iconName: 'Trophy',
    category: 'special',
    rarity: 'legendary',
  },
  {
    id: 'apex',
    name: 'Apex Predator',
    description: 'Top 10 mondial - Prédateur ultime',
    colorFrom: 'red-600',
    colorTo: 'gray-900',
    colorVia: 'red-800',
    glowColor: 'rgba(185, 28, 28, 0.6)',
    requirement: { type: 'top100' },
    iconName: 'Crosshair',
    category: 'special',
    rarity: 'legendary',
  },

  // === ADDITIONAL VARIETY ===
  {
    id: 'ice',
    name: 'Ice Crystal',
    description: 'Glace pure - Froid absolu',
    colorFrom: 'cyan-200',
    colorTo: 'blue-300',
    glowColor: 'rgba(165, 243, 252, 0.4)',
    requirement: { type: 'level', value: 8 },
    iconName: 'Snowflake',
    category: 'level',
    rarity: 'rare',
  },
  {
    id: 'solar',
    name: 'Solar Flare',
    description: 'Éruption solaire - Chaleur intense',
    colorFrom: 'yellow-400',
    colorTo: 'orange-500',
    glowColor: 'rgba(250, 204, 21, 0.5)',
    requirement: { type: 'level', value: 12 },
    iconName: 'Sun',
    category: 'level',
    rarity: 'rare',
  },
  {
    id: 'forest',
    name: 'Forest Spirit',
    description: 'Esprit de la forêt - Connexion naturelle',
    colorFrom: 'green-600',
    colorTo: 'emerald-700',
    glowColor: 'rgba(22, 163, 74, 0.4)',
    requirement: { type: 'streak', value: 21 },
    iconName: 'Heart',
    category: 'streak',
    rarity: 'epic',
  },
];

// Helper to get skin by ID
export function getSkinById(id: string): SkinDefinition | undefined {
  return SKINS_REGISTRY.find(skin => skin.id === id);
}

// Get skins by category
export function getSkinsByCategory(category: SkinDefinition['category']): SkinDefinition[] {
  return SKINS_REGISTRY.filter(skin => skin.category === category);
}

// Get skins by rarity
export function getSkinsByRarity(rarity: SkinDefinition['rarity']): SkinDefinition[] {
  return SKINS_REGISTRY.filter(skin => skin.rarity === rarity);
}

// Check if skin is unlocked based on user stats
export function isSkinUnlocked(
  skin: SkinDefinition,
  userLevel: number,
  userStreak: number,
  isPro: boolean,
  unlockedSkins: string[]
): boolean {
  // Already manually unlocked
  if (unlockedSkins.includes(skin.id)) return true;
  
  const { type, value } = skin.requirement;
  
  switch (type) {
    case 'free':
      return true;
    case 'level':
      return userLevel >= (value || 0);
    case 'streak':
      return userStreak >= (value || 0);
    case 'pro':
      return isPro;
    case 'top100':
      return isPro; // For now, PRO users get top100 skins (real leaderboard later)
    default:
      return false;
  }
}

// Get requirement label for display
export function getRequirementLabel(skin: SkinDefinition, userLevel: number, userStreak: number): string {
  const { type, value } = skin.requirement;
  
  switch (type) {
    case 'free':
      return 'Débloqué';
    case 'level':
      return `Niveau ${value} (actuel: ${userLevel})`;
    case 'streak':
      return `Série ${value} jours (actuel: ${userStreak})`;
    case 'pro':
      return 'PRO requis';
    case 'top100':
      return 'Top 100 / PRO';
    default:
      return '';
  }
}

// === SUBSCRIBER BADGES (Twitch-Style) ===
export interface SubscriberBadge {
  id: string;
  name: string;
  months: number;
  colorFrom: string;
  colorTo: string;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
}

export const SUBSCRIBER_BADGES: SubscriberBadge[] = [
  {
    id: 'novice',
    name: 'Novice',
    months: 1,
    colorFrom: 'amber-600',
    colorTo: 'orange-700',
    tier: 'bronze',
  },
  {
    id: 'initie',
    name: 'Initié',
    months: 3,
    colorFrom: 'gray-400',
    colorTo: 'slate-500',
    tier: 'silver',
  },
  {
    id: 'veteran',
    name: 'Vétéran',
    months: 6,
    colorFrom: 'amber-400',
    colorTo: 'yellow-500',
    tier: 'gold',
  },
  {
    id: 'titan',
    name: 'Titan',
    months: 12,
    colorFrom: 'cyan-300',
    colorTo: 'blue-400',
    tier: 'platinum',
  },
];

// Calculate subscriber badge based on subscription start date
export function getSubscriberBadge(subscriptionStartDate: string | null): SubscriberBadge | null {
  if (!subscriptionStartDate) return null;
  
  const startDate = new Date(subscriptionStartDate);
  const now = new Date();
  const monthsDiff = (now.getFullYear() - startDate.getFullYear()) * 12 + (now.getMonth() - startDate.getMonth());
  
  // Find highest badge user qualifies for
  let badge: SubscriberBadge | null = null;
  for (const b of SUBSCRIBER_BADGES) {
    if (monthsDiff >= b.months) {
      badge = b;
    }
  }
  
  return badge;
}

// Rarity colors for UI
export const RARITY_COLORS = {
  common: { bg: 'bg-gray-500/20', border: 'border-gray-500/30', text: 'text-gray-400' },
  rare: { bg: 'bg-blue-500/20', border: 'border-blue-500/30', text: 'text-blue-400' },
  epic: { bg: 'bg-purple-500/20', border: 'border-purple-500/30', text: 'text-purple-400' },
  legendary: { bg: 'bg-amber-500/20', border: 'border-amber-500/30', text: 'text-amber-400' },
};
