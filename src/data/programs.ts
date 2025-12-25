/**
 * NIVO PROGRAMS - Structure des protocoles SaaS
 * 
 * Architecture Freemium :
 * - DAILY_ROUTINE : Routine gratuite de maintenance (8 min)
 * - SPECIFIC_PROTOCOLS : Protocoles ciblés (Pro)
 * - PILOT_PROGRAMS : Programmes longs (Pro)
 */

// =============================================
// TYPES
// =============================================

export type RoutineType = 'daily_loop' | 'reset' | 'stiffness' | 'decompression' | 'emergency' | 'advanced';

export interface Exercise {
  id: string;
  name: string;
  description: string;
  duration_seconds: number;
  instructions: string[];
  scientific_basis: string;
  image_cue?: string;
  audio_cue?: string;
}

export interface RoutineStep {
  phase: string;
  phase_label: string;
  exercise: Exercise;
}

export interface Routine {
  id: string;
  type: RoutineType;
  name: string;
  subtitle: string;
  description: string;
  duration_minutes: number;
  focus: string;
  is_pro: boolean;
  locked_label?: string;
  steps: RoutineStep[];
  score_boost: number;
}

export interface Protocol {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  target_symptom: string;
  duration_minutes: number;
  is_pro: true;
  locked_label: string;
  routines: Routine[];
  trigger_condition?: string;
}

export interface PilotProgram {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  duration_weeks: number;
  focus: string;
  is_pro: true;
  locked_label: string;
  phases: {
    week_start: number;
    week_end: number;
    name: string;
    focus: string;
  }[];
}

// =============================================
// EXERCICES DE BASE
// =============================================

const EXERCISES: Record<string, Exercise> = {
  // Décompression (Foundation Training)
  FOUNDER: {
    id: 'founder',
    name: 'The Founder',
    description: 'Décompression active de la chaîne postérieure',
    duration_seconds: 60,
    instructions: [
      'Debout, pieds écartés largeur des hanches',
      'Poussez les hanches vers l\'arrière en gardant le dos droit',
      'Bras tendus vers l\'avant, paumes vers le haut',
      'Maintenez la tension dans les fessiers et ischio-jambiers',
      'Respirez profondément, tenez 30-60 secondes'
    ],
    scientific_basis: 'Foundation Training (Dr. Eric Goodman) - Décompression des disques lombaires par activation de la chaîne postérieure',
    audio_cue: 'Imaginez que vous repoussez un mur derrière vous avec vos hanches.'
  },
  
  // Mobilité (Wall Angel)
  WALL_ANGEL: {
    id: 'wall_angel',
    name: 'Seated Wall Angel',
    description: 'Mobilisation de la colonne thoracique et des épaules',
    duration_seconds: 90,
    instructions: [
      'Assis dos au mur, genoux pliés',
      'Collez tête, épaules, coudes et poignets au mur',
      'Glissez les bras vers le haut comme un ange des neiges',
      'Gardez tous les points de contact',
      '10 répétitions lentes et contrôlées'
    ],
    scientific_basis: 'Test clinique d\'extension thoracique - Améliore la mobilité scapulaire et réduit la cyphose',
    audio_cue: 'Chaque point de contact compte. Si vous perdez le contact, c\'est là que vous devez travailler.'
  },
  
  // Stabilité (McGill Big 3)
  CURL_UP: {
    id: 'curl_up',
    name: 'Curl-Up Modifié',
    description: 'Activation du transverse sans compression lombaire',
    duration_seconds: 60,
    instructions: [
      'Allongé sur le dos, un genou plié, l\'autre jambe tendue',
      'Placez les mains sous le bas du dos pour maintenir la courbe naturelle',
      'Soulevez légèrement la tête et les épaules (5cm max)',
      'Maintenez 10 secondes, répétez 5 fois',
      'Changez de jambe à mi-parcours'
    ],
    scientific_basis: 'Stuart McGill - Activation du core sans flexion lombaire excessive',
    audio_cue: 'Votre colonne ne bouge pas. Seuls votre tête et vos épaules se soulèvent.'
  },
  
  SIDE_PLANK: {
    id: 'side_plank',
    name: 'Side Plank',
    description: 'Renforcement du carré des lombes et obliques',
    duration_seconds: 60,
    instructions: [
      'Allongé sur le côté, coude sous l\'épaule',
      'Genoux pliés pour les débutants, jambes tendues pour avancés',
      'Soulevez les hanches pour créer une ligne droite',
      'Maintenez 10 secondes, 3 répétitions de chaque côté',
      'Respirez normalement'
    ],
    scientific_basis: 'Stuart McGill - Stabilisation latérale sans cisaillement vertébral',
    audio_cue: 'Votre corps est une planche rigide. Pas de rotation, pas d\'affaissement.'
  },
  
  BIRD_DOG: {
    id: 'bird_dog',
    name: 'Bird Dog',
    description: 'Coordination et stabilité dynamique du core',
    duration_seconds: 90,
    instructions: [
      'À quatre pattes, dos neutre',
      'Étendez le bras droit et la jambe gauche simultanément',
      'Maintenez l\'alignement du bassin',
      'Tenez 10 secondes, ramenez lentement',
      'Alternez : 5 répétitions de chaque côté'
    ],
    scientific_basis: 'Stuart McGill - Pattern moteur anti-rotation pour la stabilité lombo-pelvienne',
    audio_cue: 'Votre bassin est une table sur laquelle on pourrait poser un verre d\'eau. Ne le renversez pas.'
  },
  
  // Protocoles d'urgence
  EXTENSION_PRONE: {
    id: 'extension_prone',
    name: 'Extension Lombaire Passive',
    description: 'Centralisation du nucleus pulposus (McKenzie)',
    duration_seconds: 120,
    instructions: [
      'Allongé sur le ventre, mains à plat sous les épaules',
      'Poussez le haut du corps vers le haut en gardant le bassin au sol',
      'Montez progressivement - ne forcez pas la douleur',
      'Maintenez 2-3 secondes en haut',
      '10 répétitions, repos entre chaque'
    ],
    scientific_basis: 'Méthode McKenzie (MDT) - Centralisation discale pour les hernies postérieures',
    audio_cue: 'Si la douleur se centralise (remonte vers le centre du dos), vous êtes sur la bonne voie.'
  },
  
  SIDE_GLIDE: {
    id: 'side_glide',
    name: 'Side Glide',
    description: 'Correction de la déviation latérale (sciatique)',
    duration_seconds: 90,
    instructions: [
      'Debout contre un mur, côté douloureux vers le mur',
      'Glissez les hanches vers le mur sans bouger les épaules',
      'Maintenez 10-20 secondes',
      '10 répétitions',
      'Progression : ajouter une légère extension'
    ],
    scientific_basis: 'Méthode McKenzie - Correction du shift latéral avant extension',
    audio_cue: 'Poussez vos hanches vers le mur comme si vous essayiez de le déplacer.'
  }
};

