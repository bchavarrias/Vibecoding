import config from "@/config"
import LandingSectionHeader from "@/components/landing/LandingSectionHeader"

export default function FAQ() {
  const { eyebrow, title, items } = config.landing.faq

  return (
    <section id="faq" className="border-t border-base-200 bg-base-200/40 py-16 md:py-28" aria-labelledby="faq-heading">
      <div className="mx-auto max-w-3xl px-4">
        <LandingSectionHeader titleId="faq-heading" eyebrow={eyebrow} title={title} />

        <div className="mt-12 space-y-3">
          {items.map((item, i) => (
            <details
              key={i}
              className="group rounded-xl border border-base-300 bg-base-100 p-5 transition-all duration-200 open:border-primary/30 open:shadow-sm"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium marker:content-none [&::-webkit-details-marker]:hidden">
                {item.q}
                <span
                  className="text-xl leading-none text-base-content/40 transition-transform duration-200 group-open:rotate-45"
                  aria-hidden
                >
                  +
                </span>
              </summary>
              <p className="mt-3 text-sm leading-6 text-base-content/70">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
