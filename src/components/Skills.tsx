import { skills } from '../data/content'

export function Skills() {
  return (
    <section className="mx-auto max-w-7xl border-t border-cloud px-6 pt-16 pb-24 md:px-10">
      <p className="section-label mb-4">Skills</p>
      <h2 className="mb-14 font-display text-3xl text-ink">
        <span className="font-thin">Tools I reach</span> <span className="font-black">for</span>
      </h2>

      <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
        {skills.map((group) => (
          <div key={group.group}>
            <p className="text-xs font-semibold uppercase tracking-widest text-slate">{group.group}</p>
            <ul className="mt-4 space-y-2.5">
              {group.items.map((item) => (
                <li key={item} className="font-light text-ink">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  )
}