// =============================================
// DAILY ROUTINE (FREE)
// =============================================

export const DAILY_ROUTINE: Routine = {
  id: 'daily_loop',
  type: 'daily_loop',
  name: 'Daily Loop',
  subtitle: 'ROUTINE QUOTIDIENNE',
  description: 'Votre dose quotidienne de maintenance vertébrale. 8 minutes pour maintenir votre système en équilibre.',
  duration_minutes: 8,
  focus: 'Maintenance',
  is_pro: false,
  score_boost: 5,
  steps: [
    {
      phase: 'decompress',
      phase_label: 'PHASE 1 :: DÉCOMPRESSION',
      exercise: EXERCISES.FOUNDER
    },
    {
      phase: 'mobilize',
      phase_label: 'PHASE 2 :: MOBILISATION',
      exercise: EXERCISES.WALL_ANGEL
    },
    {
      phase: 'stabilize',
      phase_label: 'PHASE 3 :: STABILISATION',
      exercise: EXERCISES.CURL_UP
    },
    {
      phase: 'stabilize',
      phase_label: 'PHASE 3 :: STABILISATION',
      exercise: EXERCISES.SIDE_PLANK
    },
    {
      phase: 'stabilize',
      phase_label: 'PHASE 3 :: STABILISATION',
      exercise: EXERCISES.BIRD_DOG
    }
  ]
};

// =============================================
// SPECIFIC PROTOCOLS (PRO)
// =============================================

