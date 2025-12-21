export type ProgramTier = 'RAPID_PATCH' | 'SYSTEM_REBOOT' | 'ARCHITECT_MODE';

export interface Session {
  day: number;
  title: string;
  subtitle: string;
  duration: string;
  clinicalGoal: string;
  audioCue: string;
  scientificRationale: string;
  steps: string[];
}

export interface Phase {
  name: string;
  days: [number, number];
}

export interface Program {
  id: ProgramTier;
  name: string;
  description: string;
  totalDays: number;
  phases: Phase[];
  sessions: Session[];
}

export const PROGRAMS: Record<ProgramTier, Program> = {
  RAPID_PATCH: {
    id: 'RAPID_PATCH',
    name: 'NIVO RAPID_PATCH',
    description: 'Protocole de récupération rapide - 7 jours',
    totalDays: 7,
    phases: [
      { name: 'Activation', days: [1, 3] },
      { name: 'Consolidation', days: [4, 7] },
    ],
    sessions: [
      {
        day: 1,
        title: 'Réveil Sensoriel',
        subtitle: 'PHASE 1 :: ACTIVATION',
        duration: '8 min',
        clinicalGoal: 'Réactiver la proprioception lombaire',
        audioCue: 'Imaginez votre colonne comme une antenne qui capte les signaux de votre corps.',
        scientificRationale: 'La proprioception diminue de 30% après 48h de sédentarité. Cette séance réactive les mécanorécepteurs.',
        steps: ['Respiration diaphragmatique', 'Scan corporel', 'Micro-mouvements'],
      },
      {
        day: 2,
        title: 'Libération Fasciale',
        subtitle: 'PHASE 1 :: ACTIVATION',
        duration: '10 min',
        clinicalGoal: 'Décompresser les tissus profonds',
        audioCue: 'Laissez la gravité faire le travail. Vous êtes un observateur.',
        scientificRationale: 'Le fascia thoraco-lombaire accumule des tensions. Cette séance utilise des techniques de relâchement myofascial.',
        steps: ['Étirement passif', 'Compression douce', 'Ondulations'],
      },
    ],
  },
  SYSTEM_REBOOT: {
    id: 'SYSTEM_REBOOT',
    name: 'NIVO SYSTEM_REBOOT',
    description: 'Reprogrammation complète du système - 21 jours',
    totalDays: 21,
    phases: [
      { name: 'Éveil', days: [1, 7] },
      { name: 'Reprogrammation', days: [8, 14] },
      { name: 'Intégration', days: [15, 21] },
    ],
    sessions: [
      {
        day: 1,
        title: 'Calibration Initiale',
        subtitle: 'PHASE 1 :: ÉVEIL',
        duration: '12 min',
        clinicalGoal: 'Établir une baseline de mobilité',
        audioCue: 'Votre corps est un système. Aujourd\'hui, nous faisons un diagnostic.',
        scientificRationale: 'La première session établit les paramètres de référence pour personnaliser le protocole.',
        steps: ['Test de mobilité', 'Activation neurale', 'Respiration', 'Ancrage'],
      },
      {
        day: 2,
        title: 'Déverrouillage Articulaire',
        subtitle: 'PHASE 1 :: ÉVEIL',
        duration: '15 min',
        clinicalGoal: 'Restaurer l\'amplitude de mouvement',
        audioCue: 'Chaque vertèbre peut bouger indépendamment. Retrouvez cette liberté.',
        scientificRationale: 'La mobilité segmentaire est essentielle pour une fonction optimale de la colonne.',
        steps: ['Rotations segmentaires', 'Flexion contrôlée', 'Extension progressive'],
      },
    ],
  },
  ARCHITECT_MODE: {
    id: 'ARCHITECT_MODE',
    name: 'NIVO ARCHITECT_MODE',
    description: 'Maintenance préventive à vie - 90 jours',
    totalDays: 90,
    phases: [
      { name: 'Fondations', days: [1, 30] },
      { name: 'Construction', days: [31, 60] },
      { name: 'Maîtrise', days: [61, 90] },
    ],
    sessions: [
      {
        day: 1,
        title: 'Architecture Posturale',
        subtitle: 'PHASE 1 :: FONDATIONS',
        duration: '20 min',
        clinicalGoal: 'Construire une posture optimale',
        audioCue: 'Vous êtes l\'architecte de votre corps. Chaque mouvement est une décision.',
        scientificRationale: 'Une posture optimale réduit de 60% la charge sur les disques intervertébraux.',
        steps: ['Analyse posturale', 'Correction active', 'Renforcement isométrique', 'Intégration dynamique'],
      },
    ],
  },
};

export function getPhaseLabel(day: number, programId: ProgramTier): string {
  const program = PROGRAMS[programId];
  const phase = program.phases.find(p => day >= p.days[0] && day <= p.days[1]);
  return phase ? `PHASE ${program.phases.indexOf(phase) + 1} :: ${phase.name.toUpperCase()}` : 'PHASE EN COURS';
}

export function getCurrentSession(day: number, programId: ProgramTier): Session | undefined {
  const program = PROGRAMS[programId];
  return program.sessions.find(s => s.day === day) || program.sessions[0];
}
