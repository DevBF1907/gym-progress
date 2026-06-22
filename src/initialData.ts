import { Workout, Exercise, LogEntry, UserProfile } from './types';

export const INITIAL_EXERCISES: Exercise[] = [
  // Costas
  { id: 'ex-1', name: 'Puxada Frontal', category: 'Costas', minReps: 8, maxReps: 12 },
  { id: 'ex-2', name: 'Remada Aberta Máquina', category: 'Costas', minReps: 6, maxReps: 8 },
  { id: 'ex-3', name: 'Remada Alta', category: 'Costas', minReps: 6, maxReps: 8 },
  { id: 'ex-4', name: 'Remada Baixa', category: 'Costas', minReps: 6, maxReps: 8 },
  { id: 'ex-5', name: 'Remada Unilateral', category: 'Costas', minReps: 8, maxReps: 12 },

  // Peito
  { id: 'ex-6', name: 'Supino Reto', category: 'Peito', minReps: 6, maxReps: 8 },
  { id: 'ex-7', name: 'Supino Inclinado com Halteres', category: 'Peito', minReps: 6, maxReps: 8 },
  { id: 'ex-8', name: 'Paralelas', category: 'Peito', minReps: 8, maxReps: 12 },
  { id: 'ex-9', name: 'Crossover', category: 'Peito', minReps: 10, maxReps: 15 },

  // Ombros
  { id: 'ex-10', name: 'Desenvolvimento Máquina', category: 'Ombros', minReps: 6, maxReps: 8 },
  { id: 'ex-11', name: 'Elevação Lateral', category: 'Ombros', minReps: 10, maxReps: 15 },
  { id: 'ex-12', name: 'Elevação Lateral com Halteres', category: 'Ombros', minReps: 10, maxReps: 15 },
  { id: 'ex-13', name: 'Elevação Lateral Unilateral na Polia', category: 'Ombros', minReps: 10, maxReps: 15 },
  { id: 'ex-14', name: 'Fly Inverso', category: 'Ombros', minReps: 10, maxReps: 15 },
  { id: 'ex-15', name: 'Crucifixo Inverso', category: 'Ombros', minReps: 10, maxReps: 15 },

  // Tríceps
  { id: 'ex-16', name: 'Tríceps Francês', category: 'Tríceps', minReps: 10, maxReps: 15 },
  { id: 'ex-17', name: 'Tríceps Testa na Polia', category: 'Tríceps', minReps: 10, maxReps: 15 },
  { id: 'ex-18', name: 'Tríceps na Polia', category: 'Tríceps', minReps: 10, maxReps: 15 },

  // Bíceps
  { id: 'ex-19', name: 'Rosca Inclinada', category: 'Bíceps', minReps: 10, maxReps: 15 },
  { id: 'ex-20', name: 'Rosca Alternada com Halteres', category: 'Bíceps', minReps: 10, maxReps: 15 },
  { id: 'ex-21', name: 'Rosca na Polia', category: 'Bíceps', minReps: 10, maxReps: 15 },
  { id: 'ex-22', name: 'Rosca Martelo', category: 'Bíceps', minReps: 10, maxReps: 15 },

  // Pernas
  { id: 'ex-23', name: 'Hack Squat', category: 'Pernas', minReps: 6, maxReps: 8 },
  { id: 'ex-24', name: 'Leg Press', category: 'Pernas', minReps: 6, maxReps: 8 },
  { id: 'ex-25', name: 'Agachamento Búlgaro', category: 'Pernas', minReps: 8, maxReps: 12 },
  { id: 'ex-26', name: 'Stiff', category: 'Pernas', minReps: 8, maxReps: 12 },
  { id: 'ex-27', name: 'Cadeira Flexora', category: 'Pernas', minReps: 10, maxReps: 15 },
  { id: 'ex-28', name: 'Abdutora', category: 'Pernas', minReps: 10, maxReps: 15 },
  { id: 'ex-29', name: 'Máquina para Glúteos', category: 'Pernas', minReps: 10, maxReps: 15 },
  { id: 'ex-30', name: 'Panturrilha', category: 'Pernas', minReps: 10, maxReps: 15 },
];

