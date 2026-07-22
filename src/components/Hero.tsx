import { lazy, Suspense } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { profile, interests } from '../data/content'

const HeroScene = lazy(() => import('./hero/HeroScene').then((m) => ({ default: m.HeroScene })))

function ScenePlaceholder() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="h-40 w-40 rounded-full border border-cloud sm:h-52 sm:w-52" />
    </div>
  )
}

export function Hero() {
  return (
    <section className="relative h-screen min-h-[640px] overflow-hidden bg-mist">
      <div className="absolute inset-0">
        <Suspense fallback={<ScenePlaceholder />}>
          <HeroScene />
        </Suspense>
      </div>

      {/* Soft readability backdrop for the text — fades out rather than a hard
          box edge, so the robot can still move freely behind/through it.
          Top-to-bottom on narrow screens (text sits above the fold), left-to-
          right on wider ones (text sits in the left column). */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-mist via-mist/70 to-transparent md:bg-gradient-to-r md:from-mist md:via-mist/70 md:to-transparent md:w-3/5" />

      <div className="pointer-events-none relative z-10 mx-auto flex h-full max-w-7xl items-center px-6 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="max-w-xl"
        >
          <p className="section-label mb-6">{profile.title}</p>
          <h1 className="text-balance font-display text-5xl leading-[1.08] tracking-tight text-ink sm:text-6xl lg:text-[4.1rem]">
            <span className="font-thin">I build on what I've</span>{' '}
            <span className="font-black">learned</span>
            <span className="font-thin"> and create what is</span>{' '}
            <span className="font-black">needed</span>
            <span className="font-thin">.</span>
          </h1>
          <p className="mt-8 max-w-md font-light leading-relaxed text-graphite">
            {profile.name} — building robot manipulation systems that see with purpose.
          </p>

          <div className="mt-10 flex flex-wrap gap-2">
            {interests.map((item) => (
              <span
                key={item.name}
                className="rounded-full border border-cloud px-3 py-1 text-xs font-medium text-graphite"
              >
                {item.name}
              </span>
            ))}
          </div>

          <div className="pointer-events-auto mt-10 flex flex-wrap items-center gap-6">
            <Link
              to="/projects"
              className="rounded-full bg-ink px-6 py-3 text-sm font-medium text-ash transition-colors hover:bg-graphite hover:text-paper"
            >
              View projects
            </Link>
            <Link
              to="/contact"
              className="text-sm font-medium text-ink underline decoration-cloud decoration-2 underline-offset-4 transition-colors hover:decoration-ink"
            >
              Get in touch
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
