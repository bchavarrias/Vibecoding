import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import config from "@/config"
import { hasClassroomOAuthConfig } from "@/lib/classroom/oauth"
import { getClassroomAccessToken, syncClassroomData } from "@/lib/classroom/sync"

// Sincroniza cursos y tareas desde Google Classroom.
export async function POST() {
  if (!config.features.classroom) {
    return NextResponse.json({ error: "Classroom desactivado." }, { status: 403 })
  }

  if (!hasClassroomOAuthConfig()) {
    return NextResponse.json(
      {
        error:
          "Faltan GOOGLE_OAUTH_CLIENT_ID y GOOGLE_OAUTH_CLIENT_SECRET en .env.local / Vercel.",
      },
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
    const accessToken = await getClassroomAccessToken(supabase, user.id)
    if (!accessToken) {
      return NextResponse.json(
        { error: "Conecta Google Classroom primero.", connect: "/api/classroom/connect" },
        { status: 401 }
      )
    }

    const result = await syncClassroomData(supabase, user.id, accessToken)

    return NextResponse.json({
      ok: true,
      message: `Sincronizado: ${result.courses} cursos, ${result.materias} materias, ${result.tareas} tareas.${result.cursosSinInscripciones ? ` ${result.cursosSinInscripciones} curso(s) sin inscripciones (inscribe alumnos para importar tareas).` : ""}`,
      ...result,
    })
  } catch (err) {
    console.error("[classroom/sync]", err.message)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
