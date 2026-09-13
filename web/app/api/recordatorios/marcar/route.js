import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

/** Marca recordatorio enviado (p. ej. tras mandar el mensaje por WhatsApp a mano). */
export async function POST(request) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 })
  }

  let tareaId
  try {
    const body = await request.json()
    tareaId = body.tareaId
  } catch {
    return NextResponse.json({ error: "Solicitud inválida" }, { status: 400 })
  }

  if (!tareaId) {
    return NextResponse.json({ error: "Falta tareaId" }, { status: 400 })
  }

  const { error } = await supabase
    .from("tareas")
    .update({
      recordatorio_enviado: true,
      recordatorio_celular_at: new Date().toISOString(),
    })
    .eq("id", tareaId)
    .eq("user_id", user.id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
