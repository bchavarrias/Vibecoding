import Link from "next/link"
import { redirect } from "next/navigation"
import {
  LayoutDashboard,
  Users,
  BookOpen,
  Link2,
  Bell,
  GraduationCap,
  MessageSquare,
  Bot,
} from "lucide-react"
import config from "@/config"
import { getUser } from "@/lib/supabase/server"
import UserMenu from "@/components/auth/UserMenu"
import BrandLogo from "@/components/BrandLogo"

const BASE_NAV = [
  { href: "/dashboard", label: config.dashboard.nav.inicio, icon: LayoutDashboard },
  { href: "/dashboard/alumnos", label: config.dashboard.nav.alumnos, icon: Users },
  { href: "/dashboard/materias", label: config.dashboard.nav.materias, icon: BookOpen },
  { href: "/dashboard/inscripciones", label: config.dashboard.nav.inscripciones, icon: Link2 },
  { href: "/dashboard/tareas", label: config.dashboard.nav.tareas, icon: Bell },
]

if (config.features.classroom) {
  BASE_NAV.push({
    href: "/dashboard/classroom",
    label: config.dashboard.nav.classroom,
    icon: GraduationCap,
  })
}

const NAV = [
  ...BASE_NAV,
  ...(config.features.aiChat
    ? [{ href: "/chat", label: "Chat", icon: MessageSquare }]
    : []),
  ...(config.features.agents
    ? [{ href: "/agent", label: "Agente", icon: Bot }]
    : []),
]

export default async function AppLayout({ children }) {
  const user = await getUser()
  if (!user) redirect(config.auth.loginUrl)

  return (
    <div className="flex min-h-screen flex-col bg-base-200">
      <header className="sticky top-0 z-40 border-b border-base-200 bg-base-100">
        <div className="flex items-center justify-between px-4 py-3">
          <Link href="/dashboard">
            <BrandLogo size="sm" />
          </Link>
          <UserMenu user={user} />
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-6xl flex-1 gap-6 px-4 py-6">
        <aside className="hidden w-56 shrink-0 md:block">
          <nav className="menu rounded-box bg-base-100 p-2">
            {NAV.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-base-200"
              >
                <Icon className="size-4 shrink-0" />
                {label}
              </Link>
            ))}
          </nav>
        </aside>

        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  )
}
