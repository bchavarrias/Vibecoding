import config from "@/config"

const BASE = [
  { href: "/dashboard", label: config.dashboard.nav.inicio, icon: "LayoutDashboard" },
  { href: "/dashboard/alumnos", label: config.dashboard.nav.alumnos, icon: "Users" },
  { href: "/dashboard/materias", label: config.dashboard.nav.materias, icon: "BookOpen" },
  { href: "/dashboard/inscripciones", label: config.dashboard.nav.inscripciones, icon: "Link2" },
  { href: "/dashboard/tareas", label: config.dashboard.nav.tareas, icon: "Bell" },
]

if (config.features.classroom) {
  BASE.push({
    href: "/dashboard/classroom",
    label: config.dashboard.nav.classroom,
    icon: "GraduationCap",
  })
}

export const dashboardNavItems = [
  ...BASE,
  ...(config.features.aiChat ? [{ href: "/chat", label: "Chat", icon: "MessageSquare" }] : []),
  ...(config.features.agents ? [{ href: "/agent", label: "Agente", icon: "Bot" }] : []),
]
