import Link from "next/link"
import { headers } from "next/headers"
import config from "@/config"
import { createClient } from "@/lib/supabase/server"
import { hasClassroomOAuthConfig, getClassroomRedirectUri } from "@/lib/classroom/oauth"
import ClassroomActions from "./ClassroomActions"

const labels = config.dashboard.classroom

export const metadata = { title: labels.pageTitle }

export default async function ClassroomPage({ searchParams }) {
  const params = await searchParams
  const supabase = await createClient()
  const { data: connection } = await supabase
    .from("classroom_connections")
    .select("connected_at, refresh_token")
    .maybeSingle()

  const hasOAuth = hasClassroomOAuthConfig()
  const isConnected = Boolean(connection?.refresh_token)
  const headerStore = await headers()
  const redirectUri = getClassroomRedirectUri({ headers: headerStore, url: "" })

  let banner = null
  if (params?.connected === "1") {
    banner = { type: "success", text: "Google Classroom conectado correctamente." }
  } else if (params?.error === "oauth_config") {
    banner = { type: "warning", text: "Configura las credenciales OAuth de Google." }
  } else if (params?.error) {
    banner = { type: "error", text: `Error al conectar: ${params.error}` }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{labels.pageTitle}</h1>
        <p className="mt-1 text-sm text-base-content/70">{labels.subtitle}</p>
      </div>

      {banner && (
        <div
          className={`rounded-lg border px-4 py-3 text-sm ${
            banner.type === "success"
              ? "border-success/40 bg-success/10 text-success"
              : banner.type === "warning"
                ? "border-warning/40 bg-warning/10"
                : "border-error/40 bg-error/10 text-error"
          }`}
        >
          {banner.text}
        </div>
      )}

      <div className="rounded-2xl border border-base-200 bg-base-100 p-6">
        <div className="flex items-center gap-3">
          <span className={`badge ${isConnected ? "badge-success" : "badge-ghost"}`}>
            {isConnected ? labels.connected : labels.disconnected}
          </span>
          {connection?.connected_at && (
            <span className="text-xs text-base-content/50">
              Conectado el {new Date(connection.connected_at).toLocaleDateString("es-MX")}
            </span>
          )}
        </div>

        <p className="mt-4 text-sm text-base-content/70">{labels.syncHint}</p>

        <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm text-base-content/70">
          <li>Conecta tu cuenta de Google con permisos de Classroom.</li>
          <li>Inscribe alumnos en materias en <Link href="/dashboard/inscripciones" className="link link-primary">Inscripciones</Link>.</li>
          <li>Pulsa <strong>Sincronizar</strong> para importar cursos y tareas.</li>
        </ol>

        {!hasOAuth && (
          <div className="mt-4 rounded-lg border border-warning/40 bg-warning/10 px-4 py-3 text-sm">
            Configura <code className="rounded bg-base-200 px-1">GOOGLE_OAUTH_CLIENT_ID</code> y{" "}
            <code className="rounded bg-base-200 px-1">GOOGLE_OAUTH_CLIENT_SECRET</code> en{" "}
            <code className="rounded bg-base-200 px-1">.env.local</code> y Vercel.
          </div>
        )}

        {hasOAuth && (
          <div className="mt-4 rounded-lg border border-warning/40 bg-warning/10 px-4 py-3 text-sm">
            <p className="font-semibold">Si Google muestra Error 400: redirect_uri_mismatch</p>
            <p className="mt-1 text-base-content/70">
              En Google Cloud → Credenciales → tu cliente OAuth (Web) → Authorized redirect URIs, agrega exactamente:
            </p>
            <code className="mt-2 block break-all rounded bg-base-200 px-2 py-1 text-xs">{redirectUri}</code>
          </div>
        )}

        <div className="mt-6 flex flex-wrap gap-3">
          <ClassroomActions disabled={!hasOAuth} isConnected={isConnected} />
          <Link href="/dashboard/tareas" className="btn btn-ghost btn-sm">
            Ver tareas
          </Link>
        </div>
      </div>
    </div>
  )
}
