export default function LandingSectionHeader({
  titleId,
  eyebrow,
  title,
  subtitle,
  centered = true,
}) {
  return (
    <header className={centered ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      {eyebrow && (
        <p className="text-sm font-medium uppercase tracking-wider text-primary">{eyebrow}</p>
      )}
      <h2
        id={titleId}
        className="mt-3 text-balance text-3xl font-bold tracking-tight md:text-4xl"
      >
        {title}
      </h2>
      {subtitle && <p className="mt-4 text-base-content/70">{subtitle}</p>}
    </header>
  )
}
