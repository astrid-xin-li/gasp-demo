import { useState } from 'react'
import { Sun, Moon } from 'lucide-react'

type ThemeToggleProps = {
  isDark: boolean
  onToggle: () => void
  /** Position style override */
  style?: React.CSSProperties
}

/**
 * Shared dark/light mode toggle button for Genie splash pages.
 * Renders a circular Sun/Moon icon button.
 */
export function ThemeToggle({ isDark, onToggle, style }: ThemeToggleProps) {
  const [hover, setHover] = useState(false)

  const bg = isDark
    ? (hover ? 'rgba(255,255,255,0.16)' : 'rgba(255,255,255,0.08)')
    : (hover ? 'rgba(0,0,0,0.12)' : 'rgba(0,0,0,0.06)')
  const color = isDark ? '#ddd' : '#333'

  return (
    <button
      onClick={onToggle}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        position: 'absolute', top: 20, right: 20, zIndex: 10,
        width: 40, height: 40, borderRadius: '50%', border: 'none',
        background: bg, color,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer',
        transition: 'background 0.2s ease, color 0.3s ease',
        ...style,
      }}
      aria-label={isDark ? '切换到亮色模式' : '切换到暗色模式'}
    >
      {isDark ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  )
}
