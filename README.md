# Gym Progress 💪

Aplicação mobile-first para tracking de treinos de academia. Anote seus exercícios, acompanhe a evolução de carga, séries e repetições com gráficos.

## Stack

| Camada | Tecnologia |
|--------|-----------|
| Frontend | React 19 + TypeScript + Vite |
| Estilo | Tailwind CSS 4 |
| Ícones | Lucide React |
| Gráficos | Recharts |
| Animações | Motion |
| Backend | Supabase (Auth, Banco PostgreSQL, RLS) |
| Deploy | Vercel (SPA) |

## Funcionalidades

- **Autenticação** — Login/ cadastro via Supabase Auth (email + senha)
- **Dashboard** — Visão geral dos últimos treinos, progresso semanal, exercícios recentes
- **Treinos** — 4 treinos pré-definidos (Costas e Bíceps, Peito e Tríceps, Perna Completa, Ombros e Braços)
- **Registro rápido** — Selecione o exercício e registre peso, séries e repetições
- **Histórico** — Visualize e delete registros anteriores
- **Gráficos** — Evolução de carga por exercício ao longo do tempo
- **Perfil** — Nome, peso, altura, objetivo (Hipertrofia / Força / Emagrecimento)
- **Offline-first** — Dados salvos em localStorage, sincronizam com Supabase quando online

## Como Rodar Localmente

```bash
# 1. Clone
git clone https://github.com/DevBF1907/gym-progress.git
cd gym-progress

# 2. Instale as dependências
npm install

# 3. Crie um arquivo .env com as credenciais do Supabase
#    (veja .env.example)
VITE_SUPABASE_URL=https://cpsionkdgenezxehneui.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNwc2lvbmtkZ2VuZXp4ZWhuZXVpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIwNzMzMzcsImV4cCI6MjA5NzY0OTMzN30.oXoFU3G5wUuV30Qvr6W4NuiULY7cxWcHb27z9ME0Dqw

# 4. Rode o projeto
npm run dev
```

## Configuração do Supabase

1. Crie um projeto em [supabase.com](https://supabase.com)
2. No **SQL Editor**, execute o conteúdo do arquivo [`supabase-schema.sql`](./supabase-schema.sql)
   - Cria as tabelas: `profiles`, `exercises`, `workouts`, `workout_exercises`, `workout_logs`
   - Ativa Row Level Security (RLS)
   - Cria o trigger `handle_new_user` (cria perfil automaticamente no cadastro)
   - Popula 30 exercícios e 4 treinos
3. Em **Authentication > Settings**, desabilite "Confirm email" se quiser cadastro sem confirmação
4. Copie a **Project URL** e a **anon key** para o `.env`

## Estrutura do Projeto

```
src/
├── components/
│   ├── AuthPage.tsx      # Login / Cadastro
│   ├── Dashboard.tsx     # Visão geral
│   ├── Workouts.tsx      # Lista de treinos
│   ├── Tracker.tsx       # Registro de exercício
│   ├── History.tsx       # Histórico de logs
│   ├── Evolution.tsx     # Gráficos de evolução
│   └── Profile.tsx       # Perfil do usuário
├── supabase.ts           # Cliente Supabase
├── supabaseApi.ts        # Funções da API (auth + dados)
├── initialData.ts        # Dados iniciais offline
├── types.ts              # Tipos TypeScript
├── App.tsx               # Entry point + navegação
└── main.tsx              # Bootstrap React
```

## Deploy na Vercel

```bash
npx vercel --prod
```

Configure as variáveis de ambiente no dashboard da Vercel:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
