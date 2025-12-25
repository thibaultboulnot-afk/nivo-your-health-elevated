/**
 * NIVO ENGINE - Moteur de calcul du NIVO Score
 * 
 * Algorithme propriétaire basé sur 3 indices pondérés :
 * - Indice Subjectif (45%) : Douleur, fatigue, raideur (VAS inversé)
 * - Indice Fonctionnel (30%) : Tests physiques (doigts-sol, wall angel, planche)
 * - Indice de Charge (25%) : Pénalité sédentaire exponentielle
 */

// =============================================
// TYPES
// =============================================

export interface DailyLog {
  pain_vas: number;        // 0-100 (0 = pas de douleur)
  fatigue_vas: number;     // 0-100 (0 = pas de fatigue)
  stiffness_vas: number;   // 0-100 (0 = pas de raideur)
  hours_seated: number;    // Heures assises dans la journée
  stress_level: number;    // 1-5
}

export interface PhysicalAssessment {
  finger_floor_distance_cm: number;  // Distance doigts-sol (0 = touche le sol)
  wall_angel_contacts: number;       // Points de contact (0-5 : tête, épaules, coudes, poignets, bas du dos)
  mcgill_plank_seconds: number;      // Temps en secondes
}

export interface NivoScoreResult {
  globalScore: number;
  details: {
    subj: number;
    func: number;
    load: number;
  };
  status: 'critical' | 'warning' | 'stable' | 'optimal';
  recommendation: string;
}

// =============================================
// CONSTANTES DE PONDÉRATION
// =============================================

export const WEIGHT_SUBJ = 0.45;
export const WEIGHT_FUNC = 0.30;
export const WEIGHT_LOAD = 0.25;

// Decay rate quotidien (perte de points si pas de routine)
export const DAILY_DECAY_RATE = 2;

// =============================================
// FONCTIONS UTILITAIRES
// =============================================

/**
 * Clamp une valeur entre min et max
 */
function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

/**
 * Normalise une valeur sur 100
 */
function normalize(value: number, minInput: number, maxInput: number): number {
  if (maxInput === minInput) return 100;
  const normalized = ((value - minInput) / (maxInput - minInput)) * 100;
  return clamp(normalized, 0, 100);
}

// =============================================
// CALCUL DES SOUS-INDICES
// =============================================

/**
 * Calcul de l'Indice Subjectif (W_1 = 0.45)
 * Inverse les valeurs VAS car 0 douleur = 100 santé
 */
export function calculateSubjectiveIndex(log: DailyLog): number {
  const painScore = 100 - log.pain_vas;
  const fatigueScore = 100 - log.fatigue_vas;
  const stiffnessScore = 100 - log.stiffness_vas;
  
  // Moyenne pondérée : douleur compte plus
  const weightedScore = (painScore * 0.5) + (stiffnessScore * 0.3) + (fatigueScore * 0.2);
  
  return clamp(Math.round(weightedScore), 0, 100);
}

/**
 * Calcul de l'Indice Fonctionnel (W_2 = 0.30)
 * Basé sur les tests physiques auto-administrés
 */
export function calculateFunctionalIndex(assessment: PhysicalAssessment): number {
  // Distance doigts-sol : 0cm = 100pts, 30cm+ = 0pts
  const fingerFloorScore = normalize(
    30 - clamp(assessment.finger_floor_distance_cm, 0, 30),
    0,
    30
  );
  
  // Wall Angel : 5 contacts = 100pts, 0 contacts = 0pts
  const wallAngelScore = (assessment.wall_angel_contacts / 5) * 100;
  
  // Planche McGill : 60s+ = 100pts, 0s = 0pts
  const plankScore = normalize(
    clamp(assessment.mcgill_plank_seconds, 0, 60),
    0,
    60
  );
  
  // Moyenne équipondérée des 3 tests
  const averageScore = (fingerFloorScore + wallAngelScore + plankScore) / 3;
  
  return clamp(Math.round(averageScore), 0, 100);
}

/**
 * Calcul de l'Indice de Charge (W_3 = 0.25)
 * Pénalité exponentielle après 2h assises : 1.5^(heures - 2)
 */
