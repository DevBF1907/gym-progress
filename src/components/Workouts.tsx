import React, { useState } from 'react';
import { ChevronLeft, Dumbbell, Play, CheckCircle, Calendar, Plus, Save, Clock, HelpCircle } from 'lucide-react';
import { Workout, LogEntry, Exercise } from '../types';

interface WorkoutsProps {
  workouts: Workout[];
  logs: LogEntry[];
  onSaveLog: (exerciseId: string, weight: number, sets: number, reps: number) => void;
  selectedWorkout: Workout | null;
  setSelectedWorkout: (workout: Workout | null) => void;
}

export default function Workouts({
  workouts,
  logs,
  onSaveLog,
  selectedWorkout,
  setSelectedWorkout,
}: WorkoutsProps) {
  // Local transient states for current inputs per exercise so they don't clobber each other
  const [inputs, setInputs] = useState<{
    [exerciseId: string]: { weight: number; sets: number; reps: number; saved: boolean };
  }>({});

  // Helper to find latest log entry of an exercise
  const getLastLog = (exerciseId: string): LogEntry | undefined => {
    const exerciseLogs = logs.filter(l => l.exerciseId === exerciseId);
    if (exerciseLogs.length === 0) return undefined;
    // Sort descending by date
    return [...exerciseLogs].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
  };

  // Helper to initialize inputs if not already edited
  const getExerciseInput = (exerciseId: string) => {
    if (inputs[exerciseId]) {
      return inputs[exerciseId];
    }
    const lastLog = getLastLog(exerciseId);
    // Standard defaults or copy of last log to facilitate overload!
    return {
      weight: lastLog ? lastLog.weight : 20,
      sets: lastLog ? lastLog.sets : 4,
      reps: lastLog ? lastLog.reps : 10,
      saved: false,
    };
  };

  const updateField = (exerciseId: string, field: 'weight' | 'sets' | 'reps', value: number) => {
    const current = getExerciseInput(exerciseId);
    let finalValue = Math.max(0, value);
    if (field === 'weight') {
      // Allow decimals, but limit to 1 decimal place or nice step
      finalValue = parseFloat(finalValue.toFixed(1));
    } else {
      finalValue = Math.round(finalValue);
    }

    setInputs({
      ...inputs,
      [exerciseId]: {
        ...current,
        [field]: finalValue,
        saved: false, // reset saved flag if they make edits
      },
    });
  };

  const handleSave = (exerciseId: string) => {
    const current = getExerciseInput(exerciseId);
    onSaveLog(exerciseId, current.weight, current.sets, current.reps);
    setInputs({
      ...inputs,
      [exerciseId]: {
        ...current,
        saved: true,
      },
    });

    // Remove the saved message after 3 seconds
    setTimeout(() => {
      setInputs(prev => {
        if (!prev[exerciseId]) return prev;
        return {
          ...prev,
          [exerciseId]: {
            ...prev[exerciseId],
            saved: false,
          },
        };
      });
    }, 3000);
  };

  // Icon selectors based on weekday
  const getWorkoutIconColor = (day: string) => {
    if (day.startsWith('Segunda')) return 'text-brand bg-brand/10 border-brand/20';
    if (day.startsWith('Terça')) return 'text-sky-400 bg-sky-400/10 border-sky-400/20';
    if (day.startsWith('Quinta')) return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
    return 'text-amber-400 bg-amber-400/10 border-amber-400/20';
  };

  return (
    <div className="space-y-6 text-left">
      {!selectedWorkout ? (
        // Master view: List of workouts
        <div className="space-y-4">
          <div>
            <h2 className="text-2xl font-display font-extrabold text-white">Treinos</h2>
            <p className="text-xs text-slate-400 mt-1">
              Selecione o treino de hoje para registrar suas cargas.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            {workouts.map(workout => {
              const borderColors = getWorkoutIconColor(workout.day);
              return (
                <div
                  key={workout.id}
                  onClick={() => setSelectedWorkout(workout)}
                  className="bg-card-bg border border-card-border rounded-2xl p-5 hover:border-brand/40 transition-all cursor-pointer group hover:-translate-y-0.5 relative overflow-hidden"
                >
                  <div className="flex justify-between items-start">
                    <div className="space-y-3">
                      <div className={`inline-flex px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider border ${borderColors}`}>
                        {workout.day}
                      </div>
                      <div>
                        <h3 className="text-lg font-display font-bold text-white group-hover:text-brand transition">
                          {workout.name}
                        </h3>
                        <p className="text-xs text-slate-400 mt-1">
                          {workout.exercises.map(e => e.name.split(' ')[0]).join(', ')}...
                        </p>
                      </div>
                    </div>

                    <div className="w-10 h-10 bg-slate-900 border border-card-border rounded-xl flex items-center justify-center text-slate-400 group-hover:text-brand group-hover:bg-brand/10 group-hover:border-brand/20 transition duration-300">
                      <Play className="w-4 h-4 fill-current ml-0.5" />
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-card-border flex items-center justify-between text-2xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <Dumbbell className="w-3.5 h-3.5" />
                      {workout.exercises.length} exercícios
                    </span>
                    <span className="text-brand">Iniciar registro</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        // Detail view: List exercises within selected workout & log them
        <div className="space-y-6">
          <button
            onClick={() => setSelectedWorkout(null)}
            className="inline-flex items-center space-x-2 text-xs font-semibold text-slate-400 hover:text-white transition bg-slate-900 px-3 py-1.5 rounded-lg border border-card-border"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Voltar</span>
          </button>

          <div>
            <div className="flex items-center space-x-2.5">
              <span className="text-2xs bg-brand/10 border border-brand/20 text-brand px-2.5 py-0.5 rounded-full font-mono font-bold uppercase tracking-wider">
                {selectedWorkout.day}
              </span>
            </div>
            <h2 className="text-2xl font-display font-black text-white mt-1">
              {selectedWorkout.name}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Registre a carga e repetições das suas séries.
            </p>
          </div>

          <div className="space-y-5">
            {selectedWorkout.exercises.map(exercise => {
              const lastLog = getLastLog(exercise.id);
              const inputState = getExerciseInput(exercise.id);

              return (
                <div
                  key={exercise.id}
                  className="bg-card-bg border border-card-border rounded-2xl p-5 space-y-4 relative overflow-hidden"
                >
                  {/* Exercise header */}
                  <div className="flex justify-between items-start border-b border-card-border pb-3">
                    <div>
                      <h3 className="font-display font-bold text-white text-base">
                        {exercise.name}
                      </h3>
                      <span className="text-3xs font-mono text-brand bg-brand/5 px-2 py-0.5 border border-brand/10 rounded uppercase tracking-wider mt-1 inline-block">
                        {exercise.category}
                      </span>
                      {exercise.minReps && exercise.maxReps && (
                        <span className="text-3xs font-mono text-amber-400 bg-amber-400/10 px-2 py-0.5 border border-amber-400/20 rounded uppercase tracking-wider mt-1 inline-block ml-1">
                          {exercise.minReps}-{exercise.maxReps} reps
                        </span>
                      )}
                    </div>

                    {/* Reference stats badge */}
                    <div className="text-right">
                      <span className="text-3xs font-mono text-slate-500 uppercase tracking-widest block font-bold">
                        Último Treino
                      </span>
                      {lastLog ? (
                        <p className="text-xs text-brand font-mono font-bold bg-slate-900 border border-card-border px-2.5 py-1 rounded-lg mt-0.5">
                          {lastLog.weight}kg <span className="text-slate-500">x</span> {lastLog.sets}x{lastLog.reps}
                        </p>
                      ) : (
                        <p className="text-3xs text-slate-600 italic mt-0.5">Sem inicial</p>
                      )}
                    </div>
                  </div>

                  {/* LOG CONTROLS / ADAPTER - EASE OF USE WITH INLINE BUTTONS */}
                  <div className="flex flex-col gap-4">
                    {/* Weight Control */}
                    <div className="space-y-1.5">
                      <label className="text-2xs font-mono text-slate-400 font-bold uppercase tracking-wider">
                        Peso (kg)
                      </label>
                      <div className="flex items-center justify-between bg-slate-950/70 border border-card-border rounded-xl p-1">
                        <button
                          type="button"
                          onClick={() => updateField(exercise.id, 'weight', inputState.weight - 2)}
                          className="w-8 h-8 rounded-lg bg-slate-900 border border-card-border flex items-center justify-center text-slate-400 hover:text-white hover:border-slate-600 transition font-bold active:scale-90"
                        >
                          -2
                        </button>
                        <button
                          type="button"
                          onClick={() => updateField(exercise.id, 'weight', inputState.weight - 0.5)}
                          className="w-6 h-6 rounded bg-slate-900 border border-card-border flex items-center justify-center text-xs text-slate-400 hover:text-white"
                        >
                          -
                        </button>
                        <input
                          type="number"
                          value={inputState.weight}
                          onChange={e => updateField(exercise.id, 'weight', parseFloat(e.target.value) || 0)}
                          className="w-16 text-center bg-transparent text-white font-mono font-bold text-sm focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => updateField(exercise.id, 'weight', inputState.weight + 0.5)}
                          className="w-6 h-6 rounded bg-slate-900 border border-card-border flex items-center justify-center text-xs text-slate-400 hover:text-white"
                        >
                          +
                        </button>
                        <button
                          type="button"
                          onClick={() => updateField(exercise.id, 'weight', inputState.weight + 2)}
                          className="w-8 h-8 rounded-lg bg-slate-900 border border-card-border flex items-center justify-center text-slate-400 hover:text-white hover:border-slate-600 transition font-bold active:scale-90"
                        >
                          +2
                        </button>
                      </div>
                    </div>

                    {/* Sets Control */}
                    <div className="space-y-1.5">
                      <label className="text-2xs font-mono text-slate-400 font-bold uppercase tracking-wider">
                        Séries
                      </label>
                      <div className="flex items-center justify-between bg-slate-950/70 border border-card-border rounded-xl p-1">
                        <button
                          type="button"
                          onClick={() => updateField(exercise.id, 'sets', inputState.sets - 1)}
                          className="w-8 h-8 rounded-lg bg-slate-900 border border-card-border flex items-center justify-center text-slate-400 hover:text-white active:scale-90"
                        >
                          -
                        </button>
                        <input
                          type="number"
                          value={inputState.sets}
                          onChange={e => updateField(exercise.id, 'sets', parseInt(e.target.value) || 0)}
                          className="w-16 text-center bg-transparent text-white font-mono font-bold text-sm focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => updateField(exercise.id, 'sets', inputState.sets + 1)}
                          className="w-8 h-8 rounded-lg bg-slate-900 border border-card-border flex items-center justify-center text-slate-400 hover:text-white active:scale-90"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Reps Control */}
                    <div className="space-y-1.5">
                      <label className="text-2xs font-mono text-slate-400 font-bold uppercase tracking-wider">
                        Repetições
                      </label>
                      <div className="flex items-center justify-between bg-slate-950/70 border border-card-border rounded-xl p-1">
                        <button
                          type="button"
                          onClick={() => updateField(exercise.id, 'reps', inputState.reps - 1)}
                          className="w-8 h-8 rounded-lg bg-slate-900 border border-card-border flex items-center justify-center text-slate-400 hover:text-white active:scale-90"
                        >
                          -
                        </button>
                        <input
                          type="number"
                          value={inputState.reps}
                          onChange={e => updateField(exercise.id, 'reps', parseInt(e.target.value) || 0)}
                          className="w-16 text-center bg-transparent text-white font-mono font-bold text-sm focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => updateField(exercise.id, 'reps', inputState.reps + 1)}
                          className="w-8 h-8 rounded-lg bg-slate-900 border border-card-border flex items-center justify-center text-slate-400 hover:text-white active:scale-90"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Action / Visual confirmation footer */}
                  <div className="flex justify-between items-center pt-2">
                    <div className="flex-1">
                      {inputState.saved ? (
                        <div className="text-emerald-400 text-xs font-semibold flex items-center gap-1.5 animate-bounce">
                          <CheckCircle className="w-4 h-4" />
                          <span>Salvo com sucesso!</span>
                        </div>
                      ) : lastLog && inputState.weight > lastLog.weight ? (
                        <div className="text-brand text-2xs font-medium flex items-center gap-1 bg-brand/10 border border-brand/20 px-2 py-1 rounded max-w-max">
                          <span>🔥 Sobrecarga Progressiva (+{(inputState.weight - lastLog.weight).toFixed(1)}kg)</span>
                        </div>
                      ) : null}
                    </div>

                    <button
                      type="button"
                      onClick={() => handleSave(exercise.id)}
                      className="flex items-center space-x-2 bg-brand text-slate-950 hover:bg-white hover:text-slate-950 font-display font-black text-xs px-5 py-2.5 rounded-xl transition shadow active:scale-95 cursor-pointer"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>Salvar Exercício</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
