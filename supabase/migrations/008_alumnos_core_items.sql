-- ============================================================
-- 008 · core_items → alumnos (EntregaAlert)
-- ------------------------------------------------------------
-- Adapta core_items para registrar alumnos con nombre, teléfono
-- y correo de contacto para avisos de tareas Moodle.
-- ============================================================

alter table public.core_items
  add column if not exists nombre text,
  add column if not exists telefono text,
  add column if not exists correo text;

-- Migrar filas existentes del MVP genérico (si las hay)
update public.core_items
set
  nombre = coalesce(nullif(trim(nombre), ''), nullif(trim(title), ''), 'Sin nombre'),
  telefono = coalesce(nullif(trim(telefono), ''), '0000000000'),
  correo = coalesce(nullif(trim(correo), ''), 'sin-correo@ejemplo.com')
where nombre is null
   or telefono is null
   or correo is null;

alter table public.core_items
  drop column if exists title,
  drop column if exists description,
  drop column if exists status;

alter table public.core_items
  alter column nombre set not null,
  alter column telefono set not null,
  alter column correo set not null;

comment on table public.core_items is 'Registro de alumnos para avisos de tareas Moodle (EntregaAlert).';

comment on column public.core_items.nombre is 'Nombre completo del alumno.';
comment on column public.core_items.telefono is 'Teléfono de contacto del alumno.';
comment on column public.core_items.correo is 'Correo donde recibe avisos de entregas.';
