// ============================================================
// Google Classroom · OAuth helpers
// ------------------------------------------------------------
// Flujo separado del login de Supabase: pide scopes de Classroom
// y guarda tokens en classroom_connections.
// ============================================================

export const CLASSROOM_SCOPES = [
  "https://www.googleapis.com/auth/classroom.courses.readonly",
  "https://www.googleapis.com/auth/classroom.coursework.students.readonly",
  "https://www.googleapis.com/auth/classroom.rosters.readonly",
].join(" ")

export function getRequestOrigin(request) {
  if (request?.headers) {
    const host = (request.headers.get("x-forwarded-host") || request.headers.get("host") || "")
      .split(",")[0]
      .trim()
    if (host) {
      const proto =
        request.headers.get("x-forwarded-proto") ||
        (String(request.url || "").startsWith("https") ? "https" : "http")
      return `${proto}://${host}`
    }
  }
  return process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
}

export function getClassroomRedirectUri(request) {
  const base = getRequestOrigin(request)
  return `${base.replace(/\/$/, "")}/api/classroom/callback`
}

export function hasClassroomOAuthConfig() {
  return Boolean(
    process.env.GOOGLE_OAUTH_CLIENT_ID && process.env.GOOGLE_OAUTH_CLIENT_SECRET
  )
}

export function buildClassroomAuthUrl(state, request) {
  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_OAUTH_CLIENT_ID,
    redirect_uri: getClassroomRedirectUri(request),
    response_type: "code",
    scope: CLASSROOM_SCOPES,
    access_type: "offline",
    prompt: "consent",
    state,
  })
  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`
}

export async function exchangeClassroomCode(code, request) {
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: process.env.GOOGLE_OAUTH_CLIENT_ID,
      client_secret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
      redirect_uri: getClassroomRedirectUri(request),
      grant_type: "authorization_code",
    }),
  })

  const data = await res.json()
  if (!res.ok) {
    throw new Error(data.error_description || data.error || "Error OAuth Classroom")
  }
  return data
}

export async function refreshClassroomToken(refreshToken) {
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      refresh_token: refreshToken,
      client_id: process.env.GOOGLE_OAUTH_CLIENT_ID,
      client_secret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
      grant_type: "refresh_token",
    }),
  })

  const data = await res.json()
  if (!res.ok) {
    throw new Error(data.error_description || data.error || "Error al refrescar token")
  }
  return data
}

export function tokenExpiresAt(expiresInSeconds) {
  return new Date(Date.now() + expiresInSeconds * 1000).toISOString()
}
