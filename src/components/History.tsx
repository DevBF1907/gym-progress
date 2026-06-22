import React, { useState } from 'react';
import { Calendar, Trash2, Dumbbell, Filter, ChevronRight, Activity, Clock } from 'lucide-react';
import { LogEntry, Exercise } from '../types';

interface HistoryProps {
  logs: LogEntry[];
  exercises: Exercise[];
  onDeleteLog: (id: string) => void;
  onClearLogs: () => void;
}

export default function History({ logs, exercises, onDeleteLog, onClearLogs }: HistoryProps) {
  const [selectedExerciseId, setSelectedExerciseId] = useState<string>('all');

  const getExerciseName = (id: string) => {
    return exercises.find(e => e.id === id)?.name || 'Exercício Desconhecido';
  };

  const getExerciseCategory = (id: string) => {
    return exercises.find(e => e.id === id)?.category || 'Geral';
  };

  // Filter logs based on selection
  const filteredLogs = logs
    .filter(log => selectedExerciseId === 'all' || log.exerciseId === selectedExerciseId)
    // Sort descending by date, then id (if same date, show latest saved first)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Format Date ISO (YYYY-MM-DD) into beautiful pt-BR short date (DD/MM/YYYY)
  const formatShortDate = (dateStr: string) => {
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    // fallback
    return new Date(dateStr).toLocaleDateString('pt-BR');
  };

  return (
    <div className="space-y-6 text-left">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-display font-extrabold text-white">Histórico</h2>
          <p className="text-xs text-slate-400 mt-1">
            Suas cargas salvas cronologicamente.
          </p>
        </div>

        {logs.length > 0 && (
          <button
            onClick={() => {
              if (window.confirm('Tem certeza que deseja limpar TODOS os registros salvos?')) {
                onClearLogs();
              }
            }}
            className="text-xs text-red-400 hover:text-red-300 transition px-3 py-1.5 rounded-lg border border-red-500/20 bg-red-500/5 hover:bg-red-500/15 cursor-pointer max-w-max self-start sm:self-auto"
          >
            Limpar Tudo
          </button>
        )}
      </div>

      {/* Exercise Filter Select Area */}
      <div className="bg-card-bg border border-card-border rounded-xl p-4 flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold">
          <Filter className="w-4 h-4 text-brand" />
          <span>Exercício:</span>
        </div>

        <select
          value={selectedExerciseId}
          onChange={e => setSelectedExerciseId(e.target.value)}
          className="bg-slate-900 border border-card-border rounded-lg text-xs py-2 px-3 text-white focus:outline-none focus:border-brand flex-1 cursor-pointer"
        >
          <option value="all">🏋️ Todos os Exercícios ({logs.length})</option>
          {exercises
            .filter(ex => logs.some(l => l.exerciseId === ex.id))
            .map(ex => (
              <option key={ex.id} value={ex.id}>
                {ex.category.toUpperCase()} - {ex.name}
              </option>
            ))}
        </select>
      </div>

      {/* History chronological Feed */}
      <div className="space-y-3">
        {filteredLogs.length > 0 ? (
          filteredLogs.map((log, index) => {
            const exName = getExerciseName(log.exerciseId);
            const exCategory = getExerciseCategory(log.exerciseId);

            return (
              <div
                key={log.id}
                className="bg-card-bg border border-card-border rounded-2xl p-4 flex flex-col gap-3 hover:border-slate-700 transition"
              >
                {/* Top Tier: Icon and Info */}
                <div className="flex items-center space-x-3.5 min-w-0">
                  {/* Category icon indicator */}
                  <div className="w-10 h-10 rounded-xl bg-slate-900 border border-card-border flex items-center justify-center text-brand flex-shrink-0">
                    <Dumbbell className="w-4 h-4" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-mono font-bold text-slate-400 flex items-center gap-1.5 uppercase tracking-wider">
                      <Calendar className="w-3.5 h-3.5 text-brand" />
                      <span>{formatShortDate(log.date)}</span>
                      <span className="text-slate-600">•</span>
                      <span className="text-3xs text-brand/80">{exCategory}</span>
                    </p>
                    <h4 className="text-sm font-display font-medium text-white truncate mt-0.5">
                      {exName}
                    </h4>
                  </div>
                </div>

                {/* Bottom Tier: Values indicator and Delete Button - highly readable */}
                <div className="flex items-center justify-between border-t border-card-border/60 pt-2.5">
                  <div className="flex items-baseline space-x-1.5 min-w-0">
                    <span className="text-base font-mono font-extrabold text-brand flex-shrink-0">{log.weight} kg</span>
                    <span className="text-3xs text-slate-400 font-mono truncate">
                      ({log.sets} séries x {log.reps} reps)
                    </span>
                  </div>

                  <button
                    onClick={() => onDeleteLog(log.id)}
                    className="p-2 rounded-lg bg-red-500/5 hover:bg-red-500/20 text-red-400 hover:text-red-300 transition duration-200 border border-red-500/10 active:scale-95 cursor-pointer flex items-center justify-center flex-shrink-0"
                    title="Excluir este log"
                    type="button"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="bg-card-bg border border-card-border rounded-2xl p-8 text-center text-slate-500 py-12">
            <Clock className="w-10 h-10 mx-auto text-slate-600 mb-3" />
            <h4 className="font-display font-semibold text-white text-sm">Nenhum registro encontrado</h4>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              {selectedExerciseId === 'all'
                ? 'Registre seu primeiro treino na aba de "Treinos" ou "Registro" para começar a preencher o histórico!'
                : 'Não há registros específicos cadastrados para este exercício em sua base local.'}
            </p>
          </div>
        )}
      </div>

      {/* Visual wireframe example preview according to prompt */}
      {selectedExerciseId !== 'all' && filteredLogs.length > 0 && (
        <div className="p-4 bg-slate-900 border border-dashed border-slate-700 rounded-xl space-y-2 text-xs text-slate-400">
          <p className="font-semibold text-slate-300 uppercase font-mono text-[10px]">Visão Simplificada (Exemplo do Usuário):</p>
          <div className="font-mono bg-slate-950 p-2.5 rounded text-brand border border-card-border space-y-1">
            {filteredLogs.map(log => (
              <div key={log.id}>
                {formatShortDate(log.date)} - {log.weight}kg - {log.sets}x{log.reps}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
