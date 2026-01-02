/**
 * NIVO Gamification Registry - Cyberpunk RPG System
 * 30+ Armor Skins with French Lore & Rank System
 */

import type { LucideIcon } from 'lucide-react';

// === TYPES ===
export type SkinRarity = 'common' | 'rare' | 'epic' | 'legendary';
export type SkinCategory = 'level' | 'streak' | 'pro' | 'special';
export type RequirementType = 'free' | 'level' | 'streak' | 'pro' | 'top100';

export interface SkinRequirement {
  type: RequirementType;
  value?: number;
}

export interface ArmorSkin {
  id: string;
  name: string; // French name
  description: string; // French lore
  rarity: SkinRarity;
  category: SkinCategory;
  requirement: SkinRequirement;
  visualClass: string; // Tailwind gradient classes
  glowColor: string; // CSS glow color
  iconName: string;
}

// === 30+ ARMOR SKINS REGISTRY ===
export const SKINS_REGISTRY: ArmorSkin[] = [
  // === NIVEAU DE BASE ===
  {
    id: 'standard',
    name: 'Module Standard',
    description: 'Châssis de maintenance par défaut. Stabilité optimale.',
    rarity: 'common',
    category: 'level',
    requirement: { type: 'free' },
    visualClass: 'bg-gradient-to-br from-emerald-500 to-green-600',
    glowColor: 'rgba(16, 185, 129, 0.5)',
    iconName: 'Circle',
  },

  // === SKINS DE NIVEAU (Progression RPG) ===
  {
    id: 'neon-protocol',
    name: 'Protocole Néon',
    description: 'Interface cyan de première génération. Basse consommation.',
    rarity: 'common',
    category: 'level',
    requirement: { type: 'level', value: 3 },
    visualClass: 'bg-gradient-to-br from-cyan-400 to-blue-500',
    glowColor: 'rgba(34, 211, 238, 0.5)',
    iconName: 'Zap',
  },
  {
    id: 'colonne-titane',
    name: 'Colonne Titane',
    description: 'Alliage métallique renforcé. Résistance structurelle accrue.',
    rarity: 'rare',
    category: 'level',
    requirement: { type: 'level', value: 5 },
    visualClass: 'bg-gradient-to-br from-slate-400 to-gray-600',
    glowColor: 'rgba(148, 163, 184, 0.5)',
    iconName: 'Shield',
  },
  {
    id: 'lien-neural',
    name: 'Lien Neural',
    description: 'Connexion synaptique directe. Temps de réponse minimal.',
    rarity: 'rare',
    category: 'level',
    requirement: { type: 'level', value: 7 },
    visualClass: 'bg-gradient-to-br from-purple-500 to-indigo-600',
    glowColor: 'rgba(139, 92, 246, 0.5)',
    iconName: 'Eye',
  },
  {
    id: 'armure-spectre',
    name: 'Armure Spectre',
    description: 'Polymère fantôme. Oscillation dimensionnelle active.',
    rarity: 'rare',
    category: 'level',
    requirement: { type: 'level', value: 10 },
    visualClass: 'bg-gradient-to-br from-violet-500 via-purple-600 to-fuchsia-500',
    glowColor: 'rgba(168, 85, 247, 0.5)',
    iconName: 'Sparkles',
  },
  {
    id: 'chassis-zero-g',
    name: 'Châssis Zero-G',
    description: 'Conçu pour l\'apesanteur. Légèreté maximale.',
    rarity: 'epic',
    category: 'level',
    requirement: { type: 'level', value: 12 },
    visualClass: 'bg-gradient-to-br from-sky-400 to-cyan-500',
    glowColor: 'rgba(56, 189, 248, 0.5)',
    iconName: 'Cloud',
  },
  {
    id: 'cyber-samurai',
    name: 'Cyber-Samouraï',
    description: 'Code du Bushido numérique. Honneur et précision.',
    rarity: 'epic',
    category: 'level',
    requirement: { type: 'level', value: 15 },
    visualClass: 'bg-gradient-to-br from-red-500 via-rose-500 to-cyan-400',
    glowColor: 'rgba(239, 68, 68, 0.5)',
    iconName: 'Sword',
  },
  {
    id: 'matrice-verte',
    name: 'Matrice Verte',
    description: 'Données en cascade. Tu vois le code maintenant.',
    rarity: 'epic',
    category: 'level',
    requirement: { type: 'level', value: 18 },
    visualClass: 'bg-gradient-to-br from-green-400 to-lime-500',
    glowColor: 'rgba(74, 222, 128, 0.6)',
    iconName: 'Binary',
  },
  {
    id: 'noyau-obsidienne',
    name: 'Noyau Obsidienne',
    description: 'Verre volcanique cristallisé. Absorption énergétique.',
    rarity: 'epic',
    category: 'level',
    requirement: { type: 'level', value: 20 },
    visualClass: 'bg-gradient-to-br from-slate-800 via-gray-900 to-slate-950',
    glowColor: 'rgba(30, 41, 59, 0.7)',
    iconName: 'Hexagon',
  },
  {
    id: 'tempete-electrique',
    name: 'Tempête Électrique',
    description: 'Surcharge constante. Énergie brute incontrôlable.',
    rarity: 'epic',
    category: 'level',
    requirement: { type: 'level', value: 25 },
    visualClass: 'bg-gradient-to-br from-yellow-400 via-amber-500 to-orange-500',
    glowColor: 'rgba(250, 204, 21, 0.6)',
    iconName: 'Zap',
  },
  {
    id: 'lune-de-sang',
    name: 'Lune de Sang',
    description: 'Protocole ancestral activé. Puissance primitive.',
    rarity: 'epic',
    category: 'level',
    requirement: { type: 'level', value: 30 },
    visualClass: 'bg-gradient-to-br from-red-600 via-rose-700 to-red-900',
    glowColor: 'rgba(220, 38, 38, 0.6)',
    iconName: 'Moon',
  },
  {
    id: 'marcheur-du-vide',
    name: 'Marcheur du Vide',
    description: 'Entre les dimensions. L\'espace-temps n\'a plus de sens.',
    rarity: 'legendary',
    category: 'level',
    requirement: { type: 'level', value: 35 },
    visualClass: 'bg-gradient-to-br from-slate-900 via-purple-950 to-black',
    glowColor: 'rgba(30, 27, 75, 0.7)',
    iconName: 'Skull',
  },
  {
    id: 'grand-maitre',
    name: 'Grand Maître',
    description: 'Blanc immaculé. La perfection absolue atteinte.',
    rarity: 'legendary',
    category: 'level',
    requirement: { type: 'level', value: 40 },
    visualClass: 'bg-gradient-to-br from-white via-gray-100 to-slate-200',
    glowColor: 'rgba(255, 255, 255, 0.6)',
    iconName: 'Crown',
  },
  {
    id: 'transcendance',
    name: 'Transcendance',
    description: 'Au-delà des limites humaines. Évolution complète.',
    rarity: 'legendary',
    category: 'level',
    requirement: { type: 'level', value: 50 },
    visualClass: 'bg-gradient-to-br from-red-500 via-yellow-400 to-blue-500',
    glowColor: 'rgba(168, 85, 247, 0.6)',
    iconName: 'Star',
  },

  // === SKINS DE SÉQUENCE (Habit Streak) ===
  {
    id: 'premiere-flamme',
    name: 'Première Flamme',
    description: 'Étincelle initiale. Le voyage commence.',
    rarity: 'common',
    category: 'streak',
    requirement: { type: 'streak', value: 3 },
    visualClass: 'bg-gradient-to-br from-orange-400 to-red-500',
    glowColor: 'rgba(251, 146, 60, 0.5)',
    iconName: 'Flame',
  },
  {
    id: 'marcheur-de-feu',
    name: 'Marcheur de Feu',
    description: 'Semaine complète. La discipline s\'installe.',
    rarity: 'rare',
    category: 'streak',
    requirement: { type: 'streak', value: 7 },
    visualClass: 'bg-gradient-to-br from-orange-500 to-amber-400',
    glowColor: 'rgba(249, 115, 22, 0.5)',
    iconName: 'Flame',
  },
  {
    id: 'brasier-ardent',
    name: 'Brasier Ardent',
    description: 'Deux semaines de feu. Rien ne t\'arrête.',
    rarity: 'epic',
    category: 'streak',
    requirement: { type: 'streak', value: 14 },
    visualClass: 'bg-gradient-to-br from-red-500 via-orange-500 to-yellow-400',
    glowColor: 'rgba(239, 68, 68, 0.5)',
    iconName: 'Flame',
  },
  {
    id: 'esprit-foret',
    name: 'Esprit de la Forêt',
    description: 'Connexion naturelle établie. Harmonie biologique.',
    rarity: 'epic',
    category: 'streak',
    requirement: { type: 'streak', value: 21 },
    visualClass: 'bg-gradient-to-br from-green-600 to-emerald-700',
    glowColor: 'rgba(22, 163, 74, 0.5)',
    iconName: 'Heart',
  },
  {
    id: 'dieu-constance',
    name: 'Dieu de la Constance',
    description: 'Un mois complet. Discipline absolue atteinte.',
    rarity: 'epic',
    category: 'streak',
    requirement: { type: 'streak', value: 30 },
    visualClass: 'bg-gradient-to-br from-amber-500 to-orange-600',
    glowColor: 'rgba(245, 158, 11, 0.6)',
    iconName: 'Target',
  },
  {
    id: 'flamme-eternelle',
    name: 'Flamme Éternelle',
    description: 'Deux mois de feu. Légende vivante.',
    rarity: 'legendary',
    category: 'streak',
    requirement: { type: 'streak', value: 60 },
    visualClass: 'bg-gradient-to-br from-orange-400 via-red-500 to-yellow-300',
    glowColor: 'rgba(251, 146, 60, 0.7)',
    iconName: 'Sun',
  },
  {
    id: 'phenix',
    name: 'Phénix',
    description: 'Cent jours. Renaissance perpétuelle du feu.',
    rarity: 'legendary',
    category: 'streak',
    requirement: { type: 'streak', value: 100 },
    visualClass: 'bg-gradient-to-br from-red-500 via-orange-500 to-amber-400',
    glowColor: 'rgba(239, 68, 68, 0.7)',
    iconName: 'Flame',
  },

  // === SKINS PRO (Abonnement Exclusif) ===
  {
    id: 'or-pur',
    name: 'Or Pur',
    description: 'Métal précieux. Réservé aux opérateurs d\'élite.',
    rarity: 'rare',
    category: 'pro',
    requirement: { type: 'pro' },
    visualClass: 'bg-gradient-to-br from-amber-400 to-yellow-500',
    glowColor: 'rgba(251, 191, 36, 0.6)',
    iconName: 'Crown',
  },
  {
    id: 'platine',
    name: 'Platine',
    description: 'Alliage noble. Brillance supérieure.',
    rarity: 'epic',
    category: 'pro',
    requirement: { type: 'pro' },
    visualClass: 'bg-gradient-to-br from-slate-300 to-gray-400',
    glowColor: 'rgba(203, 213, 225, 0.6)',
    iconName: 'Gem',
  },
  {
    id: 'diamant',
    name: 'Diamant',
    description: 'Carbone compressé. Indestructible et pur.',
    rarity: 'epic',
    category: 'pro',
    requirement: { type: 'pro' },
    visualClass: 'bg-gradient-to-br from-cyan-300 to-blue-400',
    glowColor: 'rgba(34, 211, 238, 0.6)',
    iconName: 'Diamond',
  },
  {
    id: 'nuit-obsidienne',
    name: 'Nuit Obsidienne',
    description: 'Ténèbres absolues. Absorption totale.',
    rarity: 'epic',
    category: 'pro',
    requirement: { type: 'pro' },
    visualClass: 'bg-gradient-to-br from-slate-800 to-gray-950',
    glowColor: 'rgba(30, 41, 59, 0.7)',
    iconName: 'Hexagon',
  },
  {
    id: 'aurore-boreale',
    name: 'Aurore Boréale',
    description: 'Lumière du nord. Phénomène magnétique capturé.',
    rarity: 'epic',
    category: 'pro',
    requirement: { type: 'pro' },
    visualClass: 'bg-gradient-to-br from-green-400 via-cyan-400 to-purple-500',
    glowColor: 'rgba(74, 222, 128, 0.5)',
    iconName: 'Sparkles',
  },
  {
    id: 'dieu-dore',
    name: 'Dieu Doré',
    description: 'Divinité métallique. Statut ultime des abonnés.',
    rarity: 'legendary',
    category: 'pro',
    requirement: { type: 'pro' },
    visualClass: 'bg-gradient-to-br from-amber-400 via-yellow-300 to-amber-600',
    glowColor: 'rgba(251, 191, 36, 0.7)',
    iconName: 'Trophy',
  },
  {
    id: 'cosmique',
    name: 'Cosmique',
    description: 'L\'univers dans vos circuits. Infini stellaire.',
    rarity: 'legendary',
    category: 'pro',
    requirement: { type: 'pro' },
    visualClass: 'bg-gradient-to-br from-purple-600 via-indigo-500 to-pink-500',
    glowColor: 'rgba(168, 85, 247, 0.6)',
    iconName: 'Star',
  },

  // === SKINS SPÉCIAUX (Top 100 / Compétitif) ===
  {
    id: 'elite',
    name: 'Élite Mondiale',
    description: 'Top 100 global. Les meilleurs opérateurs.',
    rarity: 'legendary',
    category: 'special',
    requirement: { type: 'top100' },
    visualClass: 'bg-gradient-to-br from-rose-500 to-pink-600',
    glowColor: 'rgba(244, 63, 94, 0.6)',
    iconName: 'Target',
  },
  {
    id: 'champion',
    name: 'Champion',
    description: 'Top 50 global. Légendes vivantes du système.',
    rarity: 'legendary',
    category: 'special',
    requirement: { type: 'top100' },
    visualClass: 'bg-gradient-to-br from-emerald-400 to-teal-500',
    glowColor: 'rgba(52, 211, 153, 0.6)',
    iconName: 'Trophy',
  },
  {
    id: 'predateur-apex',
    name: 'Prédateur Apex',
    description: 'Top 10 global. Sommet de la chaîne alimentaire.',
    rarity: 'legendary',
    category: 'special',
    requirement: { type: 'top100' },
    visualClass: 'bg-gradient-to-br from-red-600 via-red-800 to-gray-900',
    glowColor: 'rgba(185, 28, 28, 0.7)',
    iconName: 'Crosshair',
  },

  // === SKINS SUPPLÉMENTAIRES (Variété) ===
  {
    id: 'cristal-glace',
    name: 'Cristal de Glace',
    description: 'Température zéro absolu. Cryostase active.',
    rarity: 'rare',
    category: 'level',
    requirement: { type: 'level', value: 8 },
    visualClass: 'bg-gradient-to-br from-cyan-200 to-blue-300',
    glowColor: 'rgba(165, 243, 252, 0.5)',
    iconName: 'Snowflake',
  },
  {
    id: 'eruption-solaire',
    name: 'Éruption Solaire',
    description: 'Plasma de surface. Chaleur de 6000 degrés.',
    rarity: 'rare',
    category: 'level',
    requirement: { type: 'level', value: 13 },
    visualClass: 'bg-gradient-to-br from-yellow-400 to-orange-500',
    glowColor: 'rgba(250, 204, 21, 0.6)',
    iconName: 'Sun',
  },
];

