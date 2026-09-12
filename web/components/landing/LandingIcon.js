import * as LucideIcons from "lucide-react"

export default function LandingIcon({ name, className, decorative = true }) {
  const Cmp = LucideIcons[name] || LucideIcons.Square
  return (
    <Cmp
      className={className}
      aria-hidden={decorative ? true : undefined}
      focusable={decorative ? false : undefined}
    />
  )
}
