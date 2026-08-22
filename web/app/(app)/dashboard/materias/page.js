import config from "@/config"
import { createClient } from "@/lib/supabase/server"
import { createMateria } from "../actions"
import MateriaList from "./MateriaList"

const labels = config.dashboard.materias

export const metadata = { title: labels.pageTitle }

export default async function MateriasPage() {
  const supabase = await createClient()
  const { data: materias, error } = await supabase
    .from("materias")
    .select("id, nombre, codigo, classroom_course_name")
    .order("nombre")

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{labels.pageTitle}</h1>
        <p className="mt-1 text-sm text-base-content/70">{labels.subtitle}</p>
      </div>

      <form action={createMateria} className="rounded-box border border-base-200 bg-base-100 p-4">
        <h2 className="mb-4 text-sm font-semibold">{labels.form.title}</h2>
        <div className="flex flex-col gap-3 sm:flex-row">
          <input name="nombre" required placeholder={labels.form.nombre.placeholder} className="input input-bordered flex-1" />
          <input name="codigo" placeholder={labels.form.codigo.placeholder} className="input input-bordered sm:w-40" />
          <button type="submit" className="btn btn-primary">{labels.form.submit}</button>
        </div>
      </form>

      {error && (
        <div className="rounded-lg border border-error/40 bg-error/10 px-4 py-3 text-sm text-error">
          {labels.list.error}: {error.message}
        </div>
      )}

      <MateriaList materias={materias ?? []} labels={labels.list} />
    </div>
  )
}
