import config from "@/config"
import LandingIcon from "@/components/landing/LandingIcon"
import LandingSectionHeader from "@/components/landing/LandingSectionHeader"

const CHIP_COLORS = [
  "bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-content",
  "bg-accent/10 text-accent group-hover:bg-accent group-hover:text-accent-content",
  "bg-info/10 text-info group-hover:bg-info group-hover:text-info-content",
  "bg-success/10 text-success group-hover:bg-success group-hover:text-success-content",
]

export default function Features() {
  const { eyebrow, title, subtitle, items } = config.landing.features

  return (
    <section
      id="features"
      className="border-t border-base-200 bg-base-100 py-16 md:py-28"
      aria-labelledby="features-heading"
    >
      <div className="mx-auto max-w-6xl px-4">
        <LandingSectionHeader
          titleId="features-heading"
          eyebrow={eyebrow}
          title={title}
          subtitle={subtitle}
        />

        <ul className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3" role="list">
          {items.map((item, i) => (
            <li
              key={item.title}
              className="group card-interactive rounded-2xl border border-base-200 bg-base-100 p-6 hover:border-primary/40"
            >
              <div
                className={
                  "mb-4 inline-flex size-10 items-center justify-center rounded-xl transition-colors duration-200 " +
                  CHIP_COLORS[i % CHIP_COLORS.length]
                }
              >
                <LandingIcon name={item.icon} className="size-5" />
              </div>
              <h3 className="text-lg font-semibold">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-base-content/70">{item.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
