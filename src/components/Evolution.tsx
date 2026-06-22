import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, BarChart, Bar, Cell } from 'recharts';
import { Dumbbell, Target, BarChart3, TrendingUp, Calendar, Zap } from 'lucide-react';
import { LogEntry, Exercise } from '../types';

interface EvolutionProps {
  logs: LogEntry[];
  exercises: Exercise[];
}

export default function Evolution({ logs, exercises }: EvolutionProps) {
  // Sort exercises to only list ones that have records
  const registeredExercises = exercises.filter(ex => logs.some(l => l.exerciseId === ex.id));
  const [selectedExerciseId, setSelectedExerciseId] = useState<string>(
    registeredExercises[0]?.id || exercises[0]?.id || ''
  );

  const activeExercise = exercises.find(e => e.id === selectedExerciseId);

  // 1. Data for progression of specific exercise (Line Chart)
  const getExerciseTimelineData = () => {
    if (!selectedExerciseId) return [];
    return logs
      .filter(l => l.exerciseId === selectedExerciseId)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .map(l => ({
        // Short date format e.g. "15 Jun"
        date: new Date(l.date).toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' }).replace('.', ''),
        'Carga (kg)': l.weight,
        'Volume total (kg)': l.weight * l.sets * l.reps,
      }));
  };

  const lineChartData = getExerciseTimelineData();

  // 2. Data for Weekly Evolution (Workout counts or total volume logged per calendar week)
  // We can group logs into week starts in Jun 2026
  const getWeeklyVolumeData = () => {
    // Let's group logs by week of June 2026
    const weekData: { [weekName: string]: number } = {
      'Semana 1': 0,
      'Semana 2': 0,
      'Semana 3': 0,
      'Semana 4': 0,
    };

    logs.forEach(log => {
      const d = new Date(log.date);
      const day = d.getDate();
      const month = d.getMonth();
      if (month === 5) { // June 2026
        if (day <= 7) weekData['Semana 1'] += log.weight * log.sets * log.reps;
        else if (day <= 14) weekData['Semana 2'] += log.weight * log.sets * log.reps;
        else if (day <= 21) weekData['Semana 3'] += log.weight * log.sets * log.reps;
        else weekData['Semana 4'] += log.weight * log.sets * log.reps;
      } else {
        // Fallback or general accumulation
        weekData['Semana 3'] += log.weight * log.sets * log.reps;
      }
    });

    return Object.entries(weekData).map(([name, volume]) => ({
      name,
      'Volume (kg)': Math.round(volume),
    }));
  };

  const weeklyVolumeData = getWeeklyVolumeData();

  // 3. Data for Monthly Evolution (total volume per month)
  const getMonthlyVolumeData = () => {
    const monthsData: { [m: string]: number } = {
      'Maio ': 2100, // seed reference
      'Junho 2026': 0,
    };

    logs.forEach(log => {
      const d = new Date(log.date);
      const month = d.getMonth();
      if (month === 5) { // Jun
        monthsData['Junho 2026'] += log.weight * log.sets * log.reps;
      } else {
        monthsData['Maio '] += log.weight * log.sets * log.reps;
      }
    });

    // Make sure we convert to beautiful structure
    return Object.entries(monthsData).map(([name, vol]) => ({
      name,
      'Volume Total (kg)': Math.round(vol),
    }));
  };

  const monthlyVolumeData = getMonthlyVolumeData();

  // 4. Data for Muscle Group breakdown (Pie/Horizontal bars percentages)
  const getMuscleGroupData = () => {
    const groupCount: { [category: string]: number } = {
      Peito: 0,
      Costas: 0,
      Pernas: 0,
      Ombros: 0,
      Bíceps: 0,
      Tríceps: 0,
    };

    logs.forEach(log => {
      const ex = exercises.find(e => e.id === log.exerciseId);
      if (ex) {
        groupCount[ex.category] = (groupCount[ex.category] || 0) + log.sets; // count total sets
      }
    });

    const totalSets = Object.values(groupCount).reduce((sum, v) => sum + v, 0) || 1;

    // Sort descending
    return Object.entries(groupCount)
      .map(([category, sets]) => ({
        category,
        sets,
        percentage: Math.round((sets / totalSets) * 100),
      }))
      .sort((a, b) => b.sets - a.sets);
  };

  const muscleGroupDistribution = getMuscleGroupData();

  return (
    <div className="space-y-6 text-left">
      <div>
        <h2 className="text-2xl font-display font-extrabold text-white">Evolução</h2>
        <p className="text-xs text-slate-400 mt-1">
          Históricos visuais de progressão de carga e volume.
        </p>
      </div>

      {logs.length === 0 ? (
        <div className="bg-card-bg border border-card-border p-10 text-center rounded-2xl text-slate-500">
          <BarChart3 className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <h4 className="font-semibold text-white">Gráficos Indisponíveis</h4>
          <p className="text-xs mt-1 max-w-sm mx-auto">
            Por favor, cadastre treinos primeiro! Precisamos de logs para poder desenhar as curvas de progressão.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          
          {/* Card 1: Load progression over time per exercise */}
          <div className="bg-card-bg border border-card-border rounded-2xl p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5">
              <div>
                <h3 className="text-sm font-display font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-brand" />
                  <span>Evolução da Carga</span>
                </h3>
                <p className="text-3xs text-slate-400 mt-0.5">Visão histórica por exercício selecionado</p>
              </div>

              {/* Selector */}
              <select
                value={selectedExerciseId}
                onChange={e => setSelectedExerciseId(e.target.value)}
                className="bg-slate-900 border border-card-border text-xs rounded-lg px-2.5 py-1.5 text-slate-300 focus:outline-none focus:border-brand cursor-pointer"
              >
                {exercises.map(ex => (
                  <option key={ex.id} value={ex.id}>
                    {ex.name}
                  </option>
                ))}
              </select>
            </div>

            {lineChartData.length > 0 ? (
              <div className="h-56 mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={lineChartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#17151C" />
                    <XAxis 
                      dataKey="date" 
                      stroke="#64748B" 
                      fontSize={10}
                      tickLine={false}
                    />
                    <YAxis 
                      stroke="#64748B" 
                      fontSize={10} 
                      tickLine={false}
                      domain={['auto', 'auto']}
                    />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0B0B0E', borderColor: '#17151C', borderRadius: '8px' }}
                      labelStyle={{ color: '#E2E8F0', fontWeight: 'bold' }}
                      itemStyle={{ color: '#820AD1' }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="Carga (kg)" 
                      stroke="#820AD1" 
                      strokeWidth={3}
                      activeDot={{ r: 6 }} 
                      dot={{ stroke: '#0B0B0E', strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-56 flex flex-col items-center justify-center text-slate-500 bg-slate-950/40 rounded-xl border border-dashed border-card-border">
                <Dumbbell className="w-8 h-8 opacity-20 mb-2" />
                <p className="text-xs">Nenhum peso registrado para <strong className="text-slate-300">{activeExercise?.name}</strong></p>
                <p className="text-3xs text-slate-500 max-w-xs text-center mt-1">Registre esse exercício no menu "Treinos" para ver o gráfico nascer.</p>
              </div>
            )}
          </div>

          {/* Card 4: Muscle group breakdown (Highly optimized horizontal bar view) */}
          <div className="bg-card-bg border border-card-border rounded-2xl p-5 space-y-4">
            <div>
              <h3 className="text-sm font-display font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Target className="w-4 h-4 text-brand" />
                <span>Volume por Grupo Muscular</span>
              </h3>
              <p className="text-3xs text-slate-400 mt-0.5">Distribuição baseada nas séries logadas</p>
            </div>

            <div className="space-y-4 pt-2">
              {muscleGroupDistribution.map((item, index) => {
                const getGroupColor = (cat: string) => {
                  if (cat === 'Peito') return 'bg-sky-500';
                  if (cat === 'Costas') return 'bg-emerald-500';
                  if (cat === 'Pernas') return 'bg-brand';
                  if (cat === 'Ombros') return 'bg-pink-500';
                  if (cat === 'Bíceps') return 'bg-amber-500';
                  return 'bg-purple-500';
                };

                const activeColor = getGroupColor(item.category);

                return (
                  <div key={index} className="space-y-1">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-display font-medium text-slate-300">{item.category}</span>
                      <span className="font-mono text-slate-400">
                        {item.sets} <span className="text-slate-600">séries</span> ({item.percentage}%)
                      </span>
                    </div>

                    <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-card-border">
                      <div 
                        className={`h-full ${activeColor}`} 
                        style={{ width: `${item.percentage || 1}%` }} 
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Card 2: Weekly exercise volumes (Bar Chart) */}
          <div className="bg-card-bg border border-card-border rounded-2xl p-5 space-y-4">
            <div>
              <h3 className="text-sm font-display font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-brand" />
                <span>Evolução Semanal</span>
              </h3>
              <p className="text-3xs text-slate-400 mt-0.5">Volume total de treino (peso * séries * reps)</p>
            </div>

            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyVolumeData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#17151C" />
                  <XAxis dataKey="name" stroke="#64748B" fontSize={10} tickLine={false} />
                  <YAxis stroke="#64748B" fontSize={10} tickLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0B0B0E', borderColor: '#17151C', borderRadius: '8px' }}
                    labelStyle={{ color: '#E2E8F0', fontWeight: 'bold' }}
                    itemStyle={{ color: '#820AD1' }}
                  />
                  <Bar dataKey="Volume (kg)" fill="#820AD1" radius={[4, 4, 0, 0]}>
                    {weeklyVolumeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === 2 ? '#820AD1' : '#17151C'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Card 3: Monthly load volume (Bar Chart comparative) */}
          <div className="bg-card-bg border border-card-border rounded-2xl p-5 space-y-4">
            <div>
              <h3 className="text-sm font-display font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-brand" />
                <span>Evolução Mensal</span>
              </h3>
              <p className="text-3xs text-slate-400 mt-0.5">Comparativo de esforço total acumulado</p>
            </div>

            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyVolumeData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#17151C" />
                  <XAxis dataKey="name" stroke="#64748B" fontSize={10} tickLine={false} />
                  <YAxis stroke="#64748B" fontSize={10} tickLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0B0B0E', borderColor: '#17151C', borderRadius: '8px' }}
                    labelStyle={{ color: '#E2E8F0', fontWeight: 'bold' }}
                    itemStyle={{ color: '#820AD1' }}
                  />
                  <Bar dataKey="Volume Total (kg)" fill="#820AD1" radius={[4, 4, 0, 0]}>
                    <Cell fill="#17151C" />
                    <Cell fill="#820AD1" />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
