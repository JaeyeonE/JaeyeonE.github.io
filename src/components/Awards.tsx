import { awards } from '../data/content'

const years = [...new Set(awards.map((a) => a.year))].sort((a, b) => Number(b) - Number(a))

export function Awards() {
  return (
    <section className="bg-mist pt-32 pb-24 md:pt-40">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <p className="section-label mb-4">Awards</p>
        <h2 className="mb-14 font-display text-3xl text-ink">
          <span className="font-thin">Competitions &</span> <span className="font-black">recognition</span>
        </h2>

        <div className="space-y-14">
          {years.map((year) => (
            <div key={year}>
              <p className="mb-6 font-display text-sm font-bold text-ink">{year}</p>
              <div className="grid grid-cols-1 gap-x-10 gap-y-8 md:grid-cols-2">
                {awards
                  .filter((a) => a.year === year)
                  .map((a) => (
                    <div key={a.title} className="border-t border-cloud pt-6">
                      <p className="font-medium leading-snug text-ink">
                        {a.title} <span className="font-light text-slate">— {a.rank}</span>
                      </p>
                      {a.desc && <p className="mt-1.5 text-sm font-light leading-relaxed text-graphite">{a.desc}</p>}
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
