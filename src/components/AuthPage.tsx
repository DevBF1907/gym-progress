import React, { useState } from 'react';
import { Dumbbell, Mail, Lock, User, Eye, EyeOff, Ruler, Weight, Target, AlertCircle, Loader } from 'lucide-react';
import { signIn, signUp } from '../supabaseApi';

interface AuthPageProps {
  onAuthSuccess: () => void;
}

export default function AuthPage({ onAuthSuccess }: AuthPageProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [weight, setWeight] = useState(70);
  const [height, setHeight] = useState(170);
  const [goal, setGoal] = useState('Hipertrofia');

  const goals = ['Hipertrofia', 'Força', 'Emagrecimento', 'Resistência'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        await signIn(email, password);
      } else {
        await signUp(email, password, name, weight, height, goal);
      }
      onAuthSuccess();
    } catch (err: any) {
      setError(err.message || 'Erro ao conectar. Verifique se o Supabase está configurado.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0612] flex items-center justify-center p-4">
      <div className="w-full max-w-md mx-auto">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-brand flex items-center justify-center mx-auto mb-4 shadow-lg shadow-brand/20">
            <Dumbbell className="w-8 h-8 text-slate-950 font-black" />
          </div>
          <h1 className="text-3xl font-display font-black text-white">
            GYM <span className="text-brand">PROGRESS</span>
          </h1>
          <p className="text-sm text-slate-400 mt-2">
            {isLogin ? 'Bem-vindo de volta!' : 'Crie sua conta para começar'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-card-bg border border-card-border rounded-2xl p-6 space-y-4 shadow-xl">
          {error && (
            <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 text-red-400 text-xs p-3 rounded-xl">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {!isLogin && (
            <div className="space-y-1.5">
              <label className="text-2xs font-mono text-slate-400 font-bold uppercase flex items-center gap-1">
                <User className="w-3 h-3" /> Nome
              </label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Seu nome"
                required
                className="w-full bg-slate-900 border border-card-border rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-brand transition placeholder:text-slate-600"
              />
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-2xs font-mono text-slate-400 font-bold uppercase flex items-center gap-1">
              <Mail className="w-3 h-3" /> Email
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="seu@email.com"
              required
              className="w-full bg-slate-900 border border-card-border rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-brand transition placeholder:text-slate-600"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-2xs font-mono text-slate-400 font-bold uppercase flex items-center gap-1">
              <Lock className="w-3 h-3" /> Senha
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder={isLogin ? 'Sua senha' : 'Mínimo 8 caracteres'}
                required
                minLength={8}
                className="w-full bg-slate-900 border border-card-border rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-brand transition pr-10 placeholder:text-slate-600"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {!isLogin && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-2xs font-mono text-slate-400 font-bold uppercase flex items-center gap-1">
                    <Weight className="w-3 h-3" /> Peso (kg)
                  </label>
                  <input
                    type="number"
                    value={weight}
                    onChange={e => setWeight(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-900 border border-card-border rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-brand transition"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-2xs font-mono text-slate-400 font-bold uppercase flex items-center gap-1">
                    <Ruler className="w-3 h-3" /> Altura (cm)
                  </label>
                  <input
                    type="number"
                    value={height}
                    onChange={e => setHeight(parseInt(e.target.value) || 0)}
                    className="w-full bg-slate-900 border border-card-border rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-brand transition"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-2xs font-mono text-slate-400 font-bold uppercase flex items-center gap-1">
                  <Target className="w-3 h-3" /> Objetivo
                </label>
                <div className="flex flex-wrap gap-2">
                  {goals.map(g => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setGoal(g)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
                        goal === g
                          ? 'bg-brand text-slate-950 border-brand'
                          : 'bg-slate-900 text-slate-400 border-card-border hover:border-slate-700'
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand text-slate-950 font-display font-black text-sm py-3.5 rounded-xl hover:bg-white transition disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? <Loader className="w-4 h-4 animate-spin" /> : null}
            {loading ? 'Conectando...' : isLogin ? 'Entrar' : 'Criar Conta'}
          </button>

          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => { setIsLogin(!isLogin); setError(''); }}
              className="text-xs text-slate-400 hover:text-brand transition"
            >
              {isLogin ? 'Não tem conta? Cadastre-se' : 'Já tem conta? Faça login'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
