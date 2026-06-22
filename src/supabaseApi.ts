import { supabase } from './supabase';
import type { Exercise, Workout, LogEntry, UserProfile } from './types';

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

export async function signUp(email: string, password: string, name: string, weight?: number, height?: number, goal?: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { name, weight, height, goal },
    },
  });
  if (error) throw error;
  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getExercises(): Promise<Exercise[]> {
  const { data, error } = await supabase.from('exercises').select('*').order('name');
  if (error) throw error;
  return (data || []).map(ex => ({
    id: ex.id,
    name: ex.name,
    category: ex.category,
    minReps: ex.min_reps,
    maxReps: ex.max_reps,
  }));
}

export async function getWorkouts(): Promise<Workout[]> {
  const { data, error } = await supabase
    .from('workouts')
    .select('*, workout_exercises(exercise_id, exercises(*))')
    .order('day');
  if (error) throw error;

  return (data || []).map(w => ({
    id: w.id,
    day: w.day,
    name: w.name,
    exercises: (w.workout_exercises || [])
      .map((we: any) => we.exercises)
      .filter(Boolean)
      .map((ex: any) => ({
        id: ex.id,
        name: ex.name,
        category: ex.category,
        minReps: ex.min_reps,
        maxReps: ex.max_reps,
      })),
  }));
}

export async function getLogs(): Promise<LogEntry[]> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from('workout_logs')
    .select('*')
    .eq('user_id', user.id)
    .order('date', { ascending: false });
  if (error) throw error;

  return (data || []).map(log => ({
    id: log.id,
    exerciseId: log.exercise_id,
    date: log.date,
    weight: Number(log.weight),
    sets: log.sets,
    reps: log.reps,
  }));
}

export async function createLog(data: { exerciseId: string; date: string; weight: number; sets: number; reps: number }) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data: result, error } = await supabase
    .from('workout_logs')
    .insert({
      user_id: user.id,
      exercise_id: data.exerciseId,
      date: data.date,
      weight: data.weight,
      sets: data.sets,
      reps: data.reps,
    })
    .select()
    .single();
  if (error) throw error;

  return {
    id: result.id,
    exerciseId: result.exercise_id,
    date: result.date,
    weight: Number(result.weight),
    sets: result.sets,
    reps: result.reps,
  };
}

export async function deleteLog(id: string) {
  const { error } = await supabase.from('workout_logs').delete().eq('id', id);
  if (error) throw error;
}

export async function getProfile(): Promise<UserProfile | null> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();
  if (error) return null;

  return {
    name: data.name,
    weight: Number(data.weight),
    height: data.height,
    goal: data.goal,
  };
}

export async function updateProfile(profile: { name?: string; weight?: number; height?: number; goal?: string }) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { error } = await supabase
    .from('profiles')
    .update(profile)
    .eq('id', user.id);
  if (error) throw error;
}
