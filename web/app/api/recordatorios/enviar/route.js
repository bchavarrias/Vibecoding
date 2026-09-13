import { NextResponse } from "next/server"
import config from "@/config"
import { createClient } from "@/lib/supabase/server"
import { sendRecordatorioTarea } from "@/lib/sms/send"

export async function POST(request) {
  if (!config.features.smsRecordatorios) {
    return NextResponse.json({ error: "Recordatorios SMS desactivados." }, { status: 403 })
  }

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

  const { data: tarea, error } = await supabase
    .from("tareas")
    .select(
      "id, titulo, fecha_entrega, recordatorio_enviado, alumno:core_items(nombre, celular), materia:materias(nombre)"
    )
    .eq("id", tareaId)
    .eq("user_id", user.id)
    .maybeSingle()

  if (error || !tarea) {
    return NextResponse.json({ error: "Tarea no encontrada" }, { status: 404 })
  }

  if (tarea.recordatorio_enviado) {
    return NextResponse.json({ error: "already_sent" }, { status: 409 })
  }

  const celular = tarea.alumno?.celular
  const nombre = tarea.alumno?.nombre || "Alumno"

  if (!celular) {
    return NextResponse.json({ error: "no_phone" }, { status: 422 })
  }

  const result = await sendRecordatorioTarea({
    celular,
    alumnoNombre: nombre,
    titulo: tarea.titulo,
    materiaNombre: tarea.materia?.nombre,
    fechaEntrega: tarea.fecha_entrega,
  })

  if (result.skipped) {
    return NextResponse.json({
      ok: false,
      skipped: true,
      whatsappUrl: result.whatsappUrl,
      preview: result.body,
    })
  }

  if (!result.ok) {
    return NextResponse.json({
      ok: false,
      error: result.error,
      whatsappUrl: result.whatsappUrl,
    })
  }

  const { error: updateError } = await supabase
    .from("tareas")
    .update({
      recordatorio_enviado: true,
      recordatorio_celular_at: new Date().toISOString(),
    })
    .eq("id", tarea.id)
    .eq("user_id", user.id)

  if (updateError) {
    console.error("[recordatorios/enviar] update:", updateError.message)
    return NextResponse.json({ error: "No se pudo marcar como enviado" }, { status: 500 })
  }

  return NextResponse.json({ ok: true, sid: result.sid })
}