// === RANK SYSTEM (French Grades) ===
export interface BioRank {
  id: string;
  name: string; // French
  description: string;
  monthsRequired: number;
  colorClass: string;
  badgeClass: string;
}

export const BIO_RANKS: BioRank[] = [
  {
    id: 'initiate',
    name: 'Initié',
    description: 'Nouveau dans le système. Formation en cours.',
    monthsRequired: 0,
    colorClass: 'text-gray-400',
    badgeClass: 'bg-gray-500/20 border-gray-500/30 text-gray-400',
  },
  {
    id: 'operator',
    name: 'Opérateur',
    description: 'Un mois d\'engagement. Protocoles maîtrisés.',
    monthsRequired: 1,
    colorClass: 'text-emerald-400',
    badgeClass: 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400',
  },
  {
    id: 'architect',
    name: 'Architecte',
    description: 'Trois mois de service. Structure solide.',
    monthsRequired: 3,
    colorClass: 'text-blue-400',
    badgeClass: 'bg-blue-500/20 border-blue-500/30 text-blue-400',
  },
  {
    id: 'titan',
    name: 'Titan',
    description: 'Un an de fidélité. Légende du système.',
    monthsRequired: 12,
    colorClass: 'text-amber-400',
    badgeClass: 'bg-gradient-to-r from-amber-500/20 to-red-500/20 border-amber-500/30 text-amber-400',
  },
];

