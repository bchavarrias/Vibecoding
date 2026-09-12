import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { createClient } from "@/lib/supabase/server"
import config from "@/config"
import {
  buildClassroomAuthUrl,
  getRequestOrigin,
  hasClassroomOAuthConfig,
} from "@/lib/classroom/oauth"

// Inicia OAuth de Google Classroom (scopes adicionales al login de Supabase).
export async function GET(request) {
  if (!config.features.classroom) {
    return NextResponse.json({ error: "Classroom desactivado." }, { status: 403 })
  }

  if (!hasClassroomOAuthConfig()) {
    return NextResponse.redirect(
      new URL("/dashboard/classroom?error=oauth_config", getRequestOrigin(request))
    )
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.redirect(new URL("/login", getRequestOrigin(request)))
  }

  const state = crypto.randomUUID()
  const cookieStore = await cookies()
  cookieStore.set("classroom_oauth_state", state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 600,
    path: "/",
  })

  return NextResponse.redirect(buildClassroomAuthUrl(state, request))
}
