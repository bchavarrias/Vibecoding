import Link from "next/link"
import { Menu } from "lucide-react"
import config from "@/config"
import BrandLogo from "@/components/BrandLogo"

const linkClass =
  "text-sm text-base-content/70 transition-colors duration-200 hover:text-base-content"

export default function Navbar() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-base-200 bg-base-100/80 backdrop-blur">
      <nav
        className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3"
        aria-label="Principal"
      >
        <div className="flex items-center gap-2">
          <div className="dropdown md:hidden">
            <label
              tabIndex={0}
              className="btn btn-ghost btn-sm px-2 transition-transform duration-200 active:scale-95"
              aria-label="Abrir menú de navegación"
            >
              <Menu className="size-5" aria-hidden />
            </label>
            <ul
              tabIndex={0}
              className="menu dropdown-content z-50 mt-2 w-52 rounded-box border border-base-200 bg-base-100 p-2 shadow-lg"
              role="list"
            >
              {config.landing.nav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className={linkClass}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <Link href="/" className="flex items-center gap-2 rounded-lg transition-opacity hover:opacity-90">
            <BrandLogo size="sm" />
          </Link>
        </div>

        <ul className="hidden items-center gap-6 md:flex" role="list">
          {config.landing.nav.map((item) => (
            <li key={item.href}>
              <Link href={item.href} className={linkClass}>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          {config.features.googleAuth && (
            <Link href={config.auth.loginUrl} className="btn btn-sm btn-ghost btn-interactive">
              Entrar
            </Link>
          )}
          <Link href="#waitlist" className="btn btn-sm btn-accent btn-interactive">
            {config.landing.hero.cta.label}
          </Link>
        </div>
      </nav>
    </header>
  )
}
