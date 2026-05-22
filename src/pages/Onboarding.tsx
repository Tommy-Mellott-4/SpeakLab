import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useApiKey, isValidApiKeyFormat } from '@/hooks/useApiKey'

type ValidationError = 'prefix' | 'length' | null

function getValidationError(value: string): ValidationError {
  if (value.length === 0) return null
  if (!value.startsWith('sk-ant-')) return 'prefix'
  if (value.length <= 20) return 'length'
  return null
}

export default function Onboarding() {
  const { hasValidKey, saveKey } = useApiKey()
  const navigate = useNavigate()

  const [inputValue, setInputValue] = useState('')
  const [touched, setTouched] = useState(false)
  const [submitError, setSubmitError] = useState(false)

  if (hasValidKey) {
    return <Navigate to="/" replace />
  }

  const validationError = touched || submitError ? getValidationError(inputValue.trim()) : null
  const isSubmittable = inputValue.trim().length > 0 && isValidApiKeyFormat(inputValue.trim())

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitError(true)
    const success = saveKey(inputValue)
    if (success) {
      navigate('/', { replace: true })
    }
  }

  return (
    <div className="min-h-[100dvh] flex items-center" style={{ backgroundColor: 'var(--color-surface-base)' }}>
      <div className="w-full max-w-5xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-2 gap-16">

        {/* Left column — form */}
        <div className="animate-page-enter">
          {/* Wordmark */}
          <div className="flex items-center gap-2 mb-12">
            <span
              className="w-2 h-2 rounded-full flex-shrink-0"
              style={{ backgroundColor: 'var(--color-accent)' }}
            />
            <span className="text-sm font-semibold tracking-wide" style={{ color: 'var(--color-text-secondary)' }}>
              SPEAKLAB
            </span>
          </div>

          <h1
            className="text-4xl font-bold tracking-tight leading-none mb-3"
            style={{ color: 'var(--color-text-primary)' }}
          >
            Welcome to SpeakLab
          </h1>
          <p className="text-base mb-10 leading-relaxed max-w-[52ch]" style={{ color: 'var(--color-text-secondary)' }}>
            Your personal speech coaching environment. Enter your Anthropic API key to get started — it stays on your device and is never sent anywhere else.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="api-key"
                className="text-sm font-medium"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                Anthropic API Key
              </label>
              <input
                id="api-key"
                type="text"
                value={inputValue}
                placeholder="sk-ant-..."
                autoComplete="off"
                spellCheck={false}
                onChange={(e) => setInputValue(e.target.value)}
                onBlur={() => setTouched(true)}
                onPaste={(e) => {
                  e.preventDefault()
                  const pasted = e.clipboardData.getData('text').trim()
                  setInputValue(pasted)
                  setTouched(true)
                }}
                className="w-full px-4 py-3 rounded-lg text-sm font-mono outline-none transition-all duration-150"
                style={{
                  backgroundColor: 'var(--color-surface-raised)',
                  color: 'var(--color-text-primary)',
                  border: `1px solid ${validationError ? 'oklch(60% 0.18 25)' : 'var(--color-border-subtle)'}`,
                  caretColor: 'var(--color-accent)',
                }}
              />
              {validationError === 'prefix' && (
                <p className="text-xs" style={{ color: 'oklch(60% 0.18 25)' }}>
                  Keys start with sk-ant-
                </p>
              )}
              {validationError === 'length' && (
                <p className="text-xs" style={{ color: 'oklch(60% 0.18 25)' }}>
                  Key looks incomplete
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={!isSubmittable}
              className="w-full py-3 rounded-lg text-sm font-semibold transition-all duration-150 active:scale-[0.97] disabled:opacity-40 disabled:cursor-not-allowed"
              style={{
                backgroundColor: isSubmittable ? 'var(--color-accent)' : 'var(--color-surface-overlay)',
                color: isSubmittable ? 'oklch(12% 0.010 270)' : 'var(--color-text-muted)',
              }}
            >
              Start practicing
            </button>
          </form>

          <p className="mt-6 text-xs" style={{ color: 'var(--color-text-muted)' }}>
            Don't have a key?{' '}
            <a
              href="https://console.anthropic.com"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 transition-colors duration-150"
              style={{ color: 'var(--color-text-secondary)' }}
              onMouseOver={(e) => (e.currentTarget.style.color = 'var(--color-accent)')}
              onMouseOut={(e) => (e.currentTarget.style.color = 'var(--color-text-secondary)')}
            >
              Get one at console.anthropic.com
            </a>
          </p>
        </div>

        {/* Right column — intentionally empty, negative space */}
        <div className="hidden md:block" />
      </div>
    </div>
  )
}