export function calculateLoadIndex(log: DailyLog): number {
  const hoursSeated = clamp(log.hours_seated, 0, 16);
  
  // Pénalité sédentaire exponentielle
  let sedentaryPenalty = 0;
  if (hoursSeated > 2) {
    sedentaryPenalty = Math.pow(1.5, hoursSeated - 2);
  }
  
  // Pénalité de stress (1-5 -> 0-20 points de malus)
  const stressPenalty = ((log.stress_level - 1) / 4) * 20;
  
  // Score final = 100 - pénalités
  const loadScore = 100 - sedentaryPenalty - stressPenalty;
  
  return clamp(Math.round(loadScore), 0, 100);
}

// =============================================
// FONCTION PRINCIPALE
// =============================================

/**
 * Calcule le NIVO Score global basé sur les 3 indices pondérés
 */
export function calculateNivoScore(
  log: DailyLog,
  assessment: PhysicalAssessment
): NivoScoreResult {
  // Calcul des sous-indices
  const subj = calculateSubjectiveIndex(log);
  const func = calculateFunctionalIndex(assessment);
  const load = calculateLoadIndex(log);
  
  // Score global pondéré
  const globalScore = Math.round(
    (subj * WEIGHT_SUBJ) + (func * WEIGHT_FUNC) + (load * WEIGHT_LOAD)
  );
  
  // Détermination du statut
  let status: NivoScoreResult['status'];
  let recommendation: string;
  
  if (globalScore < 40) {
    status = 'critical';
    recommendation = 'Votre système nécessite une attention immédiate. Protocole d\'urgence recommandé.';
  } else if (globalScore < 60) {
    status = 'warning';
    recommendation = 'Des signes de tension détectés. Routine de maintenance recommandée.';
  } else if (globalScore < 80) {
    status = 'stable';
    recommendation = 'Système stable. Continuez votre routine quotidienne.';
  } else {
    status = 'optimal';
    recommendation = 'Performance optimale. Mode maintenance préventive.';
  }
  
  return {
    globalScore: clamp(globalScore, 0, 100),
    details: { subj, func, load },
    status,
    recommendation
  };
}

/**
 * Applique le decay rate quotidien au score
 * Appelé chaque matin pour forcer l'engagement
 */
export function applyDailyDecay(currentScore: number): number {
  return clamp(currentScore - DAILY_DECAY_RATE, 0, 100);
}

/**
 * Calcule le boost de score après une routine complétée
 */
export function calculateRoutineBoost(
  routineType: 'daily_loop' | 'reset' | 'stiffness' | 'decompression' | 'emergency' | 'advanced',
  durationSeconds: number
): number {
  const baseBoosts: Record<string, number> = {
    daily_loop: 5,
    reset: 8,
    stiffness: 8,
    decompression: 6,
    emergency: 10,
    advanced: 12
  };
  
  const baseBoost = baseBoosts[routineType] || 5;
  
  // Bonus si durée > durée minimale attendue
  const durationBonus = durationSeconds >= 480 ? 2 : 0; // 8 min = 480s
  
  return baseBoost + durationBonus;
}

/**
 * Détermine si un paywall contextuel doit s'afficher
 */
export function checkPaywallTrigger(
  log: DailyLog,
  scoreHistory: number[],
  isPro: boolean
): { trigger: 'crisis' | 'plateau' | null; message: string | null } {
  if (isPro) {
    return { trigger: null, message: null };
  }
  
  // Trigger Crise : VAS Douleur > 60/100
  if (log.pain_vas > 60) {
    return {
      trigger: 'crisis',
      message: 'Douleur élevée détectée. Débloquez le Protocole Urgence pour un soulagement ciblé.'
    };
  }
  
  // Trigger Plateau : Score stagne depuis 14 jours
  if (scoreHistory.length >= 14) {
    const last14 = scoreHistory.slice(-14);
    const variance = Math.max(...last14) - Math.min(...last14);
    if (variance < 5) {
      return {
        trigger: 'plateau',
        message: 'Progression stagnante. Passez au Cycle Stabilité Avancé pour débloquer votre potentiel.'
      };
    }
  }
  
  return { trigger: null, message: null };
}
