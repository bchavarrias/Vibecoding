import Link from "next/link"
import { redirect } from "next/navigation"
import config from "@/config"
import { getUser } from "@/lib/supabase/server"
import UserMenu from "@/components/auth/UserMenu"
import BrandLogo from "@/components/BrandLogo"
import SkipToContent from "@/components/layout/SkipToContent"
import DashboardNav from "@/components/layout/DashboardNav"
import { dashboardNavItems } from "@/lib/dashboardNav"

export default async function AppLayout({ children }) {
  const user = await getUser()
  if (!user) redirect(config.auth.loginUrl)

  return (
    <div className="flex min-h-screen flex-col bg-base-200">
      <SkipToContent targetId="main-content" />
      <header className="sticky top-0 z-40 border-b border-base-200 bg-base-100/95 backdrop-blur">
        <div className="flex items-center justify-between px-4 py-3">
          <Link href="/dashboard" className="rounded-lg transition-opacity hover:opacity-90">
            <BrandLogo size="sm" />
          </Link>
          <UserMenu user={user} />
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-6xl flex-1 gap-6 px-4 py-6 pb-24 md:pb-6">
        <DashboardNav items={dashboardNavItems} />
        <main id="main-content" className="min-w-0 flex-1" tabIndex={-1}>
          {children}
        </main>
      </div>
    </div>
  )
}
