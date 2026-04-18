/**
 * Shared theme cookie utility for all Genie splash pages.
 * Persists dark/light mode preference to cookie.
 */

const THEME_COOKIE_KEY = 'genie-splash-theme'

export function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`))
  return match ? decodeURIComponent(match[1]) : null
}

export function setCookie(name: string, value: string, days = 365) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString()
  document.cookie = `${name}=${encodeURIComponent(value)};expires=${expires};path=/;SameSite=Lax`
}

export function getInitialDark(): boolean {
  const saved = getCookie(THEME_COOKIE_KEY)
  if (saved === 'dark') return true
  if (saved === 'light') return false
  return false // default light
}

export function persistTheme(isDark: boolean) {
  setCookie(THEME_COOKIE_KEY, isDark ? 'dark' : 'light')
}
