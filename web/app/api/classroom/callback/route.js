import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { createClient } from "@/lib/supabase/server"
import {
  exchangeClassroomCode,
  getRequestOrigin,
  tokenExpiresAt,
} from "@/lib/classroom/oauth"

function appUrl(request, path = "") {
  const base = getRequestOrigin(request)
  return `${base.replace(/\/$/, "")}${path}`
}

// Callback OAuth de Classroom: guarda tokens y redirige al panel.
export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get("code")
  const state = searchParams.get("state")
  const oauthError = searchParams.get("error")

  if (oauthError) {
    return NextResponse.redirect(appUrl(request, `/dashboard/classroom?error=${oauthError}`))
  }

  const cookieStore = await cookies()
  const savedState = cookieStore.get("classroom_oauth_state")?.value
  cookieStore.delete("classroom_oauth_state")

  if (!code || !state || state !== savedState) {
    return NextResponse.redirect(appUrl(request, "/dashboard/classroom?error=invalid_state"))
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.redirect(appUrl(request, "/login"))
  }

  try {
    const tokens = await exchangeClassroomCode(code, request)

    await supabase.from("classroom_connections").upsert(
      {
        user_id: user.id,
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token ?? null,
        token_expires_at: tokenExpiresAt(tokens.expires_in),
        connected_at: new Date().toISOString(),
      },
      { onConflict: "user_id" }
    )

    return NextResponse.redirect(appUrl(request, "/dashboard/classroom?connected=1"))
  } catch (err) {
    console.error("[classroom/callback]", err.message)
    return NextResponse.redirect(appUrl(request, "/dashboard/classroom?error=token_exchange"))
  }
}
