"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"

// CRUD de alumnos (tabla core_items) vía Server Actions.
// La RLS garantiza que cada quien solo toca sus filas; filtramos
// por user_id como defensa en profundidad.

async function requireUser() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("No autenticado")
  return { supabase, user }
}

function parseAlumnoFields(formData) {
  const nombre = formData.get("nombre")?.toString().trim()
  const telefono = formData.get("telefono")?.toString().trim()
  const correo = formData.get("correo")?.toString().trim().toLowerCase()

  if (!nombre || !telefono || !correo) {
    return { error: "Todos los campos son obligatorios." }
  }
  if (nombre.length > 120) {
    return { error: "El nombre es demasiado largo." }
  }
  if (telefono.length > 20) {
    return { error: "El teléfono es demasiado largo." }
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
    return { error: "El correo no es válido." }
  }

  return { nombre, telefono, correo }
}

export async function createAlumno(formData) {
  const parsed = parseAlumnoFields(formData)
  if (parsed.error) return

  const { supabase, user } = await requireUser()
  await supabase.from("core_items").insert({
    user_id: user.id,
    nombre: parsed.nombre,
    telefono: parsed.telefono,
    correo: parsed.correo,
  })
  revalidatePath("/dashboard")
}

export async function updateAlumno(formData) {
  const id = formData.get("id")?.toString()
  if (!id) return

  const parsed = parseAlumnoFields(formData)
  if (parsed.error) return

  const { supabase, user } = await requireUser()
  await supabase
    .from("core_items")
    .update({
      nombre: parsed.nombre,
      telefono: parsed.telefono,
      correo: parsed.correo,
    })
    .eq("id", id)
    .eq("user_id", user.id)
  revalidatePath("/dashboard")
}

export async function deleteAlumno(formData) {
  const id = formData.get("id")?.toString()
  if (!id) return

  const { supabase, user } = await requireUser()
  await supabase
    .from("core_items")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id)
  revalidatePath("/dashboard")
}
