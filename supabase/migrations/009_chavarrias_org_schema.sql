-- ============================================================
-- 009 · Chavarria's Org — materias, inscripciones y tareas
-- ------------------------------------------------------------
-- Extiende core_items (alumnos) con celular, agrega materias,
-- inscripciones alumno-materia por cuatrimestre y tareas
-- vinculables a Google Classroom.
-- ============================================================

-- Renombrar teléfono → celular (notificaciones SMS/WhatsApp)
alter table public.core_items
  rename column telefono to celular;

comment on column public.core_items.celular is 'Celular del alumno para recordatorios de tareas.';
comment on table public.core_items is 'Alumnos registrados en Chavarria''s Org.';

-- ------------------------------------------------------------
-- materias
-- ------------------------------------------------------------
create table if not exists public.materias (
  id                    uuid primary key default gen_random_uuid(),
  user_id               uuid not null references auth.users (id) on delete cascade,
  nombre                text not null,
  codigo                text,
  classroom_course_id   text,
  classroom_course_name text,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);

comment on table public.materias is 'Materias registradas, opcionalmente vinculadas a Google Classroom.';

create index if not exists materias_user_id_idx on public.materias (user_id, created_at desc);

drop trigger if exists materias_set_updated_at on public.materias;
create trigger materias_set_updated_at
  before update on public.materias
  for each row execute function public.set_updated_at();

-- ------------------------------------------------------------
-- inscripciones (alumno ↔ materia por cuatrimestre)
-- periodo: 1 = Ene–Abr, 2 = May–Ago, 3 = Sep–Dic
-- cuatrimestre: 1–10 (carrera completa)
-- ------------------------------------------------------------
create table if not exists public.inscripciones (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references auth.users (id) on delete cascade,
  alumno_id    uuid not null references public.core_items (id) on delete cascade,
  materia_id   uuid not null references public.materias (id) on delete cascade,
  cuatrimestre smallint not null check (cuatrimestre between 1 and 10),
  anio         smallint not null check (anio >= 2020 and anio <= 2100),
  periodo      smallint not null check (periodo between 1 and 3),
  created_at   timestamptz not null default now(),
  unique (alumno_id, materia_id, cuatrimestre, anio, periodo)
);

comment on table public.inscripciones is 'Relación alumno-materia por cuatrimestre y periodo calendario.';

create index if not exists inscripciones_alumno_idx
  on public.inscripciones (alumno_id, cuatrimestre, anio, periodo);

create index if not exists inscripciones_user_id_idx
  on public.inscripciones (user_id, created_at desc);

-- ------------------------------------------------------------
-- tareas / recordatorios (vinculables a Classroom)
-- ------------------------------------------------------------
create table if not exists public.tareas (
  id                      uuid primary key default gen_random_uuid(),
  user_id                 uuid not null references auth.users (id) on delete cascade,
  inscripcion_id          uuid references public.inscripciones (id) on delete set null,
  alumno_id               uuid not null references public.core_items (id) on delete cascade,
  materia_id              uuid references public.materias (id) on delete set null,
  titulo                  text not null,
  descripcion             text,
  fecha_entrega           timestamptz not null,
  classroom_coursework_id text,
  recordatorio_enviado    boolean not null default false,
  recordatorio_celular_at timestamptz,
  created_at              timestamptz not null default now(),
  updated_at              timestamptz not null default now()
);

comment on table public.tareas is 'Tareas pendientes con recordatorios al celular del alumno.';

create index if not exists tareas_alumno_fecha_idx
  on public.tareas (alumno_id, fecha_entrega);

create index if not exists tareas_user_id_idx
  on public.tareas (user_id, fecha_entrega);

drop trigger if exists tareas_set_updated_at on public.tareas;
create trigger tareas_set_updated_at
  before update on public.tareas
  for each row execute function public.set_updated_at();

-- ------------------------------------------------------------
-- conexión Google Classroom (tokens OAuth del coordinador)
-- ------------------------------------------------------------
create table if not exists public.classroom_connections (
  id               uuid primary key default gen_random_uuid(),
  user_id          uuid not null unique references auth.users (id) on delete cascade,
  access_token     text,
  refresh_token    text,
  token_expires_at timestamptz,
  connected_at     timestamptz not null default now()
);

comment on table public.classroom_connections is 'Tokens OAuth para sincronizar cursos de Google Classroom.';