export const SPECIFIC_PROTOCOLS: Protocol[] = [
  {
    id: 'emergency_sciatica',
    name: 'Protocole Urgence Sciatique',
    subtitle: 'INTERVENTION CIBLÉE',
    description: 'Protocole McKenzie pour centraliser la douleur sciatique et réduire la pression sur le nerf.',
    target_symptom: 'Douleur irradiant dans la jambe (sciatique)',
    duration_minutes: 15,
    is_pro: true,
    locked_label: 'Débloquer avec NIVO Pro',
    trigger_condition: 'pain_vas > 60 AND symptom_type = sciatica',
    routines: [
      {
        id: 'reset_sciatica',
        type: 'emergency',
        name: 'Reset Sciatique',
        subtitle: 'MCKENZIE PROTOCOL',
        description: 'Séquence de centralisation pour sciatique aiguë',
        duration_minutes: 15,
        focus: 'Centralisation',
        is_pro: true,
        locked_label: 'Débloquer avec NIVO Pro',
        score_boost: 10,
        steps: [
          {
            phase: 'correction',
            phase_label: 'PHASE 1 :: CORRECTION SHIFT',
            exercise: EXERCISES.SIDE_GLIDE
          },
          {
            phase: 'extension',
            phase_label: 'PHASE 2 :: EXTENSION',
            exercise: EXERCISES.EXTENSION_PRONE
          }
        ]
      }
    ]
  },
  {
    id: 'text_neck',
    name: 'Protocole Cou Texto',
    subtitle: 'RESET CERVICAL',
    description: 'Correction de la posture "text neck" pour les travailleurs du digital.',
    target_symptom: 'Douleurs cervicales, raideur de la nuque',
    duration_minutes: 10,
    is_pro: true,
    locked_label: 'Débloquer avec NIVO Pro',
    routines: [
      {
        id: 'reset_neck',
        type: 'reset',
        name: 'Reset Cervical',
        subtitle: 'MOBILITÉ THORACIQUE',
        description: 'Amélioration de l\'extension thoracique pour soulager les cervicales',
        duration_minutes: 10,
        focus: 'Mobilité',
        is_pro: true,
        locked_label: 'Débloquer avec NIVO Pro',
        score_boost: 8,
        steps: [
          {
            phase: 'mobilize',
            phase_label: 'PHASE 1 :: MOBILISATION',
            exercise: EXERCISES.WALL_ANGEL
          },
          {
            phase: 'decompress',
            phase_label: 'PHASE 2 :: DÉCOMPRESSION',
            exercise: EXERCISES.FOUNDER
          }
        ]
      }
    ]
  },
  {
    id: 'locked_low_back',
    name: 'Protocole Bas du Dos Bloqué',
    subtitle: 'DÉVERROUILLAGE LOMBAIRE',
    description: 'Séquence pour débloquer un dos lombaire rigide après une longue période assise.',
    target_symptom: 'Raideur lombaire matinale, difficulté à se lever',
    duration_minutes: 12,
    is_pro: true,
    locked_label: 'Débloquer avec NIVO Pro',
    routines: [
      {
        id: 'unlock_lumbar',
        type: 'reset',
        name: 'Déverrouillage Lombaire',
        subtitle: 'MCKENZIE + MCGILL',
        description: 'Combinaison d\'extension et de stabilisation',
        duration_minutes: 12,
        focus: 'Déverrouillage',
        is_pro: true,
        locked_label: 'Débloquer avec NIVO Pro',
        score_boost: 8,
        steps: [
          {
            phase: 'extension',
            phase_label: 'PHASE 1 :: EXTENSION',
            exercise: EXERCISES.EXTENSION_PRONE
          },
          {
            phase: 'decompress',
            phase_label: 'PHASE 2 :: DÉCOMPRESSION',
            exercise: EXERCISES.FOUNDER
          },
          {
            phase: 'stabilize',
            phase_label: 'PHASE 3 :: STABILISATION',
            exercise: EXERCISES.BIRD_DOG
          }
        ]
      }
    ]
  }
];

// =============================================
// PILOT PROGRAMS (PRO - LONG TERM)
// =============================================

export const PILOT_PROGRAMS: PilotProgram[] = [
  {
    id: 'stability_cycle',
    name: 'Cycle Stabilité 6 Semaines',
    subtitle: 'PROGRAMME PROGRESSIF',
    description: 'Programme de 6 semaines pour construire une stabilité lombaire durable basée sur les Big 3 de McGill.',
    duration_weeks: 6,
    focus: 'Stabilité Core',
    is_pro: true,
    locked_label: 'Débloquer avec NIVO Pro',
    phases: [
      { week_start: 1, week_end: 2, name: 'Fondations', focus: 'Apprentissage des patterns moteurs' },
      { week_start: 3, week_end: 4, name: 'Construction', focus: 'Augmentation du volume et de l\'endurance' },
      { week_start: 5, week_end: 6, name: 'Intégration', focus: 'Automatisation et maintenance' }
    ]
  },
  {
    id: 'travel_protocol',
    name: 'Protocole Voyage',
    subtitle: 'MOBILITÉ EN DÉPLACEMENT',
    description: 'Routines adaptées pour les longs trajets en avion, train ou voiture.',
    duration_weeks: 0, // On-demand
    focus: 'Mobilité voyage',
    is_pro: true,
    locked_label: 'Débloquer avec NIVO Pro',
    phases: []
  },
  {
    id: 'deep_work',
    name: 'Deep Work Protocol',
    subtitle: 'PERFORMANCE COGNITIVE',
    description: 'Routines de micro-pauses pour les sessions de travail intense (Pomodoro intégré).',
    duration_weeks: 0, // On-demand
    focus: 'Productivité',
    is_pro: true,
    locked_label: 'Débloquer avec NIVO Pro',
    phases: []
  }
];

// =============================================
// UTILITAIRES
// =============================================

export function getRoutineById(id: string): Routine | undefined {
  if (id === 'daily_loop') return DAILY_ROUTINE;
  
  for (const protocol of SPECIFIC_PROTOCOLS) {
    const routine = protocol.routines.find(r => r.id === id);
    if (routine) return routine;
  }
  
  return undefined;
}

export function getProtocolById(id: string): Protocol | undefined {
  return SPECIFIC_PROTOCOLS.find(p => p.id === id);
}

export function getPilotProgramById(id: string): PilotProgram | undefined {
  return PILOT_PROGRAMS.find(p => p.id === id);
}

export function getAllProContent(): { protocols: Protocol[]; pilots: PilotProgram[] } {
  return {
    protocols: SPECIFIC_PROTOCOLS,
    pilots: PILOT_PROGRAMS
  };
}

export function getLockedContent(): { protocols: Protocol[]; pilots: PilotProgram[] } {
  return {
    protocols: SPECIFIC_PROTOCOLS.filter(p => p.is_pro),
    pilots: PILOT_PROGRAMS.filter(p => p.is_pro)
  };
}
