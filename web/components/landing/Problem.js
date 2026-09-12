import config from "@/config"
import LandingIcon from "@/components/landing/LandingIcon"
import LandingSectionHeader from "@/components/landing/LandingSectionHeader"

export default function Problem() {
  const { eyebrow, title, subtitle, items } = config.landing.problem

  return (
    <section id="how" className="border-t border-base-200 bg-base-200/40 py-16 md:py-28" aria-labelledby="how-heading">
      <div className="mx-auto max-w-6xl px-4">
        <LandingSectionHeader
          titleId="how-heading"
          eyebrow={eyebrow}
          title={title}
          subtitle={subtitle}
        />

        <ul className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3" role="list">
          {items.map((item) => (
            <li
              key={item.title}
              className="card-interactive rounded-2xl border border-base-200 bg-base-100 p-6"
            >
              <div className="mb-4 inline-flex size-10 items-center justify-center rounded-xl bg-error/10 text-error">
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
