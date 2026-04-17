import { ArrowLeft, RotateCcw } from 'lucide-react'

type SplashRoute = {
  path: string
  label: string
}

const splashRoutes: SplashRoute[] = [
  { path: '/genie-splash', label: 'Particle' },
  { path: '/genie-cinematic', label: 'Cinematic' },
  { path: '/genie-glitch', label: 'Glitch' },
  { path: '/genie-breathe', label: 'Breathe' },
  { path: '/genie-liquid', label: 'Liquid' },
  { path: '/genie-terminal', label: 'Terminal' },
  { path: '/genie-3d-flip', label: '3D Flip' },
  { path: '/genie-morph', label: 'Morph' },
  { path: '/genie-radar', label: 'Radar' },
  { path: '/genie-typeface', label: 'Typeface' },
  { path: '/genie-neon', label: 'Neon' },
  { path: '/genie-gravity', label: 'Gravity' },
]

type Theme = 'dark' | 'light' | 'cyan' | 'warm' | 'purple'

const themeColors: Record<Theme, {
  bg: string
  border: string
  text: string
  textMuted: string
  activeBg: string
  activeBorder: string
  activeText: string
  hoverBg: string
  btnBorder: string
  btnBg: string
  btnText: string
}> = {
  dark: {
    bg: 'rgba(15,15,35,0.6)',
    border: 'rgba(99,102,241,0.1)',
    text: 'rgba(165,180,252,0.8)',
    textMuted: 'rgba(165,180,252,0.45)',
    activeBg: 'rgba(99,102,241,0.15)',
    activeBorder: 'rgba(99,102,241,0.4)',
    activeText: '#a5b4fc',
    hoverBg: 'rgba(99,102,241,0.08)',
    btnBorder: 'rgba(99,102,241,0.3)',
    btnBg: 'rgba(99,102,241,0.1)',
    btnText: '#a5b4fc',
  },
  light: {
    bg: 'rgba(250,250,250,0.8)',
    border: 'rgba(0,0,0,0.06)',
    text: 'rgba(0,0,0,0.5)',
    textMuted: 'rgba(0,0,0,0.35)',
    activeBg: 'rgba(0,0,0,0.06)',
    activeBorder: 'rgba(0,0,0,0.2)',
    activeText: '#111',
    hoverBg: 'rgba(0,0,0,0.03)',
    btnBorder: 'rgba(0,0,0,0.1)',
    btnBg: 'rgba(0,0,0,0.03)',
    btnText: '#333',
  },
  cyan: {
    bg: 'rgba(10,10,10,0.8)',
    border: 'rgba(0,255,255,0.1)',
    text: 'rgba(0,255,255,0.6)',
    textMuted: 'rgba(0,255,255,0.35)',
    activeBg: 'rgba(0,255,255,0.1)',
    activeBorder: 'rgba(0,255,255,0.4)',
    activeText: '#0ff',
    hoverBg: 'rgba(0,255,255,0.05)',
    btnBorder: 'rgba(0,255,255,0.2)',
    btnBg: 'rgba(0,255,255,0.05)',
    btnText: '#0ff',
  },
  warm: {
    bg: 'rgba(12,12,30,0.6)',
    border: 'rgba(255,200,100,0.1)',
    text: 'rgba(245,230,211,0.6)',
    textMuted: 'rgba(245,230,211,0.35)',
    activeBg: 'rgba(255,200,100,0.1)',
    activeBorder: 'rgba(255,200,100,0.4)',
    activeText: '#f5e6d3',
    hoverBg: 'rgba(255,200,100,0.05)',
    btnBorder: 'rgba(255,200,100,0.2)',
    btnBg: 'rgba(255,200,100,0.06)',
    btnText: '#f5e6d3',
  },
  purple: {
    bg: 'rgba(26,27,38,0.8)',
    border: 'rgba(189,147,249,0.1)',
    text: 'rgba(189,147,249,0.6)',
    textMuted: 'rgba(189,147,249,0.35)',
    activeBg: 'rgba(189,147,249,0.1)',
    activeBorder: 'rgba(189,147,249,0.4)',
    activeText: '#bd93f9',
    hoverBg: 'rgba(189,147,249,0.05)',
    btnBorder: 'rgba(189,147,249,0.2)',
    btnBg: 'rgba(189,147,249,0.06)',
    btnText: '#bd93f9',
  },
}

type SplashNavProps = {
  theme?: Theme
  onReplay?: () => void
}

export function SplashNav({ theme = 'dark', onReplay }: SplashNavProps) {
  const currentPath = window.location.pathname.replace(/\/+$/, '') || '/'
  const c = themeColors[theme]

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '10px 20px',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      background: c.bg,
      borderBottom: `1px solid ${c.border}`,
    }}>
      {/* Back button */}
      <a
        href="/"
        style={{
          display: 'flex', alignItems: 'center', gap: 6,
          color: c.textMuted, textDecoration: 'none', fontSize: 13,
          flexShrink: 0,
          transition: 'color 0.15s',
        }}
        onMouseEnter={(e) => { e.currentTarget.style.color = c.text }}
        onMouseLeave={(e) => { e.currentTarget.style.color = c.textMuted }}
      >
        <ArrowLeft size={15} />
        <span style={{ display: 'none' }}>Back</span>
      </a>

      {/* Divider */}
      <div style={{
        width: 1, height: 20, background: c.border, flexShrink: 0,
      }} />

      {/* Route tabs */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 4,
        flex: 1, overflow: 'auto',
        scrollbarWidth: 'none',
      }}>
        {splashRoutes.map(({ path, label }) => {
          const isActive = currentPath === path
          return (
            <a
              key={path}
              href={path}
              style={{
                padding: '5px 12px',
                borderRadius: 6,
                fontSize: 12,
                fontWeight: isActive ? 600 : 400,
                color: isActive ? c.activeText : c.textMuted,
                background: isActive ? c.activeBg : 'transparent',
                border: `1px solid ${isActive ? c.activeBorder : 'transparent'}`,
                textDecoration: 'none',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s',
                flexShrink: 0,
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = c.hoverBg
                  e.currentTarget.style.color = c.text
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = 'transparent'
                  e.currentTarget.style.color = c.textMuted
                }
              }}
            >
              {label}
            </a>
          )
        })}
      </div>

      {/* Replay button */}
      {onReplay && (
        <button
          onClick={onReplay}
          type="button"
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '5px 14px', borderRadius: 6, flexShrink: 0,
            border: `1px solid ${c.btnBorder}`,
            background: c.btnBg,
            color: c.btnText,
            fontSize: 12, fontWeight: 500, cursor: 'pointer',
            transition: 'all 0.15s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = c.activeBg
            e.currentTarget.style.borderColor = c.activeBorder
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = c.btnBg
            e.currentTarget.style.borderColor = c.btnBorder
          }}
        >
          <RotateCcw size={13} />
          Replay
        </button>
      )}
    </nav>
  )
}
