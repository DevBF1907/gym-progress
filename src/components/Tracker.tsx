import React, { useState } from 'react';
import { Dumbbell, Save, CheckCircle, Search, HelpCircle, Flame, Star } from 'lucide-react';
import { Exercise, LogEntry } from '../types';

interface TrackerProps {
  exercises: Exercise[];
  logs: LogEntry[];
  onSaveLog: (exerciseId: string, weight: number, sets: number, reps: number) => void;
}

export default function Tracker({ exercises, logs, onSaveLog }: TrackerProps) {
  const [selectedId, setSelectedId] = useState<string>(exercises[0]?.id || '');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Custom form state
  const [weight, setWeight] = useState(30);
  const [sets, setSets] = useState(4);
  const [reps, setReps] = useState(10);
  const [showSavedFeedback, setShowSavedFeedback] = useState(false);

  // Filter exercises
  const filteredExercises = exercises.filter(ex => 
    ex.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ex.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedExercise = exercises.find(ex => ex.id === selectedId) || exercises[0];

  // Fetch stats details
  const getExerciseStats = (exerciseId: string) => {
    const exerciseLogs = logs.filter(l => l.exerciseId === exerciseId);
    if (exerciseLogs.length === 0) return { last: null, maxPr: null };

    // Sort descending by date
    const sortedLogs = [...exerciseLogs].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    const last = sortedLogs[0];
    
    // Find absolute highest load (Max PR)
    const maxPr = [...exerciseLogs].reduce((max, log) => log.weight > max ? log.weight : max, 0);

    return { last, maxPr };
  };

  const { last: lastLog, maxPr } = selectedExercise ? getExerciseStats(selectedExercise.id) : { last: null, maxPr: null };

  // Sync inputs with last log when user changes exercise selected
  const handleSelectId = (id: string) => {
    setSelectedId(id);
    const exStats = getExerciseStats(id);
    if (exStats.last) {
      setWeight(exStats.last.weight);
      setSets(exStats.last.sets);
      setReps(exStats.last.reps);
    } else {
      setWeight(20);
      setSets(4);
      setReps(10);
    }
  };

  const handleSave = () => {
    if (!selectedId) return;
    onSaveLog(selectedId, weight, sets, reps);
    setShowSavedFeedback(true);
    
    setTimeout(() => {
      setShowSavedFeedback(false);
    }, 3000);
  };

  const incrementWeight = (amount: number) => {
    setWeight(prev => parseFloat(Math.max(0, prev + amount).toFixed(1)));
  };

  const incrementSets = (amount: number) => {
    setSets(prev => Math.max(0, prev + amount));
  };

  const incrementReps = (amount: number) => {
    setReps(prev => Math.max(0, prev + amount));
  };

  return (
    <div className="space-y-6 text-left">
      <div>
        <h2 className="text-2xl font-display font-extrabold text-white font-sans">Registrar Treino</h2>
        <p className="text-xs text-slate-400 mt-1">
          Selecione o exercício para registrar sua série atual.
        </p>
      </div>

      <div className="flex flex-col gap-6">
        
        {/* Left Side: Exercise selector and Searcher */}
        <div className="bg-card-bg border border-card-border rounded-2xl p-4 space-y-3">
          <label className="text-xs text-slate-400 font-medium block">
            Escolha o Exercício
          </label>
          
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Pesquisar exercício..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 border border-card-border rounded-xl pl-9 pr-4 py-2 text-xs text-white focus:outline-none focus:border-brand transition"
            />
          </div>

          <div className="max-h-60 overflow-y-auto space-y-1 pr-1">
            {filteredExercises.map(ex => {
              const works = logs.filter(l => l.exerciseId === ex.id);
              const isSelected = selectedId === ex.id;
              
              return (
                <button
                  key={ex.id}
                  onClick={() => handleSelectId(ex.id)}
                  type="button"
                  className={`w-full text-left p-2.5 rounded-xl transition ${
                    isSelected 
                      ? 'bg-brand text-slate-950 font-bold' 
                      : 'hover:bg-slate-900 text-slate-300'
                  }`}
                >
                  <p className="text-xs font-semibold truncate leading-tight">{ex.name}</p>
                  <div className="flex justify-between items-center mt-1">
                    <span className={`text-[9px] uppercase font-mono tracking-wider ${
                      isSelected ? 'text-slate-800' : 'text-slate-500 font-bold'
                    }`}>
                      {ex.category}
                    </span>
                    {works.length > 0 && (
                      <span className={`text-[9px] font-mono font-bold ${
                        isSelected ? 'text-slate-900' : 'text-brand'
                      }`}>
                        {works.length} logs
                      </span>
                    )}
                  </div>
                </button>
              );
            })}

            {filteredExercises.length === 0 && (
              <p className="text-xs text-slate-500 text-center py-6">Nenhum exercício encontrado.</p>
            )}
          </div>
        </div>

        {/* Middle/Right Side: Logging controls & reference card */}
        <div className="space-y-4">
          
          {selectedExercise ? (
            <div className="bg-card-bg border border-card-border rounded-2xl p-5 space-y-6">
              
              {/* Reference metrics info block */}
              <div className="flex flex-col sm:flex-row justify-between sm:items-center bg-slate-900/50 p-4 rounded-xl border border-card-border gap-4">
                <div>
                  <span className="text-3xs text-brand font-mono font-bold uppercase tracking-wider bg-brand/10 border border-brand/20 px-2 py-0.5 rounded">
                    {selectedExercise.category}
                  </span>
                  <h3 className="font-display font-bold text-white text-base mt-1.5">
                    {selectedExercise.name}
                  </h3>
                </div>

                <div className="flex gap-4">
                  {lastLog && (
                    <div className="text-center sm:text-right">
                      <p className="text-[10px] text-slate-400 font-mono font-semibold uppercase">Último treino</p>
                      <p className="text-sm text-white font-mono font-bold">
                        {lastLog.weight}kg <span className="text-slate-500 text-xs">x</span> {lastLog.sets}x{lastLog.reps}
                      </p>
                      <p className="text-3xs text-slate-500">{new Date(lastLog.date).toLocaleDateString('pt-BR')}</p>
                    </div>
                  )}

                  {maxPr !== null && (
                    <div className="text-center sm:text-right border-l border-slate-700 pl-4">
                      <p className="text-[10px] text-slate-400 font-mono font-semibold uppercase flex items-center gap-1">
                        <Star className="w-3 h-3 text-amber-500 fill-amber-500" /> Max Carga
                      </p>
                      <p className="text-sm text-amber-400 font-mono font-bold">
                        {maxPr} kg
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Incremental inputs */}
              <div className="space-y-4">
                
                {/* Weight counter */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-mono text-slate-400 font-bold uppercase">Carga Atual (kg)</span>
                    <span className="text-slate-400 font-mono font-bold">{weight} kg</span>
                  </div>
                  <div className="flex bg-slate-950 border border-card-border rounded-2xl p-1.5 items-center justify-between">
                    <div className="flex gap-1">
                      <button
                        type="button"
                        onClick={() => incrementWeight(-5)}
                        className="w-10 h-10 rounded-xl bg-slate-900 text-slate-300 font-bold text-xs hover:text-white hover:border-slate-500 transition active:scale-95 border border-card-border"
                      >
                        -5
                      </button>
                      <button
                        type="button"
                        onClick={() => incrementWeight(-1)}
                        className="w-10 h-10 rounded-xl bg-slate-900 text-slate-300 font-bold text-xs hover:text-white hover:border-slate-500 transition active:scale-95 border border-card-border"
                      >
                        -1
                      </button>
                    </div>

                    <input
                      type="number"
                      value={weight}
                      step={0.5}
                      onChange={e => setWeight(parseFloat(e.target.value) || 0)}
                      className="w-24 bg-transparent text-center font-display font-black text-2xl text-white focus:outline-none"
                    />

                    <div className="flex gap-1">
                      <button
                        type="button"
                        onClick={() => incrementWeight(1)}
                        className="w-10 h-10 rounded-xl bg-slate-900 text-slate-300 font-bold text-xs hover:text-white hover:border-slate-500 transition active:scale-95 border border-card-border"
                      >
                        +1
                      </button>
                      <button
                        type="button"
                        onClick={() => incrementWeight(5)}
                        className="w-10 h-10 rounded-xl bg-slate-900 text-slate-300 font-bold text-xs hover:text-white hover:border-slate-500 transition active:scale-95 border border-card-border"
                      >
                        +5
                      </button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {/* Sets counter */}
                  <div className="space-y-1.5">
                    <span className="text-2xs font-mono text-slate-400 font-bold uppercase">Séries</span>
                    <div className="flex bg-slate-950 border border-card-border rounded-xl p-1 items-center justify-between">
                      <button
                        type="button"
                        onClick={() => incrementSets(-1)}
                        className="w-10 h-10 rounded-lg bg-slate-900 text-slate-300 font-bold hover:text-white border border-card-border active:scale-90"
                      >
                        -
                      </button>
                      <input
                        type="number"
                        value={sets}
                        onChange={e => setSets(parseInt(e.target.value) || 0)}
                        className="w-12 bg-transparent text-center font-mono font-bold text-white focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => incrementSets(1)}
                        className="w-10 h-10 rounded-lg bg-slate-900 text-slate-300 font-bold hover:text-white border border-card-border active:scale-90"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Reps counter */}
                  <div className="space-y-1.5">
                    <span className="text-2xs font-mono text-slate-400 font-bold uppercase">Repetições</span>
                    <div className="flex bg-slate-950 border border-card-border rounded-xl p-1 items-center justify-between">
                      <button
                        type="button"
                        onClick={() => incrementReps(-1)}
                        className="w-10 h-10 rounded-lg bg-slate-900 text-slate-300 font-bold hover:text-white border border-card-border active:scale-90"
                      >
                        -
                      </button>
                      <input
                        type="number"
                        value={reps}
                        onChange={e => setReps(parseInt(e.target.value) || 0)}
                        className="w-12 bg-transparent text-center font-mono font-bold text-white focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => incrementReps(1)}
                        className="w-10 h-10 rounded-lg bg-slate-900 text-slate-300 font-bold hover:text-white border border-card-border active:scale-90"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

              </div>

              {/* Bottom save bar */}
              <div className="flex items-center justify-between pt-4 border-t border-card-border">
                <div>
                  {showSavedFeedback ? (
                    <div className="text-emerald-400 text-sm font-semibold flex items-center gap-1.5 animate-bounce">
                      <CheckCircle className="w-4 h-4" />
                      <span>Análise salva!</span>
                    </div>
                  ) : lastLog && weight > lastLog.weight ? (
                    <div className="text-brand text-2xs font-medium flex items-center gap-1.5 bg-brand/10 border border-brand/20 px-2 py-1 rounded">
                      <span>🎉 Mais forte que no dia {new Date(lastLog.date).toLocaleDateString('pt-BR')}!</span>
                    </div>
                  ) : null}
                </div>

                <button
                  type="button"
                  onClick={handleSave}
                  className="bg-brand text-slate-950 font-display font-black text-sm px-6 py-3 rounded-xl hover:bg-white hover:text-slate-950 transition shadow duration-300 flex items-center gap-2 cursor-pointer active:scale-95"
                >
                  <Save className="w-4 h-4" />
                  <span>Salvar Registro</span>
                </button>
              </div>

            </div>
          ) : (
            <div className="bg-card-bg border border-card-border rounded-2xl p-8 text-center text-slate-500">
              <Dumbbell className="w-8 h-8 mx-auto opacity-30 mb-3" />
              <p className="text-sm">Selecione ou adicione um exercício para começar.</p>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
