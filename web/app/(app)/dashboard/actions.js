"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"
import { MAX_MATERIAS_POR_CUATRIMESTRE } from "@/lib/academico"

async function requireUser() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("No autenticado")
  return { supabase, user }
}

function refreshDashboard() {
  revalidatePath("/dashboard", "layout")
}

// --- Alumnos (core_items) ---

function parseAlumnoFields(formData) {
  const nombre = formData.get("nombre")?.toString().trim()
  const celular = formData.get("celular")?.toString().trim()
  const correo = formData.get("correo")?.toString().trim().toLowerCase()
  if (!nombre || !celular || !correo) return { error: "Campos obligatorios." }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) return { error: "Correo inválido." }
  return { nombre, celular, correo }
}

export async function createAlumno(formData) {
  const parsed = parseAlumnoFields(formData)
  if (parsed.error) return
  const { supabase, user } = await requireUser()
  await supabase.from("core_items").insert({
    user_id: user.id,
    nombre: parsed.nombre,
    celular: parsed.celular,
    correo: parsed.correo,
  })
  refreshDashboard()
}

export async function updateAlumno(formData) {
  const id = formData.get("id")?.toString()
  if (!id) return
  const parsed = parseAlumnoFields(formData)
  if (parsed.error) return
  const { supabase, user } = await requireUser()
  await supabase
    .from("core_items")
    .update({ nombre: parsed.nombre, celular: parsed.celular, correo: parsed.correo })
    .eq("id", id)
    .eq("user_id", user.id)
  refreshDashboard()
}

export async function deleteAlumno(formData) {
  const id = formData.get("id")?.toString()
  if (!id) return
  const { supabase, user } = await requireUser()
  await supabase.from("core_items").delete().eq("id", id).eq("user_id", user.id)
  refreshDashboard()
}

// --- Materias ---

export async function createMateria(formData) {
  const nombre = formData.get("nombre")?.toString().trim()
  const codigo = formData.get("codigo")?.toString().trim() || null
  if (!nombre) return
  const { supabase, user } = await requireUser()
  await supabase.from("materias").insert({ user_id: user.id, nombre, codigo })
  refreshDashboard()
}

export async function updateMateria(formData) {
  const id = formData.get("id")?.toString()
  const nombre = formData.get("nombre")?.toString().trim()
  const codigo = formData.get("codigo")?.toString().trim() || null
  if (!id || !nombre) return
  const { supabase, user } = await requireUser()
  await supabase
    .from("materias")
    .update({ nombre, codigo })
    .eq("id", id)
    .eq("user_id", user.id)
  refreshDashboard()
}

export async function deleteMateria(formData) {
  const id = formData.get("id")?.toString()
  if (!id) return
  const { supabase, user } = await requireUser()
  await supabase.from("materias").delete().eq("id", id).eq("user_id", user.id)
  refreshDashboard()
}

// --- Inscripciones ---

export async function createInscripcion(formData) {
  const alumnoId = formData.get("alumno_id")?.toString()
  const materiaId = formData.get("materia_id")?.toString()
  const cuatrimestre = Number(formData.get("cuatrimestre"))
  const anio = Number(formData.get("anio"))
  const periodo = Number(formData.get("periodo"))
  if (!alumnoId || !materiaId || !cuatrimestre || !anio || !periodo) return

  const { supabase, user } = await requireUser()

  const { count } = await supabase
    .from("inscripciones")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id)
    .eq("alumno_id", alumnoId)
    .eq("cuatrimestre", cuatrimestre)
    .eq("anio", anio)
    .eq("periodo", periodo)

  if ((count ?? 0) >= MAX_MATERIAS_POR_CUATRIMESTRE) return

  await supabase.from("inscripciones").insert({
    user_id: user.id,
    alumno_id: alumnoId,
    materia_id: materiaId,
    cuatrimestre,
    anio,
    periodo,
  })
  refreshDashboard()
}

export async function deleteInscripcion(formData) {
  const id = formData.get("id")?.toString()
  if (!id) return
  const { supabase, user } = await requireUser()
  await supabase.from("inscripciones").delete().eq("id", id).eq("user_id", user.id)
  refreshDashboard()
}

// --- Tareas ---

export async function createTarea(formData) {
  const alumnoId = formData.get("alumno_id")?.toString()
  const materiaId = formData.get("materia_id")?.toString() || null
  const titulo = formData.get("titulo")?.toString().trim()
  const descripcion = formData.get("descripcion")?.toString().trim() || null
  const fecha = formData.get("fecha_entrega")?.toString()
  if (!alumnoId || !titulo || !fecha) return

  const { supabase, user } = await requireUser()
  await supabase.from("tareas").insert({
    user_id: user.id,
    alumno_id: alumnoId,
    materia_id: materiaId || null,
    titulo,
    descripcion,
    fecha_entrega: new Date(fecha).toISOString(),
  })
  refreshDashboard()
}

export async function deleteTarea(formData) {
  const id = formData.get("id")?.toString()
  if (!id) return
  const { supabase, user } = await requireUser()
  await supabase.from("tareas").delete().eq("id", id).eq("user_id", user.id)
  refreshDashboard()
}

export async function marcarRecordatorioEnviado(formData) {
  const id = formData.get("id")?.toString()
  if (!id) return
  const { supabase, user } = await requireUser()
  await supabase
    .from("tareas")
    .update({ recordatorio_enviado: true, recordatorio_celular_at: new Date().toISOString() })
    .eq("id", id)
    .eq("user_id", user.id)
  refreshDashboard()
}
