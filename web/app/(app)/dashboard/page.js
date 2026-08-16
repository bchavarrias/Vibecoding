import config from "@/config"
import { createClient } from "@/lib/supabase/server"
import { createAlumno } from "./actions"
import AlumnoList from "./AlumnoList"

const labels = config.dashboard.alumnos

export const metadata = { title: labels.pageTitle }

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: alumnos, error } = await supabase
    .from("core_items")
    .select("id, nombre, telefono, correo, created_at")
    .order("created_at", { ascending: false })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{labels.pageTitle}</h1>
        <p className="mt-1 text-sm text-base-content/70">{labels.subtitle}</p>
      </div>

      <form
        action={createAlumno}
        className="rounded-box border border-base-200 bg-base-100 p-4"
      >
        <h2 className="mb-4 text-sm font-semibold">{labels.form.title}</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <label className="form-control sm:col-span-2 lg:col-span-1">
            <span className="label-text mb-1">{labels.form.nombre.label}</span>
            <input
              name="nombre"
              required
              maxLength={120}
              placeholder={labels.form.nombre.placeholder}
              aria-label={labels.form.nombre.label}
              className="input input-bordered"
            />
          </label>
          <label className="form-control">
            <span className="label-text mb-1">{labels.form.telefono.label}</span>
            <input
              name="telefono"
              required
              maxLength={20}
              placeholder={labels.form.telefono.placeholder}
              aria-label={labels.form.telefono.label}
              className="input input-bordered"
            />
          </label>
          <label className="form-control">
            <span className="label-text mb-1">{labels.form.correo.label}</span>
            <input
              name="correo"
              type="email"
              required
              maxLength={120}
              placeholder={labels.form.correo.placeholder}
              aria-label={labels.form.correo.label}
              className="input input-bordered"
            />
          </label>
          <div className="flex items-end sm:col-span-2 lg:col-span-1">
            <button type="submit" className="btn btn-primary w-full">
              {labels.form.submit}
            </button>
          </div>
        </div>
      </form>

      {error && (
        <div className="rounded-lg border border-error/40 bg-error/10 px-4 py-3 text-sm text-error">
          {labels.list.error}: {error.message}
        </div>
      )}

      <div>
        <h2 className="mb-3 text-sm font-semibold text-base-content/80">
          {labels.list.title}
        </h2>
        <AlumnoList alumnos={alumnos ?? []} labels={labels.list} />
      </div>
    </div>
  )
}
