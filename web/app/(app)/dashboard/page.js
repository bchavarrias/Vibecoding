import Link from "next/link"
import { Users, BookOpen, Link2, Bell, GraduationCap } from "lucide-react"
import config from "@/config"
import { createClient } from "@/lib/supabase/server"
import { getPeriodoFromDate, periodoLabel } from "@/lib/academico"
import BrandLogo from "@/components/BrandLogo"

export const metadata = { title: config.dashboard.inicio.pageTitle }

export default async function DashboardHomePage() {
  const supabase = await createClient()
  const periodo = getPeriodoFromDate()
  const anio = new Date().getFullYear()

  const [alumnos, materias, inscripciones, tareas] = await Promise.all([
    supabase.from("core_items").select("id", { count: "exact", head: true }),
    supabase.from("materias").select("id", { count: "exact", head: true }),
    supabase.from("inscripciones").select("id", { count: "exact", head: true }),
    supabase
      .from("tareas")
      .select("id", { count: "exact", head: true })
      .eq("recordatorio_enviado", false),
  ])

  const stats = [
    { label: "Alumnos", count: alumnos.count ?? 0, href: "/dashboard/alumnos", icon: Users },
    { label: "Materias", count: materias.count ?? 0, href: "/dashboard/materias", icon: BookOpen },
    {
      label: "Inscripciones",
      count: inscripciones.count ?? 0,
      href: "/dashboard/inscripciones",
      icon: Link2,
    },
    {
      label: "Recordatorios pendientes",
      count: tareas.count ?? 0,
      href: "/dashboard/tareas",
      icon: Bell,
    },
  ]

  return (
    <div className="space-y-8">
      <div className="rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 via-base-100 to-base-100 p-6">
        <BrandLogo size="lg" showTagline />
        <h1 className="mt-4 text-2xl font-bold tracking-tight">
          {config.dashboard.inicio.pageTitle}
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-base-content/70">
          {config.dashboard.inicio.subtitle}
        </p>
        <p className="mt-3 text-xs font-medium text-primary">
          Periodo actual: {periodoLabel(anio, periodo.id)}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(({ label, count, href, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="rounded-box border border-base-200 bg-base-100 p-5 transition hover:border-primary/40 hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <Icon className="size-5 text-primary" />
              <span className="text-3xl font-bold">{count}</span>
            </div>
            <p className="mt-2 text-sm font-medium text-base-content/70">{label}</p>
          </Link>
        ))}
      </div>

      {config.features.classroom && (
        <div className="rounded-box border border-base-200 bg-base-100 p-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <GraduationCap className="size-6 text-primary" />
              <div>
                <p className="font-semibold">Google Classroom</p>
                <p className="text-sm text-base-content/60">
                  Sincroniza cursos y tareas automáticamente.
                </p>
              </div>
            </div>
            <Link href="/dashboard/classroom" className="btn btn-primary btn-sm">
              {config.dashboard.classroom.connect}
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
