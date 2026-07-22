import { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'

const links = [
  { to: '/about', label: 'About' },
  { to: '/experience', label: 'Experience' },
  { to: '/projects', label: 'Projects' },
  { to: '/awards', label: 'Awards' },
  { to: '/contact', label: 'Contact' },
]

export function Nav() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled ? 'border-b border-cloud bg-paper/85 backdrop-blur-md' : 'bg-transparent'
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 md:px-10">
        <Link to="/" className="font-display text-sm font-semibold tracking-[0.2em] text-ink">
          JAEYEON HEO
        </Link>

        <ul className="hidden gap-8 md:flex">
          {links.map((l) => (
            <li key={l.to}>
              <NavLink
                to={l.to}
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors hover:text-ink ${isActive ? 'text-ink' : 'text-graphite'}`
                }
              >
                {l.label}
              </NavLink>
            </li>
          ))}
        </ul>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-cloud md:hidden"
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          <span className="sr-only">Menu</span>
          <div className="flex flex-col gap-1.5">
            <span className="h-px w-4 bg-ink" />
            <span className="h-px w-4 bg-ink" />
          </div>
        </button>
      </nav>

      {open && (
        <ul className="flex flex-col gap-1 border-t border-cloud bg-paper px-6 pb-6 md:hidden">
          {links.map((l) => (
            <li key={l.to}>
              <NavLink
                to={l.to}
                onClick={() => setOpen(false)}
                className="block py-3 text-sm font-medium text-graphite"
              >
                {l.label}
              </NavLink>
            </li>
          ))}
        </ul>
      )}
    </header>
  )
}