export const INITIAL_WORKOUTS: Workout[] = [
  {
    id: 'w-seg',
    day: 'Segunda-feira',
    name: 'Costas e Bíceps',
    exercises: [
      INITIAL_EXERCISES[0], // Puxada Frontal
      INITIAL_EXERCISES[1], // Remada Aberta Máquina
      INITIAL_EXERCISES[3], // Remada Baixa
      INITIAL_EXERCISES[4], // Remada Unilateral
      INITIAL_EXERCISES[19], // Rosca Alternada
      INITIAL_EXERCISES[13], // Fly Inverso
    ]
  },
  {
    id: 'w-ter',
    day: 'Terça-feira',
    name: 'Peito e Tríceps',
    exercises: [
      INITIAL_EXERCISES[5],  // Supino Reto
      INITIAL_EXERCISES[6],  // Supino Inclinado
      INITIAL_EXERCISES[7],  // Paralelas
      INITIAL_EXERCISES[8],  // Crossover
      INITIAL_EXERCISES[16], // Tríceps Testa
      INITIAL_EXERCISES[10], // Elevação Lateral
      INITIAL_EXERCISES[9],  // Desenvolvimento Máquina
    ]
  },
  {
    id: 'w-qui',
    day: 'Quinta-feira',
    name: 'Perna Completa',
    exercises: [
      INITIAL_EXERCISES[22], // Hack Squat
      INITIAL_EXERCISES[23], // Leg Press
      INITIAL_EXERCISES[24], // Agachamento Búlgaro
      INITIAL_EXERCISES[25], // Stiff
      INITIAL_EXERCISES[26], // Cadeira Flexora
      INITIAL_EXERCISES[27], // Abdutora
      INITIAL_EXERCISES[28], // Máquina para Glúteos
      INITIAL_EXERCISES[29], // Panturrilha
    ]
  },
  {
    id: 'w-sex',
    day: 'Sexta-feira',
    name: 'Ombros e Braços',
    exercises: [
      INITIAL_EXERCISES[12], // Elevação Lateral Unilateral na Polia
      INITIAL_EXERCISES[11], // Elevação Lateral com Halteres
      INITIAL_EXERCISES[14], // Crucifixo Inverso
      INITIAL_EXERCISES[9],  // Desenvolvimento Máquina
      INITIAL_EXERCISES[18], // Rosca Inclinada
      INITIAL_EXERCISES[20], // Rosca na Polia
      INITIAL_EXERCISES[21], // Rosca Martelo
      INITIAL_EXERCISES[15], // Tríceps Francês
      INITIAL_EXERCISES[16], // Tríceps Testa na Polia
      INITIAL_EXERCISES[17], // Tríceps na Polia
    ]
  }
];

