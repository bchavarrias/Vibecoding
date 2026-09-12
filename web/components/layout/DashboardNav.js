"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import * as LucideIcons from "lucide-react"
import { Menu } from "lucide-react"

function NavIcon({ name, className }) {
  const Cmp = LucideIcons[name] || LucideIcons.Circle
  return <Cmp className={className} aria-hidden />
}

function navLinkClass(isActive) {
  return [
    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-200",
    isActive
      ? "bg-primary/10 text-primary"
      : "text-base-content/80 hover:bg-base-200 hover:text-base-content",
  ].join(" ")
}

function isActivePath(pathname, href) {
  if (href === "/dashboard") return pathname === "/dashboard"
  return pathname === href || pathname.startsWith(`${href}/`)
}

export default function DashboardNav({ items }) {
  const pathname = usePathname()

  return (
    <>
      <aside
        className="hidden w-56 shrink-0 md:block"
        aria-label="Navegación del panel"
      >
        <nav className="menu rounded-box border border-base-200 bg-base-100 p-2">
          <ul>
            {items.map(({ href, label, icon }) => {
              const active = isActivePath(pathname, href)
              return (
                <li key={href}>
                  <Link
                    href={href}
                    className={navLinkClass(active)}
                    aria-current={active ? "page" : undefined}
                  >
                    <NavIcon name={icon} className="size-4 shrink-0" />
                    {label}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>
      </aside>

      <div className="dropdown dropdown-end fixed bottom-4 right-4 z-50 md:hidden">
        <label
          tabIndex={0}
          className="btn btn-primary btn-circle shadow-lg transition-transform duration-200 hover:scale-105 active:scale-95"
          aria-label="Abrir menú del panel"
        >
          <Menu className="size-5" />
        </label>
        <nav
          tabIndex={0}
          className="dropdown-content menu z-50 mb-2 max-h-[70vh] w-56 overflow-y-auto rounded-box border border-base-200 bg-base-100 p-2 shadow-xl"
          aria-label="Menú del panel"
        >
          {items.map(({ href, label, icon }) => {
            const active = isActivePath(pathname, href)
            return (
              <li key={href}>
                <Link href={href} className={active ? "active font-medium" : ""} aria-current={active ? "page" : undefined}>
                  <NavIcon name={icon} className="size-4" />
                  {label}
                </Link>
              </li>
            )
          })}
        </nav>
      </div>
    </>
  )
}
