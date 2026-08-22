import config from "@/config"
import { createClient } from "@/lib/supabase/server"
import {
  createInscripcion,
  deleteInscripcion,
} from "../actions"
import {
  cuatrimestreOptions,
  getPeriodoFromDate,
  periodoLabel,
  periodoOptions,
} from "@/lib/academico"

const labels = config.dashboard.inscripciones

export const metadata = { title: labels.pageTitle }

export default async function InscripcionesPage() {
  const supabase = await createClient()
  const periodoActual = getPeriodoFromDate()
  const anioActual = new Date().getFullYear()

  const [{ data: alumnos }, { data: materias }, { data: inscripciones, error }] =
    await Promise.all([
      supabase.from("core_items").select("id, nombre").order("nombre"),
      supabase.from("materias").select("id, nombre").order("nombre"),
      supabase
        .from("inscripciones")
        .select(
          "id, cuatrimestre, anio, periodo, alumno:core_items(nombre), materia:materias(nombre)"
        )
        .order("created_at", { ascending: false }),
    ])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{labels.pageTitle}</h1>
        <p className="mt-1 text-sm text-base-content/70">{labels.subtitle}</p>
      </div>

      <form action={createInscripcion} className="rounded-box border border-base-200 bg-base-100 p-4">
        <h2 className="mb-4 text-sm font-semibold">{labels.form.title}</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <label className="form-control">
            <span className="label-text mb-1">{labels.form.alumno.label}</span>
            <select name="alumno_id" required className="select select-bordered" defaultValue="">
              <option value="" disabled>Selecciona alumno</option>
              {(alumnos ?? []).map((a) => (
                <option key={a.id} value={a.id}>{a.nombre}</option>
              ))}
            </select>
          </label>
          <label className="form-control">
            <span className="label-text mb-1">{labels.form.materia.label}</span>
            <select name="materia_id" required className="select select-bordered" defaultValue="">
              <option value="" disabled>Selecciona materia</option>
              {(materias ?? []).map((m) => (
                <option key={m.id} value={m.id}>{m.nombre}</option>
              ))}
            </select>
          </label>
          <label className="form-control">
            <span className="label-text mb-1">{labels.form.cuatrimestre.label}</span>
            <select name="cuatrimestre" required className="select select-bordered" defaultValue="1">
              {cuatrimestreOptions().map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </label>
          <label className="form-control">
            <span className="label-text mb-1">{labels.form.anio.label}</span>
            <input name="anio" type="number" required defaultValue={anioActual} min={2020} max={2100} className="input input-bordered" />
          </label>
          <label className="form-control">
            <span className="label-text mb-1">{labels.form.periodo.label}</span>
            <select name="periodo" required className="select select-bordered" defaultValue={periodoActual.id}>
              {periodoOptions().map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </label>
          <div className="flex items-end">
            <button type="submit" className="btn btn-primary w-full">{labels.form.submit}</button>
          </div>
        </div>
      </form>

      {error && (
        <div className="rounded-lg border border-error/40 bg-error/10 px-4 py-3 text-sm text-error">
          {labels.list.error}: {error.message}
        </div>
      )}

      {!inscripciones?.length ? (
        <div className="rounded-box border border-dashed border-base-300 bg-base-100 px-4 py-12 text-center text-base-content/60">
          {labels.list.empty}
        </div>
      ) : (
        <div className="overflow-x-auto rounded-box border border-base-200 bg-base-100">
          <h2 className="border-b border-base-200 px-4 py-3 text-sm font-semibold">{labels.list.title}</h2>
          <table className="table">
            <thead>
              <tr>
                <th>{labels.list.columns.alumno}</th>
                <th>{labels.list.columns.materia}</th>
                <th>{labels.list.columns.cuatrimestre}</th>
                <th>{labels.list.columns.periodo}</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {inscripciones.map((ins) => (
                <tr key={ins.id}>
                  <td>{ins.alumno?.nombre}</td>
                  <td>{ins.materia?.nombre}</td>
                  <td>{ins.cuatrimestre}°</td>
                  <td>{periodoLabel(ins.anio, ins.periodo)}</td>
                  <td className="text-right">
                    <form action={deleteInscripcion}>
                      <input type="hidden" name="id" value={ins.id} />
                      <button type="submit" className="btn btn-ghost btn-sm text-error">
                        {labels.list.delete}
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
