import type { Project } from '../data/content'
import { projectImages } from '../data/projectImages'

export function ProjectCard({ project, index }: { project: Project; index: number }) {
  return (
    <article className="border-t border-cloud py-16 first:border-t-0 first:pt-0">
      <div className="grid grid-cols-1 gap-10 md:grid-cols-12">
        <div className="md:col-span-4">
          <p className="text-xs font-semibold text-slate">{String(index + 1).padStart(2, '0')}</p>
          <h3 className="mt-3 font-display text-2xl font-medium text-ink">{project.title}</h3>
          <p className="mt-2 text-sm font-light text-graphite">{project.role}</p>
          <p className="mt-1 text-xs text-slate">{project.period}</p>
          {project.status && (
            <span className="mt-4 inline-block rounded-full border border-cloud px-3 py-1 text-xs font-medium text-graphite">
              {project.status}
            </span>
          )}

          <div className="mt-6 flex flex-wrap gap-2">
            {project.stack.map((s) => (
              <span key={s} className="rounded-full border border-cloud px-2.5 py-1 text-[11px] font-medium text-graphite">
                {s}
              </span>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap gap-5">
            {project.links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                target="_blank"
                rel="noreferrer"
                className="text-sm font-medium text-ink underline decoration-cloud decoration-2 underline-offset-4 transition-colors hover:decoration-ink"
              >
                {l.label} ↗
              </a>
            ))}
            {project.video && (
              <a
                href={project.video.href}
                target="_blank"
                rel="noreferrer"
                className="text-sm font-medium text-ink underline decoration-cloud decoration-2 underline-offset-4 transition-colors hover:decoration-ink"
              >
                {project.video.label} ↗
              </a>
            )}
          </div>
        </div>

        <div className="md:col-span-8">
          <p className="font-light leading-relaxed text-graphite">{project.problem}</p>

          <div className="mt-6">
            <p className="text-xs font-semibold uppercase tracking-widest text-slate">Approach</p>
            <ul className="mt-3 space-y-2.5">
              {project.approach.map((a) => (
                <li key={a} className="text-sm font-light leading-relaxed text-graphite">
                  — {a}
                </li>
              ))}
            </ul>
          </div>

          {project.stats && (
            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
              {project.stats.map((s) => (
                <div key={s.label}>
                  <p className="font-display text-3xl font-black text-ink">{s.value}</p>
                  <p className="mt-1 text-xs font-light leading-snug text-graphite">{s.label}</p>
                </div>
              ))}
            </div>
          )}

          {!project.stats && project.results.length > 0 && (
            <div className="mt-8">
              <p className="text-xs font-semibold uppercase tracking-widest text-slate">Result</p>
              <ul className="mt-3 space-y-2.5">
                {project.results.map((r) => (
                  <li key={r} className="text-sm font-light leading-relaxed text-graphite">
                    — {r}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {project.images && (
            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {project.images.map((img) => (
                <div key={img.src} className="overflow-hidden rounded-xl border border-cloud">
                  <img
                    src={projectImages[img.src]}
                    alt={img.alt}
                    loading="lazy"
                    className="aspect-[4/3] w-full object-cover grayscale-[35%] transition-all duration-500 hover:grayscale-0"
                  />
                </div>
              ))}
            </div>
          )}

          {project.video?.embedId && (
            <div className="mt-8 aspect-video w-full overflow-hidden rounded-xl border border-cloud">
              <iframe
                className="h-full w-full"
                src={`https://www.youtube-nocookie.com/embed/${project.video.embedId}`}
                title={`${project.title} demo video`}
                loading="lazy"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          )}
        </div>
      </div>
    </article>
  )
}