// === HELPER FUNCTIONS ===

export function getSkinById(id: string): ArmorSkin | undefined {
  return SKINS_REGISTRY.find(skin => skin.id === id);
}

export function getSkinsByCategory(category: SkinCategory): ArmorSkin[] {
  return SKINS_REGISTRY.filter(skin => skin.category === category);
}

export function getSkinsByRarity(rarity: SkinRarity): ArmorSkin[] {
  return SKINS_REGISTRY.filter(skin => skin.rarity === rarity);
}

export function isSkinUnlocked(
  skin: ArmorSkin,
  userLevel: number,
  userStreak: number,
  isPro: boolean,
  unlockedSkins: string[]
): boolean {
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
      return isPro; // Simplified: PRO users get top100 access
    default:
      return false;
  }
}

export function getRequirementLabel(skin: ArmorSkin, userLevel: number, userStreak: number): string {
  const { type, value } = skin.requirement;
  
  switch (type) {
    case 'free':
      return 'DÉBLOQUÉ';
    case 'level':
      return `NIV. ${value} REQUIS (actuel: ${userLevel})`;
    case 'streak':
      return `SÉQUENCE ${value}J REQUISE (actuel: ${userStreak})`;
    case 'pro':
      return 'ACCÈS PRO REQUIS';
    case 'top100':
      return 'CLASSEMENT TOP 100';
    default:
      return '';
  }
}

