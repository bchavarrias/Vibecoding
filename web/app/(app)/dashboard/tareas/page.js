import config from "@/config"
import { createClient } from "@/lib/supabase/server"
import { deleteTarea, marcarRecordatorioEnviado } from "../actions"
import TareaForm from "./TareaForm"

const labels = config.dashboard.tareas
const dateFmt = new Intl.DateTimeFormat("es-MX", {
  day: "numeric",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
})

export const metadata = { title: labels.pageTitle }

export default async function TareasPage() {
  const supabase = await createClient()

  const [{ data: alumnos }, { data: materias }, { data: tareas, error }] =
    await Promise.all([
      supabase.from("core_items").select("id, nombre, celular").order("nombre"),
      supabase.from("materias").select("id, nombre").order("nombre"),
      supabase
        .from("tareas")
        .select(
          "id, titulo, fecha_entrega, recordatorio_enviado, classroom_coursework_id, alumno:core_items(nombre, celular), materia:materias(nombre)"
        )
        .order("fecha_entrega", { ascending: true }),
    ])

  const iaEnabled =
    config.features.structuredTareas && Boolean(process.env.OPENAI_API_KEY)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{labels.pageTitle}</h1>
        <p className="mt-1 text-sm text-base-content/70">{labels.subtitle}</p>
      </div>

      <TareaForm
        alumnos={alumnos ?? []}
        materias={materias ?? []}
        labels={labels.form}
        iaLabels={config.dashboard.tareas.parseAviso}
        iaEnabled={iaEnabled}
      />

      {config.features.structuredTareas && !process.env.OPENAI_API_KEY && (
        <p className="text-sm text-base-content/60">{config.dashboard.tareas.parseAviso.noKey}</p>
      )}

      {error && (
        <div className="rounded-lg border border-error/40 bg-error/10 px-4 py-3 text-sm text-error">
          {labels.list.error}: {error.message}
        </div>
      )}

      {!tareas?.length ? (
        <div className="rounded-box border border-dashed border-base-300 bg-base-100 px-4 py-12 text-center text-base-content/60">
          {labels.list.empty}
        </div>
      ) : (
        <div className="overflow-x-auto rounded-box border border-base-200 bg-base-100">
          <h2 className="border-b border-base-200 px-4 py-3 text-sm font-semibold">
            {labels.list.title}
          </h2>
          <table className="table">
            <thead>
              <tr>
                <th>{labels.list.columns.titulo}</th>
                <th>{labels.list.columns.alumno}</th>
                <th>{labels.list.columns.materia}</th>
                <th>{labels.list.columns.fecha}</th>
                <th>{labels.list.columns.recordatorio}</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {tareas.map((t) => (
                <tr key={t.id}>
                  <td className="font-medium">
                    {t.titulo}
                    {t.classroom_coursework_id && (
                      <span className="ml-2 badge badge-ghost badge-xs">Classroom</span>
                    )}
                  </td>
                  <td>{t.alumno?.nombre}</td>
                  <td>{t.materia?.nombre || "—"}</td>
                  <td className="whitespace-nowrap text-sm">
                    {dateFmt.format(new Date(t.fecha_entrega))}
                  </td>
                  <td>
                    <span
                      className={`badge badge-sm ${t.recordatorio_enviado ? "badge-success" : "badge-warning"}`}
                    >
                      {t.recordatorio_enviado ? labels.list.enviado : labels.list.pendiente}
                    </span>
                  </td>
                  <td className="text-right">
                    <div className="flex justify-end gap-1">
                      {!t.recordatorio_enviado && (
                        <form action={marcarRecordatorioEnviado}>
                          <input type="hidden" name="id" value={t.id} />
                          <button type="submit" className="btn btn-ghost btn-xs">
                            Enviar
                          </button>
                        </form>
                      )}
                      <form action={deleteTarea}>
                        <input type="hidden" name="id" value={t.id} />
                        <button type="submit" className="btn btn-ghost btn-xs text-error">
                          {labels.list.delete}
                        </button>
                      </form>
                    </div>
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
