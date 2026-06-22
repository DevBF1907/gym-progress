-- ============================================================
-- Gym Progress - Schema Completo para Supabase (SQL Editor)
-- ============================================================

-- 1. TABELAS
-- ----------

CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name TEXT NOT NULL,
  weight NUMERIC(5,1) DEFAULT 70,
  height INTEGER DEFAULT 170,
  goal TEXT DEFAULT 'Hipertrofia',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE exercises (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  min_reps INTEGER,
  max_reps INTEGER
);

CREATE TABLE workouts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  day TEXT NOT NULL,
  name TEXT NOT NULL
);

CREATE TABLE workout_exercises (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  workout_id UUID REFERENCES workouts(id) ON DELETE CASCADE NOT NULL,
  exercise_id UUID REFERENCES exercises(id) ON DELETE CASCADE NOT NULL
);

CREATE TABLE workout_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  exercise_id UUID REFERENCES exercises(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  weight NUMERIC(6,2) NOT NULL,
  sets INTEGER NOT NULL,
  reps INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. ROW LEVEL SECURITY
-- ---------------------

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE workouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_logs ENABLE ROW LEVEL SECURITY;

-- Profiles
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Exercises (público para autenticados)
CREATE POLICY "Authenticated users can read exercises" ON exercises
  FOR SELECT USING (auth.role() = 'authenticated');

-- Workouts (público para autenticados)
CREATE POLICY "Authenticated users can read workouts" ON workouts
  FOR SELECT USING (auth.role() = 'authenticated');

-- Workout Exercises (público para autenticados)
CREATE POLICY "Authenticated users can read workout_exercises" ON workout_exercises
  FOR SELECT USING (auth.role() = 'authenticated');

-- Workout Logs (apenas do próprio usuário)
CREATE POLICY "Users can view own logs" ON workout_logs
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own logs" ON workout_logs
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own logs" ON workout_logs
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own logs" ON workout_logs
  FOR DELETE USING (auth.uid() = user_id);

-- 3. TRIGGER: Cria perfil automaticamente no cadastro
-- ---------------------------------------------------

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, name, weight, height, goal)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    COALESCE((NEW.raw_user_meta_data->>'weight')::numeric, 70),
    COALESCE((NEW.raw_user_meta_data->>'height')::integer, 170),
    COALESCE(NEW.raw_user_meta_data->>'goal', 'Hipertrofia')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- 4. SEED: 30 EXERCÍCIOS
-- -----------------------

INSERT INTO exercises (name, category, min_reps, max_reps) VALUES
  ('Puxada Frontal', 'Costas', 8, 12),
  ('Remada Aberta Máquina', 'Costas', 6, 8),
  ('Remada Alta', 'Costas', 6, 8),
  ('Remada Baixa', 'Costas', 6, 8),
  ('Remada Unilateral', 'Costas', 8, 12),
  ('Supino Reto', 'Peito', 6, 8),
  ('Supino Inclinado com Halteres', 'Peito', 6, 8),
  ('Paralelas', 'Peito', 8, 12),
  ('Crossover', 'Peito', 10, 15),
  ('Desenvolvimento Máquina', 'Ombros', 6, 8),
  ('Elevação Lateral', 'Ombros', 10, 15),
  ('Elevação Lateral com Halteres', 'Ombros', 10, 15),
  ('Elevação Lateral Unilateral na Polia', 'Ombros', 10, 15),
  ('Fly Inverso', 'Ombros', 10, 15),
  ('Crucifixo Inverso', 'Ombros', 10, 15),
  ('Tríceps Francês', 'Tríceps', 10, 15),
  ('Tríceps Testa na Polia', 'Tríceps', 10, 15),
  ('Tríceps na Polia', 'Tríceps', 10, 15),
  ('Rosca Inclinada', 'Bíceps', 10, 15),
  ('Rosca Alternada com Halteres', 'Bíceps', 10, 15),
  ('Rosca na Polia', 'Bíceps', 10, 15),
  ('Rosca Martelo', 'Bíceps', 10, 15),
  ('Hack Squat', 'Pernas', 6, 8),
  ('Leg Press', 'Pernas', 6, 8),
  ('Agachamento Búlgaro', 'Pernas', 8, 12),
  ('Stiff', 'Pernas', 8, 12),
  ('Cadeira Flexora', 'Pernas', 10, 15),
  ('Abdutora', 'Pernas', 10, 15),
  ('Máquina para Glúteos', 'Pernas', 10, 15),
  ('Panturrilha', 'Pernas', 10, 15);

