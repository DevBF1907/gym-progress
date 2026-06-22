import React from 'react';
import { Dumbbell, TrendingUp, Award, Flame, Sparkles, ChevronRight, CheckCircle2 } from 'lucide-react';
import { Workout, LogEntry, UserProfile, Exercise } from '../types';

interface DashboardProps {
  profile: UserProfile;
  workouts: Workout[];
  logs: LogEntry[];
  exercises: Exercise[];
  onSelectTab: (tab: string) => void;
  onSelectWorkout: (workout: Workout) => void;
}

export default function Dashboard({
  profile,
  workouts,
  logs,
  exercises,
  onSelectTab,
  onSelectWorkout,
}: DashboardProps) {
  // Format today's date in Portuguese
  const todayStr = new Date().toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  // Decide current recommended workout based on current day of week
  const getRecommendedWorkout = (): Workout | null => {
    if (!workouts || workouts.length === 0) return null;
    const day = new Date().getDay(); // 0 is Sunday, 1 is Monday...
    if (day === 1) return workouts.find(w => w.id === 'w-seg') || workouts[0];
    if (day === 2) return workouts.find(w => w.id === 'w-ter') || workouts[1] || workouts[0];
    if (day === 4) return workouts.find(w => w.id === 'w-qui') || workouts[2] || workouts[0];
    if (day === 5) return workouts.find(w => w.id === 'w-sex') || workouts[3] || workouts[0];
    // fallback or default
    return workouts[1] || workouts[0]; // Terça default or first
  };

  const recommendedWorkout = getRecommendedWorkout();

  // Calculate Personal Records (PR)
  // Find maximum weight logged for each exercise
  const prMap = new Map<string, { weight: number; date: string }>();
  logs.forEach(log => {
    const existing = prMap.get(log.exerciseId);
    if (!existing || log.weight > existing.weight) {
      prMap.set(log.exerciseId, { weight: log.weight, date: log.date });
    }
  });

  const getExerciseName = (id: string) => {
    return exercises.find(e => e.id === id)?.name || 'Exercício';
  };

  // Turn PRs map into list
  const prs = Array.from(prMap.entries())
    .map(([exerciseId, data]) => ({
      exerciseId,
      name: getExerciseName(exerciseId),
      weight: data.weight,
      date: data.date,
    }))
    .sort((a, b) => b.weight - a.weight) // show heaviest or just standard
    .slice(0, 3);

  // Compute "Exercício Mais Evoluído" (highest % weight progression from earliest to latest log)
  const getMostProgressedExercise = () => {
    // Group logs by exerciseId
    const exerciseLogs: { [id: string]: LogEntry[] } = {};
    logs.forEach(log => {
      if (!exerciseLogs[log.exerciseId]) {
        exerciseLogs[log.exerciseId] = [];
      }
      exerciseLogs[log.exerciseId].push(log);
    });

    let bestProgress = {
      exerciseId: '',
      name: 'Sem registros suficientes',
      increasePct: 0,
      oldWeight: 0,
      newWeight: 0,
    };

    Object.entries(exerciseLogs).forEach(([exerciseId, items]) => {
      if (items.length < 2) return;
      // Sort items by date ascending
      const sorted = [...items].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      const firstWeight = sorted[0].weight;
      const lastWeight = sorted[sorted.length - 1].weight;
      if (firstWeight > 0) {
        const pct = ((lastWeight - firstWeight) / firstWeight) * 100;
        if (pct > bestProgress.increasePct) {
          bestProgress = {
            exerciseId,
            name: getExerciseName(exerciseId),
            increasePct: parseFloat(pct.toFixed(1)),
            oldWeight: firstWeight,
            newWeight: lastWeight,
          };
        }
      }
    });

    return bestProgress;
  };

  const bestExerciseProgress = getMostProgressedExercise();

  // Simple statistics
  const distinctDaysTrainedThisMonth = () => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const uniqueDates = new Set(
      logs
        .filter(log => {
          const d = new Date(log.date);
          return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
        })
        .map(log => log.date)
    );
    return uniqueDates.size;
  };

  const totalLogsCount = logs.length;

  return (
    <div className="space-y-6 text-left">
      {/* Greeting Banner */}
      <div className="flex justify-between items-start">
        <div>
          <span className="text-brand font-mono text-xs uppercase tracking-wider font-semibold">
            {todayStr}
          </span>
          <h1 className="text-3xl font-display font-extrabold text-white mt-1">
            E aí, <span className="text-brand">{profile.name.split(' ')[0]}</span>!
          </h1>
          <p className="text-sm text-slate-400 mt-1 flex items-center gap-1.5">
            <Flame className="w-4 h-4 text-orange-500 fill-orange-500 animate-pulse" />
            Foco total no objetivo de <strong className="text-slate-200">{profile.goal}</strong>!
          </p>
        </div>

        {/* Small Avatar icon */}
        <div className="w-12 h-12 rounded-full border border-card-border bg-slate-900 flex items-center justify-center p-0.5" id="user-avatar-dash">
          <div className="w-full h-full rounded-full bg-brand/20 flex items-center justify-center text-brand font-display font-bold text-lg">
            {profile.name[0]}
          </div>
        </div>
      </div>

      {/* Suggested workout of the day card */}
      {recommendedWorkout && (
        <div className="p-1 rounded-2xl bg-gradient-to-r from-brand/30 via-slate-800 to-slate-900 border border-brand/20 shadow-lg relative overflow-hidden">
          <div className="p-5 bg-card-bg/95 rounded-[14px] flex flex-col justify-between items-stretch gap-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1 bg-brand/10 text-brand px-2.5 py-1 rounded-full text-2xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3 h-3" /> Sugestão de Hoje
              </div>
              <h3 className="text-lg font-display font-semibold text-white mt-1.5">
                Treino: {recommendedWorkout.name}
              </h3>
              <p className="text-xs text-slate-400">
                {recommendedWorkout.exercises ? recommendedWorkout.exercises.length : 0} exercícios focados • Duração aprox: 45 min
              </p>
            </div>
            
            <button
              onClick={() => {
                onSelectWorkout(recommendedWorkout);
                onSelectTab('treinos');
              }}
              className="w-full flex items-center justify-center space-x-2 bg-brand text-slate-950 px-5 py-3 rounded-xl font-display font-bold text-sm tracking-wide transition-all active:scale-95 hover:bg-white hover:text-slate-950 hover:shadow-brand/20 shadow-md cursor-pointer"
            >
              <Dumbbell className="w-4 h-4" />
              <span>Registrar Treino</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Quick stats grid */}
      <div className="flex flex-col gap-4">
        
        {/* Weekly evolution Card */}
        <div className="bg-card-bg border border-card-border rounded-2xl p-5 space-y-3 shadow-md">
          <div className="flex items-center justify-between">
            <h3 className="text-slate-300 font-display font-medium text-sm">Frequência da Semana</h3>
            <span className="text-2xs text-brand bg-brand/10 px-2 py-0.5 rounded font-mono font-semibold">ATIVO</span>
          </div>

          <div className="flex items-end justify-between">
            <div>
              <p className="text-2xl font-display font-extrabold text-white">{workouts.length} / 4</p>
              <p className="text-2xs text-slate-400 mt-1">Treinos na semana</p>
            </div>
            {/* Visual indicator bar */}
            <div className="w-24 h-3 bg-slate-900 rounded-full overflow-hidden border border-card-border">
              <div className="w-full h-full bg-brand" />
            </div>
          </div>

          <div className="border-t border-card-border pt-2.5 flex justify-between text-2xs text-slate-400">
            <span>{workouts.map(w => w.day.substring(0, 3)).join(' • ')}</span>
            <span className="text-brand">{workouts.length} dias de treino</span>
          </div>
        </div>

        {/* Recordes Pessoais (PR) */}
        <div className="bg-card-bg border border-card-border rounded-2xl p-5 space-y-3 shadow-md">
          <div className="flex items-center justify-between">
            <h3 className="text-slate-300 font-display font-medium text-sm flex items-center gap-1.5">
              <Award className="w-4 h-4 text-brand" />
              <span>Recordes Atuais (PR)</span>
            </h3>
            <button 
              onClick={() => onSelectTab('historico')}
              className="text-2xs text-brand hover:underline font-medium"
            >
              Ver todos
            </button>
          </div>

          <div className="space-y-2">
            {prs.length === 0 ? (
              <p className="text-xs text-slate-500 py-2">Nenhum recorde registrado ainda.</p>
            ) : (
              prs.map((pr, index) => (
                <div key={index} className="flex justify-between items-center text-xs">
                  <div className="text-slate-300 truncate max-w-[150px]">{pr.name}</div>
                  <div className="font-mono text-white font-bold bg-slate-900 border border-card-border px-2 py-0.5 rounded">
                    {pr.weight} kg
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Exercícios mais evoluídos */}
        <div className="bg-card-bg border border-card-border rounded-2xl p-5 space-y-3 shadow-md">
          <div className="flex items-center justify-between">
            <h3 className="text-slate-300 font-display font-medium text-sm flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-brand" />
              <span>Maior Evolução</span>
            </h3>
          </div>

          {bestExerciseProgress.increasePct > 0 ? (
            <div className="space-y-1">
              <p className="text-xs text-slate-400 truncate font-semibold text-white">
                {bestExerciseProgress.name}
              </p>
              <div className="flex items-baseline space-x-2 py-0.5">
                <span className="text-2xl font-display font-black text-brand">
                  +{bestExerciseProgress.increasePct}%
                </span>
                <span className="text-2xs text-slate-400">
                  carga total
                </span>
              </div>
              <p className="text-2xs text-slate-400">
                Início: <span className="text-slate-300">{bestExerciseProgress.oldWeight}kg</span> • Atual: <span className="font-semibold text-white">{bestExerciseProgress.newWeight}kg</span>
              </p>
            </div>
          ) : (
            <div className="space-y-1 py-1">
              <p className="text-xs text-slate-500">Sem histórico comparativo ainda.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