export function getBioRank(subscriptionStartDate: string | null): BioRank {
  if (!subscriptionStartDate) {
    return BIO_RANKS[0]; // Initiate
  }
  
  const startDate = new Date(subscriptionStartDate);
  const now = new Date();
  const monthsDiff = (now.getFullYear() - startDate.getFullYear()) * 12 + 
                     (now.getMonth() - startDate.getMonth());
  
  // Find highest eligible rank
  let rank = BIO_RANKS[0];
  for (const r of BIO_RANKS) {
    if (monthsDiff >= r.monthsRequired) {
      rank = r;
    }
  }
  
  return rank;
}

// === RARITY STYLES ===
export const RARITY_STYLES: Record<SkinRarity, { bg: string; text: string; border: string; glow: string }> = {
  common: {
    bg: 'bg-gray-500/10',
    text: 'text-gray-400',
    border: 'border-gray-500/30',
    glow: 'shadow-gray-500/20',
  },
  rare: {
    bg: 'bg-blue-500/10',
    text: 'text-blue-400',
    border: 'border-blue-500/30',
    glow: 'shadow-blue-500/30',
  },
  epic: {
    bg: 'bg-purple-500/10',
    text: 'text-purple-400',
    border: 'border-purple-500/30',
    glow: 'shadow-purple-500/30',
  },
  legendary: {
    bg: 'bg-amber-500/10',
    text: 'text-amber-400',
    border: 'border-amber-500/30',
    glow: 'shadow-amber-500/30',
  },
};
