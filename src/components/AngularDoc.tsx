import React, { useState } from 'react';
import { FolderTree, MessageSquare, Layout, Palette, ShieldAlert, Code, CheckCircle, Info } from 'lucide-react';

export default function AngularDoc() {
  const [activeTab, setActiveTab] = useState<'wireframes' | 'architecture' | 'components' | 'pwa'>('wireframes');

  return (
    <div className="bg-card-bg border border-card-border rounded-2xl p-6 shadow-xl space-y-6">
      <div className="flex items-center space-x-3 border-b border-card-border pb-4">
        <div className="bg-brand/10 p-2 rounded-xl">
          <Info className="w-6 h-6 text-brand" />
        </div>
        <div>
          <h2 className="text-xl font-display font-semibold text-white">Guia Teórico & Arquitetura</h2>
          <p className="text-xs text-slate-400">Especificações e estruturação do projeto migrado para Angular PWA.</p>
        </div>
      </div>

      {/* Tabs list */}
      <div className="flex bg-slate-900/50 p-1 rounded-xl border border-card-border overflow-x-auto gap-1">
        <button
          onClick={() => setActiveTab('wireframes')}
          className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-xs font-medium transition whitespace-nowrap ${
            activeTab === 'wireframes' ? 'bg-brand text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Layout className="w-3.5 h-3.5" />
          <span>Wireframes & UI</span>
        </button>
        <button
          onClick={() => setActiveTab('architecture')}
          className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-xs font-medium transition whitespace-nowrap ${
            activeTab === 'architecture' ? 'bg-brand text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
          }`}
        >
          <FolderTree className="w-3.5 h-3.5" />
          <span>Pastas & Rotas</span>
        </button>
        <button
          onClick={() => setActiveTab('components')}
          className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-xs font-medium transition whitespace-nowrap ${
            activeTab === 'components' ? 'bg-brand text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Code className="w-3.5 h-3.5" />
          <span>Componentes & Signals</span>
        </button>
        <button
          onClick={() => setActiveTab('pwa')}
          className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-xs font-medium transition whitespace-nowrap ${
            activeTab === 'pwa' ? 'bg-brand text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Palette className="w-3.5 h-3.5" />
          <span>PWA & Cores</span>
        </button>
      </div>

      {/* Tab Contents */}
      <div className="space-y-4">
        {activeTab === 'wireframes' && (
          <div className="space-y-4 text-sm leading-relaxed text-slate-300 animate-fadeIn">
            <h3 className="font-display font-bold text-white text-base">Wireframes da Aplicação</h3>
            <p className="text-xs text-slate-400">
              O design foca em <strong className="text-brand">Mobile-First</strong>, reduzindo cliques e garantindo que o usuário consiga registrar o treino mesmo fadigado ou no meio de séries.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-900 border border-card-border space-y-2">
                <span className="text-xs text-brand uppercase font-mono tracking-wider font-semibold">01. Dashboard</span>
                <p className="font-medium text-white text-xs">Menu Principal e Resumo</p>
                <div className="border border-dashed border-slate-700 p-2.5 rounded bg-slate-950 text-[11px] font-mono space-y-1 text-slate-400">
                  <div>[ Top Bar: Olá, Rodrigo! + Data Hoje ]</div>
                  <div>[ Card: Treino do dia: Peito e Tríceps - 4 ex ]</div>
                  <div>[ Card: Evolução semanal: Progressão +5.2% ]</div>
                  <div>[ Grid: Recordes Pessoais (PR) | Mais Evoluído ]</div>
                  <div>[ Botão de Ação Rápida: Iniciar Treino ]</div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900 border border-card-border space-y-2">
                <span className="text-xs text-brand uppercase font-mono tracking-wider font-semibold">02. Registro Rápido</span>
                <p className="font-medium text-white text-xs">Foco: Mínimo de Teclado</p>
                <div className="border border-dashed border-slate-700 p-2.5 rounded bg-slate-950 text-[11px] font-mono space-y-1 text-slate-400">
                  <div>[ Sub-Title: Supino Reto ]</div>
                  <div>[ Box: Último Registro: "30kg | 4 séries x 8 reps" ]</div>
                  <div>[ Input com botões +/-: Peso [ - ] 32kg [ + ] ]</div>
                  <div>[ Input com botões +/-: Séries [ - ] 4 [ + ] ]</div>
                  <div>[ Input com botões +/-: Reps [ - ] 8 [ + ] ]</div>
                  <div>[ Botão de Salvar Verde com Confete ]</div>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/50 border border-card-border text-xs space-y-2">
              <h4 className="font-semibold text-white">Navegação Inferior (Bottom Nav)</h4>
              <p className="text-slate-400">
                Barra fixa na base com 5 abas principais, ergonomicamente acessíveis ao dedão do usuário ao segurar o celular com uma só mão.
              </p>
              <div className="flex justify-around bg-slate-950 p-2 rounded text-center text-[10px] font-mono text-brand">
                <span>[Dashboard]</span>
                <span>[Treinos]</span>
                <span>[Histórico]</span>
                <span>[Gráficos]</span>
                <span>[Perfil]</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'architecture' && (
          <div className="space-y-4 text-sm leading-relaxed text-slate-300 animate-fadeIn">
            <h3 className="font-display font-bold text-white text-base">Organização de Pastas Angular</h3>
            <p className="text-xs text-slate-400">
              Estruturação seguindo a arquitetura moderna do Angular (Componentes Standalone e Diretório por Feature):
            </p>

            <pre className="p-4 rounded-xl bg-slate-950 border border-card-border text-xs font-mono text-slate-300 overflow-x-auto leading-5 text-left">
{`src/
├── app/
│   ├── core/                  # Serviços globais singleton e Guards
│   │   ├── services/
│   │   │   ├── storage.service.ts
│   │   │   └── workout.service.ts
│   │   └── guards/
│   ├── features/              # Módulos ou views principais da app
│   │   ├── dashboard/
│   │   ├── workouts/          # Seleção e lista de treinos
│   │   ├── tracker/           # Tela de registro de exercício rápido
│   │   ├── history/           # Lista de logs cronológica
│   │   └── evolution/         # Gráficos com Chart.js ou Ngx-charts
│   ├── shared/                # Componentes utilitários reutilizáveis
│   │   ├── components/        # Bottom Nav, Quick-Counter
│   │   └── pipes/             # Convert kg, Date formatter
│   ├── app.component.ts       # Contém o Router-Outlet e o BottomNav
│   ├── app.routes.ts          # Definições estruturadas de rotas
│   └── app.config.ts          # Provedores (HttpClient, Animations)
├── assets/
│   └── icons/                 # Ícones do PWA e logotipos
└── index.html`}
            </pre>

            <h4 className="font-semibold text-white text-xs mt-4">Rotas sugeridas para o Angular Router (`app.routes.ts`):</h4>
            <div className="bg-slate-900 p-3 rounded-xl border border-card-border text-xs font-mono text-slate-300 space-y-1">
              <div><span className="text-brand">/</span> → DashboardComponent</div>
              <div><span className="text-brand">/workouts</span> → WorkoutsListComponent</div>
              <div><span className="text-brand">/workouts/:id/register</span> → ActiveWorkoutTrackerComponent</div>
              <div><span className="text-brand">/history</span> → HistoryListComponent</div>
              <div><span className="text-brand">/evolution</span> → EvolutionChartsComponent</div>
              <div><span className="text-brand">/profile</span> → UserProfileSettingsComponent</div>
            </div>
          </div>
        )}

        {activeTab === 'components' && (
          <div className="space-y-4 text-sm leading-relaxed text-slate-300 animate-fadeIn">
            <h3 className="font-display font-bold text-white text-base">Utilização do Angular Material e Reactive Signals</h3>
            <p className="text-xs text-slate-400">
              Angular modernizado utiliza <strong className="text-brand">Signals</strong> para controle reativo perfeito do estado sem renderização excessiva, ideal para o salvamento offline instantâneo.
            </p>

            <div className="p-4 rounded-xl bg-slate-900 border border-card-border space-y-3">
              <span className="text-xs bg-red-400/20 text-red-300 px-2 py-0.5 rounded font-mono font-bold">Snippets Angular 18/19</span>
              <p className="text-[11px] text-slate-400">
                Substituição do RXJS por `signal()` e `computed()` para sincronização de progresso e PRs rapidamente:
              </p>
              
              <pre className="p-4 rounded-lg bg-slate-950 text-[11px] font-mono text-green-300 overflow-x-auto text-left leading-4">
{`import { Injectable, signal, computed } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class GymStateService {
  // Estado inicial via Signals
  logs = signal<LogEntry[]>(this.loadFromStorage());
  
  // Computed state reativo instantâneo
  personalRecords = computed(() => {
    const prMap = new Map<string, number>();
    this.logs().forEach(log => {
      const currentPr = prMap.get(log.exerciseId) || 0;
      if (log.weight > currentPr) {
        prMap.set(log.exerciseId, log.weight);
      }
    });
    return prMap;
  });

  addLog(newLog: LogEntry) {
    this.logs.update(current => {
      const updated = [newLog, ...current];
      localStorage.setItem('gym_logs', JSON.stringify(updated));
      return updated;
    });
  }
}`}
              </pre>
            </div>
          </div>
        )}

        {activeTab === 'pwa' && (
          <div className="space-y-4 text-sm leading-relaxed text-slate-300 animate-fadeIn text-left">
            <h3 className="font-display font-bold text-white text-base">PWA & Manifest / Cores</h3>
            <p className="text-xs text-slate-400 text-left">
              Para se parecer com um aplicativo nativo da App Store ou Google Play, o Angular PWA é configurado usando o <code className="text-brand">@angular/pwa</code>. Ele cria o manifesto e o service worker para permitir o funcionamento 100% offline.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-900 border border-card-border text-left">
                <span className="text-xs text-brand font-mono font-bold">Configuração de Cores PWA</span>
                <p className="text-xs text-slate-300 mt-1">Paleta Premium escura por padrão para evitar cansaço visual no ambiente escuro da academia.</p>
                <div className="mt-3 flex gap-2">
                  <div className="flex-1 text-center font-mono text-[10px] bg-[#050507] border border-slate-700 p-2 rounded text-slate-300">
                    #050507
                    <span className="block text-[8px] text-slate-500">Fundo</span>
                  </div>
                  <div className="flex-1 text-center font-mono text-[10px] bg-[#0F1117] border border-slate-700 p-2 rounded text-slate-300">
                    #0F1117
                    <span className="block text-[8px] text-slate-500">Card</span>
                  </div>
                  <div className="flex-1 text-center font-mono text-[10px] bg-[#10B981] p-2 rounded text-slate-950 font-bold">
                    #10B981
                    <span className="block text-[8px] text-slate-800">Marca</span>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900 border border-card-border text-left">
                <span className="text-xs text-brand font-mono font-bold">Manifesto do App</span>
                <p className="text-xs text-slate-300 mt-1">Garante que ao adicionar o link na tela inicial do celular, a barra de status mude e oculte o navegador.</p>
                <div className="mt-2 text-[10px] font-mono bg-slate-950 p-2 rounded text-slate-400 max-h-24 overflow-y-auto">
{`{
  "name": "Gym Progress Tracker",
  "short_name": "Gym Progress",
  "theme_color": "#050507",
  "background_color": "#050507",
  "display": "standalone",
  "orientation": "portrait"
}`}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
