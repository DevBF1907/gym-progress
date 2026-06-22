import React, { useState } from 'react';
import { User, Shield, Info, Smartphone, FileSpreadsheet, Save, CheckCircle, Database } from 'lucide-react';
import { UserProfile } from '../types';

interface ProfileProps {
  profile: UserProfile;
  onUpdateProfile: (updated: UserProfile) => void;
  onSeedLogs: () => void;
}

export default function Profile({ profile, onUpdateProfile, onSeedLogs }: ProfileProps) {
  const [name, setName] = useState(profile.name);
  const [weight, setWeight] = useState(profile.weight);
  const [height, setHeight] = useState(profile.height);
  const [goal, setGoal] = useState(profile.goal);
  
  const [showSavedMessage, setShowSavedMessage] = useState(false);
  const [showSeededMessage, setShowSeededMessage] = useState(false);
  const [unit, setUnit] = useState<'kg' | 'lbs'>('kg');
  const [pwaEnabled, setPwaEnabled] = useState(true);

  const handleSave = () => {
    onUpdateProfile({
      name,
      weight: parseFloat(weight.toString()) || 70,
      height: parseInt(height.toString()) || 170,
      goal,
    });
    setShowSavedMessage(true);

    setTimeout(() => {
      setShowSavedMessage(false);
    }, 3000);
  };

  const handleSeed = () => {
    onSeedLogs();
    setShowSeededMessage(true);
    setTimeout(() => {
      setShowSeededMessage(false);
    }, 4000);
  };

  const goals = ['Hipertrofia', 'Força', 'Emagrecimento', 'Resistência'];

  return (
    <div className="space-y-6 text-left">
      <div>
        <h2 className="text-2xl font-display font-extrabold text-white">Perfil</h2>
        <p className="text-xs text-slate-400 mt-1">
          Gerencie seus dados biométricos e objetivos.
        </p>
      </div>

      <div className="flex flex-col gap-6">
        
        {/* Left column: Biometrics Update */}
        <div className="space-y-5">
          <div className="bg-card-bg border border-card-border rounded-2xl p-5 space-y-4">
            <h3 className="text-sm font-display font-bold text-white uppercase tracking-wider flex items-center gap-1.5 border-b border-card-border pb-3">
              <User className="w-4 h-4 text-brand" />
              <span>Dados Biométricos</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Name field */}
              <div className="space-y-1.5">
                <label className="text-2xs font-mono text-slate-400 font-bold uppercase">Nome Completo</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full bg-slate-900 border border-card-border rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-brand transition"
                />
              </div>

              {/* Goal pills selector */}
              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-2xs font-mono text-slate-400 font-bold uppercase block mb-1">Objetivo de Treino</label>
                <div className="flex flex-wrap gap-2">
                  {goals.map(g => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setGoal(g)}
                      className={`px-4 py-2 rounded-xl text-xs font-semibold border transition active:scale-95 ${
                        goal === g
                          ? 'bg-brand text-slate-950 font-bold border-brand'
                          : 'bg-slate-900 text-slate-400 border-card-border hover:border-slate-700 hover:text-white'
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              {/* Body weight */}
              <div className="space-y-1.5">
                <label className="text-2xs font-mono text-slate-400 font-bold uppercase">Peso Corporal (kg)</label>
                <input
                  type="number"
                  step={0.1}
                  value={weight}
                  onChange={e => setWeight(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-900 border border-card-border rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-brand font-mono"
                />
              </div>

              {/* Height */}
              <div className="space-y-1.5">
                <label className="text-2xs font-mono text-slate-400 font-bold uppercase">Altura (cm)</label>
                <input
                  type="number"
                  value={height}
                  onChange={e => setHeight(parseInt(e.target.value) || 0)}
                  className="w-full bg-slate-900 border border-card-border rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-brand font-mono"
                />
              </div>

            </div>

            {/* Bottom save actions */}
            <div className="flex justify-between items-center pt-3 border-t border-card-border">
              <div>
                {showSavedMessage && (
                  <div className="text-emerald-400 text-xs font-semibold flex items-center gap-1.5 animate-bounce">
                    <CheckCircle className="w-4 h-4" />
                    <span>Perfil atualizado!</span>
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={handleSave}
                className="bg-brand text-slate-950 font-display font-black text-xs px-5 py-2.5 rounded-xl hover:bg-white hover:text-slate-950 transition active:scale-95 duration-200 shadow flex items-center gap-1.5 cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Salvar Alterações</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right column: Config & Settings */}
        <div className="space-y-5">
          
          <div className="bg-card-bg border border-card-border rounded-2xl p-5 space-y-4">
            <h3 className="text-sm font-display font-bold text-white uppercase tracking-wider flex items-center gap-1.5 border-b border-card-border pb-3">
              <Shield className="w-4 h-4 text-brand" />
              <span>Configurações</span>
            </h3>

            <div className="space-y-4">
              
              {/* Force OLED Dark mode settings banner details */}
              <div className="flex justify-between items-center bg-slate-900/40 p-3 rounded-xl border border-card-border">
                <div className="space-y-0.5 text-left">
                  <p className="text-xs font-semibold text-white">Visual Standard OLED</p>
                  <p className="text-4xs text-slate-400 leading-tight">Tema escuro ativado.</p>
                </div>
                <div className="w-8 h-4 rounded-full bg-brand/30 border border-brand/40 flex items-center px-0.5 justify-end">
                  <div className="w-3 h-3 rounded-full bg-brand shadow" />
                </div>
              </div>

              {/* Units indicator toggle selector */}
              <div className="flex justify-between items-center bg-slate-900/40 p-3 rounded-xl border border-card-border">
                <div className="space-y-0.5 text-left">
                  <p className="text-xs font-semibold text-white">Unidade de Medida</p>
                  <p className="text-4xs text-slate-400 leading-tight">Escolha entre Libras ou Quilos.</p>
                </div>
                <div className="flex p-0.5 bg-slate-950 border border-slate-800 rounded-lg">
                  <button
                    onClick={() => setUnit('kg')}
                    className={`px-2 py-0.5 text-2xs font-black rounded ${
                      unit === 'kg' ? 'bg-brand text-slate-950' : 'text-slate-400'
                    }`}
                  >
                    KG
                  </button>
                  <button
                    onClick={() => setUnit('lbs')}
                    className={`px-2 py-0.5 text-2xs font-black rounded ${
                      unit === 'lbs' ? 'bg-brand text-slate-950' : 'text-slate-400'
                    }`}
                  >
                    LBS
                  </button>
                </div>
              </div>

              {/* PWA offline simulation switch */}
              <div className="flex justify-between items-center bg-slate-900/40 p-3 rounded-xl border border-card-border">
                <div className="space-y-0.5 text-left">
                  <p className="text-xs font-semibold text-white">Modo Offline PWA</p>
                  <p className="text-4xs text-slate-400 leading-tight">Sincronização local ativa.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setPwaEnabled(!pwaEnabled)}
                  className={`w-10 h-5 rounded-full transition-colors flex items-center p-0.5 ${
                    pwaEnabled ? 'bg-brand justify-end' : 'bg-slate-800 justify-start'
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full shadow ${pwaEnabled ? 'bg-slate-950' : 'bg-slate-400'}`} />
                </button>
              </div>

            </div>
          </div>

          <div className="bg-card-bg border border-card-border rounded-2xl p-5 space-y-3">
            <h4 className="text-xs font-display font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-brand" />
              <span>Dados Históricos</span>
            </h4>
            <p className="text-4xs text-slate-400 leading-normal">
              Carregue os 33 logs iniciais (Supino, Costas, Ombros, Pernas e Braços de Junho 2026) instantaneamente.
            </p>
            <button
              onClick={handleSeed}
              className="w-full bg-slate-900 border border-slate-700 hover:border-brand/40 text-brand hover:text-white transition py-2.5 rounded-xl text-3xs font-mono font-bold tracking-wider uppercase cursor-pointer active:scale-95"
            >
              Re-alimentar Dados Históricos
            </button>

            {showSeededMessage && (
              <div className="mt-2 text-center text-brand text-2xs font-semibold flex items-center justify-center gap-1.5 animate-bounce">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>Dados de exemplo carregados!</span>
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}
