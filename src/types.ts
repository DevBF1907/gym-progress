export interface Exercise {
  id: string;
  name: string;
  category: 'Costas' | 'Peito' | 'Pernas' | 'Ombros' | 'Bíceps' | 'Tríceps' | string;
  minReps?: number;
  maxReps?: number;
}

export interface Workout {
  id: string;
  day: string;
  name: string;
  exercises: Exercise[];
}

export interface LogEntry {
  id: string;
  exerciseId: string;
  date: string; // YYYY-MM-DD
  weight: number; // in kg
  sets: number;
  reps: number;
}

export interface UserProfile {
  name: string;
  weight: number; // in kg
  height: number; // in cm
  goal: 'Hipertrofia' | 'Força' | 'Emagrecimento' | string;
}

export interface WireframeRoute {
  path: string;
  component: string;
  description: string;
}