-- 5. SEED: TREINOS
-- -----------------

-- Precisamos dos IDs dos exercícios inseridos. Vamos usar CTEs.
WITH ex AS (
  SELECT id, name FROM exercises
),
segunda AS (
  INSERT INTO workouts (day, name) VALUES ('Segunda-feira', 'Costas e Bíceps') RETURNING id
),
terca AS (
  INSERT INTO workouts (day, name) VALUES ('Terça-feira', 'Peito e Tríceps') RETURNING id
),
quinta AS (
  INSERT INTO workouts (day, name) VALUES ('Quinta-feira', 'Perna Completa') RETURNING id
),
sexta AS (
  INSERT INTO workouts (day, name) VALUES ('Sexta-feira', 'Ombros e Braços') RETURNING id
)
INSERT INTO workout_exercises (workout_id, exercise_id)
SELECT
  w.id,
  ex.id
FROM (VALUES
  -- Segunda: Costas e Bíceps
  ('segunda', 'Puxada Frontal'),
  ('segunda', 'Remada Aberta Máquina'),
  ('segunda', 'Remada Baixa'),
  ('segunda', 'Remada Unilateral'),
  ('segunda', 'Rosca Alternada com Halteres'),
  ('segunda', 'Fly Inverso'),
  -- Terça: Peito e Tríceps
  ('terca', 'Supino Reto'),
  ('terca', 'Supino Inclinado com Halteres'),
  ('terca', 'Paralelas'),
  ('terca', 'Crossover'),
  ('terca', 'Tríceps Testa na Polia'),
  ('terca', 'Elevação Lateral'),
  ('terca', 'Desenvolvimento Máquina'),
  -- Quinta: Perna Completa
  ('quinta', 'Hack Squat'),
  ('quinta', 'Leg Press'),
  ('quinta', 'Agachamento Búlgaro'),
  ('quinta', 'Stiff'),
  ('quinta', 'Cadeira Flexora'),
  ('quinta', 'Abdutora'),
  ('quinta', 'Máquina para Glúteos'),
  ('quinta', 'Panturrilha'),
  -- Sexta: Ombros e Braços
  ('sexta', 'Elevação Lateral Unilateral na Polia'),
  ('sexta', 'Elevação Lateral com Halteres'),
  ('sexta', 'Crucifixo Inverso'),
  ('sexta', 'Desenvolvimento Máquina'),
  ('sexta', 'Rosca Inclinada'),
  ('sexta', 'Rosca na Polia'),
  ('sexta', 'Rosca Martelo'),
  ('sexta', 'Tríceps Francês'),
  ('sexta', 'Tríceps Testa na Polia'),
  ('sexta', 'Tríceps na Polia')
) AS data(workout_key, exercise_name)
CROSS JOIN (
  SELECT id FROM segunda UNION ALL
  SELECT id FROM terca UNION ALL
  SELECT id FROM quinta UNION ALL
  SELECT id FROM sexta
) w(key)
JOIN ex ON ex.name = data.exercise_name
WHERE
  (data.workout_key = 'segunda' AND w.key IN (SELECT id FROM segunda)) OR
  (data.workout_key = 'terca' AND w.key IN (SELECT id FROM terca)) OR
  (data.workout_key = 'quinta' AND w.key IN (SELECT id FROM quinta)) OR
  (data.workout_key = 'sexta' AND w.key IN (SELECT id FROM sexta));
