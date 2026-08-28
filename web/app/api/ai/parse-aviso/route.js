import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { generateObject } from "@/lib/openai/structured"
import config from "@/config"
import {
  avisoClassroomSchema,
  buildAvisoClassroomPrompt,
} from "@/lib/ai/schemas/avisoClassroom"

// POST /api/ai/parse-aviso — texto libre → tarea estructurada (Classroom).
export async function POST(request) {
  if (!config.features.structuredTareas) {
    return NextResponse.json({ error: "Función desactivada." }, { status: 403 })
  }

  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      { error: "Falta OPENAI_API_KEY en .env.local" },
      { status: 503 }
    )
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: "No autenticado." }, { status: 401 })
  }

  try {
    const { texto } = await request.json()
    if (!texto || typeof texto !== "string" || !texto.trim()) {
      return NextResponse.json({ error: "texto requerido." }, { status: 400 })
    }

    const parsed = await generateObject(
      avisoClassroomSchema,
      buildAvisoClassroomPrompt(texto)
    )

    if (!parsed) {
      return NextResponse.json({ error: "No se pudo interpretar el aviso." }, { status: 422 })
    }

    return NextResponse.json({ ok: true, tarea: parsed })
  } catch (err) {
    console.error("[parse-aviso]", err.message)
    return NextResponse.json({ error: "Error procesando el aviso." }, { status: 500 })
  }
}