export const INITIAL_LOGS: LogEntry[] = [
  // === Supino Reto (ex-6) ===
  { id: 'log-1', exerciseId: 'ex-6', date: '2026-06-01', weight: 50, sets: 4, reps: 6 },
  { id: 'log-2', exerciseId: 'ex-6', date: '2026-06-08', weight: 52, sets: 4, reps: 6 },
  { id: 'log-3', exerciseId: 'ex-6', date: '2026-06-15', weight: 54, sets: 4, reps: 6 },

  // === Puxada Frontal (ex-1) ===
  { id: 'log-4', exerciseId: 'ex-1', date: '2026-06-01', weight: 40, sets: 4, reps: 10 },
  { id: 'log-5', exerciseId: 'ex-1', date: '2026-06-08', weight: 42, sets: 4, reps: 10 },
  { id: 'log-6', exerciseId: 'ex-1', date: '2026-06-15', weight: 45, sets: 4, reps: 8 },

  // === Remada Aberta Máquina (ex-2) ===
  { id: 'log-7', exerciseId: 'ex-2', date: '2026-06-01', weight: 45, sets: 4, reps: 6 },
  { id: 'log-8', exerciseId: 'ex-2', date: '2026-06-08', weight: 50, sets: 4, reps: 6 },
  { id: 'log-9', exerciseId: 'ex-2', date: '2026-06-15', weight: 55, sets: 4, reps: 6 },

  // === Rosca Alternada (ex-20) ===
  { id: 'log-10', exerciseId: 'ex-20', date: '2026-06-02', weight: 14, sets: 3, reps: 12 },
  { id: 'log-11', exerciseId: 'ex-20', date: '2026-06-09', weight: 16, sets: 3, reps: 10 },
  { id: 'log-12', exerciseId: 'ex-20', date: '2026-06-16', weight: 16, sets: 3, reps: 12 },

  // === Fly Inverso (ex-14) ===
  { id: 'log-13', exerciseId: 'ex-14', date: '2026-06-01', weight: 35, sets: 3, reps: 12 },
  { id: 'log-14', exerciseId: 'ex-14', date: '2026-06-08', weight: 38, sets: 3, reps: 12 },
  { id: 'log-15', exerciseId: 'ex-14', date: '2026-06-15', weight: 40, sets: 3, reps: 10 },

  // === Hack Squat (ex-23) ===
  { id: 'log-16', exerciseId: 'ex-23', date: '2026-06-04', weight: 45, sets: 4, reps: 8 },
  { id: 'log-17', exerciseId: 'ex-23', date: '2026-06-11', weight: 50, sets: 4, reps: 8 },
  { id: 'log-18', exerciseId: 'ex-23', date: '2026-06-18', weight: 50, sets: 4, reps: 6 },

  // === Leg Press (ex-24) ===
  { id: 'log-19', exerciseId: 'ex-24', date: '2026-06-04', weight: 130, sets: 4, reps: 8 },
  { id: 'log-20', exerciseId: 'ex-24', date: '2026-06-11', weight: 135, sets: 4, reps: 8 },
  { id: 'log-21', exerciseId: 'ex-24', date: '2026-06-18', weight: 140, sets: 4, reps: 8 },

  // === Elevação Lateral (ex-11) ===
  { id: 'log-22', exerciseId: 'ex-11', date: '2026-06-02', weight: 8, sets: 3, reps: 15 },
  { id: 'log-23', exerciseId: 'ex-11', date: '2026-06-09', weight: 10, sets: 3, reps: 12 },
  { id: 'log-24', exerciseId: 'ex-11', date: '2026-06-16', weight: 10, sets: 3, reps: 15 },

  // === Desenvolvimento Máquina (ex-10) ===
  { id: 'log-25', exerciseId: 'ex-10', date: '2026-06-02', weight: 18, sets: 4, reps: 8 },
  { id: 'log-26', exerciseId: 'ex-10', date: '2026-06-09', weight: 20, sets: 4, reps: 8 },
  { id: 'log-27', exerciseId: 'ex-10', date: '2026-06-16', weight: 20, sets: 4, reps: 6 },

  // === Tríceps Testa na Polia (ex-17) ===
  { id: 'log-28', exerciseId: 'ex-17', date: '2026-06-02', weight: 50, sets: 3, reps: 12 },
  { id: 'log-29', exerciseId: 'ex-17', date: '2026-06-09', weight: 55, sets: 3, reps: 10 },
  { id: 'log-30', exerciseId: 'ex-17', date: '2026-06-16', weight: 55, sets: 3, reps: 12 },

  // === Stiff (ex-26) ===
  { id: 'log-31', exerciseId: 'ex-26', date: '2026-06-04', weight: 45, sets: 4, reps: 10 },
  { id: 'log-32', exerciseId: 'ex-26', date: '2026-06-11', weight: 50, sets: 4, reps: 10 },
  { id: 'log-33', exerciseId: 'ex-26', date: '2026-06-18', weight: 50, sets: 4, reps: 8 },
];

export const INITIAL_PROFILE: UserProfile = {
  name: 'Brenno',
  weight: 77,
  height: 170,
  goal: 'Hipertrofia'
};

export function getSavedState() {
  const profile = localStorage.getItem('gym_profile');
  const logs = localStorage.getItem('gym_logs');
  const exercises = localStorage.getItem('gym_exercises');
  const workouts = localStorage.getItem('gym_workouts');

  return {
    profile: profile ? JSON.parse(profile) : INITIAL_PROFILE,
    logs: logs ? JSON.parse(logs) : INITIAL_LOGS,
    exercises: exercises ? JSON.parse(exercises) : INITIAL_EXERCISES,
    workouts: workouts ? JSON.parse(workouts) : INITIAL_WORKOUTS,
  };
}

export function saveState(profile: UserProfile, logs: LogEntry[], exercises: Exercise[], workouts: Workout[]) {
  localStorage.setItem('gym_profile', JSON.stringify(profile));
  localStorage.setItem('gym_logs', JSON.stringify(logs));
  localStorage.setItem('gym_exercises', JSON.stringify(exercises));
  localStorage.setItem('gym_workouts', JSON.stringify(workouts));
}
