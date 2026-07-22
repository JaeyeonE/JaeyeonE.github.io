import { projects, otherProjects } from '../data/content'
import { ProjectCard } from './ProjectCard'

export function Projects() {
  return (
    <section className="mx-auto max-w-7xl px-6 pt-32 pb-24 md:px-10 md:pt-40">
      <p className="section-label mb-4">Projects</p>
      <h2 className="mb-4 font-display text-3xl text-ink">
        <span className="font-thin">Selected</span> <span className="font-black">work</span>
      </h2>
      <p className="max-w-xl font-light text-graphite">
        From exploring zero-shot vision-language grounding independently to building a complete
        perception-to-grasp robot pipeline with a team.
      </p>

      <div className="mt-8">
        {projects.map((p, i) => (
          <ProjectCard key={p.slug} project={p} index={i} />
        ))}
      </div>

      <div className="mt-8 border-t border-cloud pt-12">
        <p className="text-xs font-semibold uppercase tracking-widest text-slate">Other projects & experiments</p>
        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {otherProjects.map((p) => (
            <div key={p.title} className="rounded-2xl border border-cloud p-6">
              <div className="flex items-baseline justify-between gap-4">
                <p className="font-medium text-ink">{p.title}</p>
                <p className="text-xs text-slate">{p.period}</p>
              </div>
              <p className="mt-1 text-xs font-medium text-slate">{p.role}</p>
              <p className="mt-3 text-sm font-light leading-relaxed text-graphite">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
