import React, { useState, useEffect, useCallback } from 'react';
import { Home, Dumbbell, PlusCircle, History as HistoryIcon, BarChart3, User, Sparkles, LogOut, Wifi, WifiOff } from 'lucide-react';
import { getSavedState, saveState, INITIAL_LOGS, INITIAL_PROFILE, INITIAL_EXERCISES, INITIAL_WORKOUTS } from './initialData';
import { Workout, LogEntry, UserProfile, Exercise } from './types';
import { supabase } from './supabase';
import { getExercises, getWorkouts, getLogs, createLog, deleteLog, getProfile, updateProfile, signOut } from './supabaseApi';

import Dashboard from './components/Dashboard';
import Workouts from './components/Workouts';
import Tracker from './components/Tracker';
import History from './components/History';
import Evolution from './components/Evolution';
import Profile from './components/Profile';
import AuthPage from './components/AuthPage';

export default function App() {
  const [authenticated, setAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const [online, setOnline] = useState<boolean>(true);

  const [profile, setProfile] = useState<UserProfile>(INITIAL_PROFILE);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [workouts, setWorkouts] = useState<Workout[]>([]);

  const [activeTab, setActiveTab] = useState<string>('inicio');
  const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setAuthenticated(!!session);
      if (!session) {
        const saved = getSavedState();
        setProfile(saved.profile);
        setLogs(saved.logs);
        setExercises(saved.exercises);
        setWorkouts(saved.workouts);
      }
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      const authed = !!session;
      setAuthenticated(authed);
      if (authed) {
        loadProfile();
      } else {
        const saved = getSavedState();
        setProfile(saved.profile);
        setLogs(saved.logs);
        setExercises(saved.exercises);
        setWorkouts(saved.workouts);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadProfile = useCallback(async () => {
    const p = await getProfile();
    if (p) setProfile(p);
  }, []);

  const syncFromApi = useCallback(async () => {
    setSyncing(true);
    try {
      const [apiExercises, apiWorkouts, apiLogs] = await Promise.all([
        getExercises(),
        getWorkouts(),
        getLogs(),
      ]);

      setExercises(apiExercises);
      setWorkouts(apiWorkouts);
      setLogs(apiLogs);

      saveState(profile, apiLogs, apiExercises, apiWorkouts);
      setOnline(true);
    } catch (err) {
      console.warn('Falha ao sincronizar com Supabase, usando dados locais:', err);
      setOnline(false);
    } finally {
      setSyncing(false);
    }
  }, [profile]);

  useEffect(() => {
    if (authenticated) {
      syncFromApi();
    }
  }, [authenticated, syncFromApi]);

  const persistState = useCallback((p: UserProfile, l: LogEntry[], e: Exercise[], w: Workout[]) => {
    saveState(p, l, e, w);
  }, []);

  const handleUpdateProfile = useCallback(async (updated: UserProfile) => {
    setProfile(updated);
    persistState(updated, logs, exercises, workouts);

    if (authenticated) {
      try {
        await updateProfile({
          name: updated.name,
          weight: updated.weight,
          height: updated.height,
          goal: updated.goal,
        });
        setOnline(true);
      } catch {
        setOnline(false);
      }
    }
  }, [authenticated, logs, exercises, workouts, persistState]);

  const handleSaveLog = useCallback(async (exerciseId: string, weight: number, sets: number, reps: number) => {
    const isoToday = new Date().toISOString().split('T')[0];

    if (authenticated) {
      try {
        const created = await createLog({ exerciseId, date: isoToday, weight, sets, reps });
        const newEntry: LogEntry = {
          id: created.id,
          exerciseId: created.exerciseId,
          date: created.date,
          weight: created.weight,
          sets: created.sets,
          reps: created.reps,
        };
        const updatedLogs = [newEntry, ...logs];
        setLogs(updatedLogs);
        persistState(profile, updatedLogs, exercises, workouts);
        setOnline(true);
        return;
      } catch {
        setOnline(false);
      }
    }

    const newEntry: LogEntry = {
      id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      exerciseId,
      date: isoToday,
      weight,
      sets,
      reps,
    };
    const updatedLogs = [newEntry, ...logs];
    setLogs(updatedLogs);
    persistState(profile, updatedLogs, exercises, workouts);
  }, [authenticated, logs, exercises, workouts, profile, persistState]);

  const handleDeleteLog = useCallback(async (id: string) => {
    if (authenticated) {
      try {
        await deleteLog(id);
        setOnline(true);
      } catch {
        setOnline(false);
      }
    }
    const updated = logs.filter(log => log.id !== id);
    setLogs(updated);
    persistState(profile, updated, exercises, workouts);
  }, [authenticated, logs, exercises, workouts, profile, persistState]);

  const handleClearLogs = useCallback(() => {
    setLogs([]);
    persistState(profile, [], exercises, workouts);
  }, [profile, exercises, workouts, persistState]);

  const handleSeedLogs = useCallback(() => {
    setLogs(INITIAL_LOGS);
    setProfile(INITIAL_PROFILE);
    setExercises(INITIAL_EXERCISES);
    setWorkouts(INITIAL_WORKOUTS);
    persistState(INITIAL_PROFILE, INITIAL_LOGS, INITIAL_EXERCISES, INITIAL_WORKOUTS);
  }, [persistState]);

  const handleAuthSuccess = useCallback(() => {
    loadProfile();
    syncFromApi();
  }, [loadProfile, syncFromApi]);

  const handleLogout = useCallback(async () => {
    await signOut();
    const saved = getSavedState();
    setProfile(saved.profile);
    setLogs(saved.logs);
    setExercises(saved.exercises);
    setWorkouts(saved.workouts);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0612] flex items-center justify-center">
        <div className="w-8 h-8 rounded-lg bg-brand flex items-center justify-center shadow-md shadow-brand/20 animate-pulse">
          <Dumbbell className="w-4 h-4 text-slate-950 font-black" />
        </div>
      </div>
    );
  }

  if (!authenticated) {
    return <AuthPage onAuthSuccess={handleAuthSuccess} />;
  }

  const navItems = [
    { id: 'inicio', label: 'Início', icon: Home },
    { id: 'treinos', label: 'Treinos', icon: Dumbbell },
    { id: 'registro', label: 'Registrar', icon: PlusCircle },
    { id: 'historico', label: 'Histórico', icon: HistoryIcon },
    { id: 'evolution', label: 'Gráficos', icon: BarChart3 },
    { id: 'perfil', label: 'Perfil', icon: User },
  ];

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    if (tabId !== 'treinos') {
      setSelectedWorkout(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0612] flex flex-col justify-between relative font-sans">
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-brand/5 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md mx-auto flex-1 flex flex-col justify-between bg-dark-bg text-slate-100 min-h-screen shadow-2xl relative overflow-hidden border-x border-card-border/60">
        <header className="sticky top-0 z-40 bg-dark-bg/85 backdrop-blur-md border-b border-card-border/80 px-5 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-brand flex items-center justify-center p-0.5 shadow-md shadow-brand/20">
              <Dumbbell className="w-4 h-4 text-slate-950 font-black fill-current" />
            </div>
            <span className="text-lg font-display font-black tracking-tight text-white">
              GYM <span className="text-brand">PROGRESS</span>
            </span>
          </div>
          <div className="flex items-center gap-2">
            {online ? (
              <Wifi className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <WifiOff className="w-3.5 h-3.5 text-amber-400" />
            )}
            <button onClick={handleLogout} className="text-slate-400 hover:text-brand transition p-1" title="Sair">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto px-5 pt-5 pb-24 relative z-10">
          {activeTab === 'inicio' && (
            <Dashboard
              profile={profile}
              workouts={workouts}
              logs={logs}
              exercises={exercises}
              onSelectTab={handleTabChange}
              onSelectWorkout={(workout) => {
                setSelectedWorkout(workout);
                setActiveTab('treinos');
              }}
            />
          )}

          {activeTab === 'treinos' && (
            <Workouts
              workouts={workouts}
              logs={logs}
              onSaveLog={handleSaveLog}
              selectedWorkout={selectedWorkout}
              setSelectedWorkout={setSelectedWorkout}
            />
          )}

          {activeTab === 'registro' && (
            <Tracker
              exercises={exercises}
              logs={logs}
              onSaveLog={handleSaveLog}
            />
          )}

          {activeTab === 'historico' && (
            <History
              logs={logs}
              exercises={exercises}
              onDeleteLog={handleDeleteLog}
              onClearLogs={handleClearLogs}
            />
          )}

          {activeTab === 'evolution' && (
            <Evolution
              logs={logs}
              exercises={exercises}
            />
          )}

          {activeTab === 'perfil' && (
            <Profile
              profile={profile}
              onUpdateProfile={handleUpdateProfile}
              onSeedLogs={handleSeedLogs}
            />
          )}
        </main>

        <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-card-bg/95 backdrop-blur-lg border-t border-card-border/80 z-40 px-3 py-2 flex justify-around items-center rounded-t-2xl shadow-xl shadow-black/80">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleTabChange(item.id)}
                className="flex flex-col items-center justify-center p-1.5 rounded-xl transition duration-300 group cursor-pointer relative"
                style={{ WebkitTapHighlightColor: 'transparent' }}
              >
                {isActive && (
                  <div className="absolute inset-0 bg-brand/10 rounded-xl blur-sm -z-10 animate-pulse" />
                )}
                <Icon className={`w-5 h-5 transition-transform group-active:scale-90 ${
                  isActive ? 'text-brand stroke-[2.5px]' : 'text-slate-400 group-hover:text-slate-200'
                }`} />
                <span className={`text-[10px] mt-1 font-medium font-display transition duration-300 ${
                  isActive ? 'text-brand font-bold' : 'text-slate-500 group-hover:text-slate-300'
                }`}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
