import { interests, education, certifications } from '../data/content'

export function About() {
  return (
    <section className="mx-auto max-w-7xl px-6 pt-32 pb-24 md:px-10 md:pt-40">
      <p className="section-label mb-4">About</p>

      <div className="grid grid-cols-1 gap-16 md:grid-cols-5">
        <div className="md:col-span-2">
          <h2 className="font-display text-3xl leading-tight text-ink">
            <span className="font-thin">The seam between</span> <span className="font-black">seeing</span>{' '}
            <span className="font-thin">and</span> <span className="font-black">acting</span>
            <span className="font-thin">.</span>
          </h2>
          <p className="mt-6 font-light leading-relaxed text-graphite">
            A computer engineering student transitioning from detection-first computer vision to robot
            manipulation. Currently a researcher at AGA Lab, UNIST, working on VLA, reinforcement
            learning, and computer vision.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:col-span-3">
          {interests.map((item) => (
            <div key={item.name} className="rounded-2xl border border-cloud p-6 transition-colors hover:border-ash">
              <p className="text-xs font-semibold uppercase tracking-widest text-ink">{item.name}</p>
              <p className="mt-2 text-sm font-medium text-ink">{item.full}</p>
              <p className="mt-2 text-sm font-light leading-relaxed text-graphite">{item.blurb}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-20 grid grid-cols-1 gap-12 border-t border-cloud pt-12 md:grid-cols-2">
        <div>
          <h3 className="mb-6 text-sm font-semibold uppercase tracking-widest text-slate">Education</h3>
          <ul className="space-y-6">
            {education.map((e) => (
              <li key={e.org}>
                <p className="font-medium text-ink">{e.org}</p>
                <p className="text-sm font-light text-graphite">{e.detail}</p>
                <p className="mt-1 text-xs text-slate">{e.period}</p>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="mb-6 text-sm font-semibold uppercase tracking-widest text-slate">Certifications</h3>
          <ul className="space-y-6">
            {certifications.map((c) => (
              <li key={c.name}>
                <p className="font-medium text-ink">{c.name}</p>
                <p className="text-sm font-light text-graphite">
                  {c.org}
                  {c.date ? ` · ${c.date}` : ''}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
