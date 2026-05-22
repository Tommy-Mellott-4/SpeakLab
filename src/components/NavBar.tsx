import { useState, useEffect, useRef } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useApiKey } from '@/hooks/useApiKey'

interface NavLinkItem {
  label: string
  path: string
}

const NAV_LINKS: NavLinkItem[] = [
  { label: 'Practice', path: '/' },
  { label: 'Challenges', path: '/challenge' },
  { label: 'History', path: '/history' },
]

export default function NavBar() {
  const { clearKey } = useApiKey()
  const navigate = useNavigate()
  const [clearPending, setClearPending] = useState(false)
  const clearTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  function handleSettingsClick() {
    if (clearPending) {
      clearKey()
      navigate('/onboarding', { replace: true })
    } else {
      setClearPending(true)
      clearTimerRef.current = setTimeout(() => setClearPending(false), 2000)
    }
  }

  useEffect(() => {
    return () => {
      if (clearTimerRef.current) clearTimeout(clearTimerRef.current)
    }
  }, [])

  return (
    <header
      className="animate-page-enter fixed top-0 left-0 right-0 z-50 h-14"
      style={{
        backgroundColor: 'oklch(8% 0.008 270 / 85%)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--color-border-subtle)',
      }}
    >
      <nav className="max-w-5xl mx-auto px-6 flex items-center justify-between h-full">

        {/* Wordmark */}
        <NavLink
          to="/"
          className="flex items-center gap-2 transition-opacity duration-150 hover:opacity-80"
        >
          <span
            className="w-2 h-2 rounded-full flex-shrink-0"
            style={{ backgroundColor: 'var(--color-accent)' }}
          />
          <span
            className="text-sm font-semibold tracking-wide"
            style={{ color: 'var(--color-text-primary)' }}
          >
            SpeakLab
          </span>
        </NavLink>

        {/* Center nav links — collapsed on mobile */}
        <div className="hidden sm:flex items-center gap-1">
          {NAV_LINKS.map(({ label, path }) => (
            <NavLink
              key={path}
              to={path}
              end={path === '/'}
              className="relative px-4 py-1.5 text-sm rounded-md transition-colors duration-150"
              style={({ isActive }) => ({
                color: isActive ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
                fontWeight: isActive ? 500 : 400,
              })}
            >
              {({ isActive }) => (
                <>
                  {label}
                  {isActive && (
                    <span
                      className="absolute bottom-0 left-4 right-4 h-0.5 rounded-full"
                      style={{ backgroundColor: 'var(--color-accent)' }}
                    />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </div>

        {/* Settings / clear key */}
        <button
          onClick={handleSettingsClick}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs transition-all duration-150 active:scale-[0.97]"
          style={{
            color: clearPending ? 'oklch(60% 0.18 25)' : 'var(--color-text-muted)',
            backgroundColor: clearPending ? 'oklch(60% 0.18 25 / 10%)' : 'transparent',
          }}
          title="API key settings"
        >
          {clearPending ? (
            'Clear key?'
          ) : (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="8" cy="8" r="2" fill="currentColor" />
              <path
                d="M8 2v1M8 13v1M2 8h1M13 8h1M3.5 3.5l.7.7M11.8 11.8l.7.7M11.8 3.5l-.7.7M3.5 11.8l-.7.7"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          )}
        </button>

      </nav>
    </header>
  )
}
