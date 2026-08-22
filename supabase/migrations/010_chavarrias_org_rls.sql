-- ============================================================
-- 010 · RLS — materias, inscripciones, tareas, classroom
-- ============================================================

-- ------------------------------------------------------------
-- materias
-- ------------------------------------------------------------
alter table public.materias enable row level security;

drop policy if exists "materias_select_own" on public.materias;
create policy "materias_select_own"
  on public.materias for select
  using (auth.uid() = user_id);

drop policy if exists "materias_insert_own" on public.materias;
create policy "materias_insert_own"
  on public.materias for insert
  with check (auth.uid() = user_id);

drop policy if exists "materias_update_own" on public.materias;
create policy "materias_update_own"
  on public.materias for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "materias_delete_own" on public.materias;
create policy "materias_delete_own"
  on public.materias for delete
  using (auth.uid() = user_id);

-- ------------------------------------------------------------
-- inscripciones
-- ------------------------------------------------------------
alter table public.inscripciones enable row level security;

drop policy if exists "inscripciones_select_own" on public.inscripciones;
create policy "inscripciones_select_own"
  on public.inscripciones for select
  using (auth.uid() = user_id);

drop policy if exists "inscripciones_insert_own" on public.inscripciones;
create policy "inscripciones_insert_own"
  on public.inscripciones for insert
  with check (auth.uid() = user_id);

drop policy if exists "inscripciones_update_own" on public.inscripciones;
create policy "inscripciones_update_own"
  on public.inscripciones for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "inscripciones_delete_own" on public.inscripciones;
create policy "inscripciones_delete_own"
  on public.inscripciones for delete
  using (auth.uid() = user_id);

-- ------------------------------------------------------------
-- tareas
-- ------------------------------------------------------------
alter table public.tareas enable row level security;

drop policy if exists "tareas_select_own" on public.tareas;
create policy "tareas_select_own"
  on public.tareas for select
  using (auth.uid() = user_id);

drop policy if exists "tareas_insert_own" on public.tareas;
create policy "tareas_insert_own"
  on public.tareas for insert
  with check (auth.uid() = user_id);

drop policy if exists "tareas_update_own" on public.tareas;
create policy "tareas_update_own"
  on public.tareas for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "tareas_delete_own" on public.tareas;
create policy "tareas_delete_own"
  on public.tareas for delete
  using (auth.uid() = user_id);

-- ------------------------------------------------------------
-- classroom_connections — solo el dueño ve/edita su conexión
-- ------------------------------------------------------------
alter table public.classroom_connections enable row level security;

drop policy if exists "classroom_connections_select_own" on public.classroom_connections;
create policy "classroom_connections_select_own"
  on public.classroom_connections for select
  using (auth.uid() = user_id);

drop policy if exists "classroom_connections_insert_own" on public.classroom_connections;
create policy "classroom_connections_insert_own"
  on public.classroom_connections for insert
  with check (auth.uid() = user_id);

drop policy if exists "classroom_connections_update_own" on public.classroom_connections;
create policy "classroom_connections_update_own"
  on public.classroom_connections for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "classroom_connections_delete_own" on public.classroom_connections;
create policy "classroom_connections_delete_own"
  on public.classroom_connections for delete
  using (auth.uid() = user_id);
