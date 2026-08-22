import config from "@/config"
import Logo from "@/components/Logo"

// Marca dual: Chavarría's Org + logo UTCH (config.brand.utchLogoSrc).
export default function BrandLogo({ className = "", showTagline = false, size = "md" }) {
  const sizes = {
    sm: { org: "size-6", utch: "size-7", text: "text-sm" },
    md: { org: "size-7", utch: "size-9", text: "text-lg" },
    lg: { org: "size-8", utch: "size-11", text: "text-xl" },
  }
  const s = sizes[size] || sizes.md

  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      {config.brand.utchLogoSrc && (
        <img
          src={config.brand.utchLogoSrc}
          alt="Universidad Tecnológica de Chihuahua"
          className={`${s.utch} shrink-0 rounded-full object-contain`}
        />
      )}
      <span className="flex flex-col leading-tight">
        <span className={`flex items-center gap-1.5 font-bold tracking-tight ${s.text}`}>
          <Logo className={s.org} />
          {config.brand.logoText}
        </span>
        {showTagline && config.brand.tagline && (
          <span className="text-xs font-medium text-base-content/60">{config.brand.tagline}</span>
        )}
      </span>
    </span>
  )
}
