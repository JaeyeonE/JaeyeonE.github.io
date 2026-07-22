import { profile } from '../data/content'

const links = [
  { label: 'Email', value: profile.email, href: `mailto:${profile.email}` },
  { label: 'GitHub', value: 'github.com/JaeyeonE', href: profile.github },
  { label: 'LinkedIn', value: 'in/jaeyeonelenaheo', href: profile.linkedin },
  { label: 'Velog', value: '@ght010522', href: profile.velog },
]

export function Contact() {
  return (
    <section className="bg-ink pt-32 pb-28 text-paper md:pt-40">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <p className="section-label mb-4 text-slate">Contact</p>
        <h2 className="max-w-2xl font-display text-3xl leading-tight sm:text-4xl lg:text-5xl">
          <span className="font-thin sm:whitespace-nowrap">Working on VLA, RL, or active vision?</span>
          <br />
          <span className="font-black">Let's talk.</span>
        </h2>

        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              target={l.label === 'Email' ? undefined : '_blank'}
              rel={l.label === 'Email' ? undefined : 'noreferrer'}
              className="group block rounded-2xl border border-white/15 p-6 transition-colors hover:border-white/40"
            >
              <p className="text-xs font-semibold uppercase tracking-widest text-slate">{l.label}</p>
              <p className="mt-2 font-light text-cloud transition-colors group-hover:text-paper">
                {l.value} ↗
              </p>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
