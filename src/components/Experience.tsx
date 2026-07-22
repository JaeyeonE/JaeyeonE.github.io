import { experience } from '../data/content'

export function Experience() {
  return (
    <section className="bg-mist pt-32 pb-24 md:pt-40">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <p className="section-label mb-4">Experience</p>
        <h2 className="mb-14 font-display text-3xl text-ink">
          <span className="font-thin">Research</span> <span className="font-black">experience</span>
        </h2>

        <div className="space-y-10">
          {experience.map((e) => (
            <div key={e.org} className="grid grid-cols-1 gap-4 border-t border-cloud pt-8 md:grid-cols-4">
              <div className="md:col-span-1">
                <p className="text-sm font-medium text-ink">{e.role}</p>
                <p className="mt-1 text-xs text-slate">{e.period}</p>
              </div>
              <div className="md:col-span-3">
                {e.href ? (
                  <a
                    href={e.href}
                    target="_blank"
                    rel="noreferrer"
                    className="font-medium text-ink underline decoration-cloud decoration-2 underline-offset-4"
                  >
                    {e.org} ↗
                  </a>
                ) : (
                  <p className="font-medium text-ink">{e.org}</p>
                )}
                <ul className="mt-3 space-y-2">
                  {e.points.map((p) => (
                    <li key={p} className="text-sm font-light leading-relaxed text-graphite">
                      — {p}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
