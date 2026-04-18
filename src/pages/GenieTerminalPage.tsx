import { useLayoutEffect, useRef, useState, useCallback } from 'react'
import { gsap } from 'gsap'
import { RotateCcw } from 'lucide-react'
import { SplashNav } from './components/SplashNav'
import { ThemeToggle } from './components/ThemeToggle'
import { getInitialDark, persistTheme } from './utils/theme-cookie'

/**
 * Genie Terminal Splash — 终端打字机风格
 *
 * 灵感：Vercel / GitHub CLI / 黑客帝国
 * 编排：终端窗口出现 → 命令逐字打出 → 加载动画 → ASCII 艺术字揭示 → 光标闪烁
 */

const themeTokens = {
  light: {
    splashBg: '#faf8ff',
    contentBg: 'linear-gradient(180deg, #faf8ff, #f0ecff 50%, #faf8ff)',
    dotBg: 'radial-gradient(circle, rgba(0,0,0,0.03) 1px, transparent 1px)',
    terminalBg: 'rgba(255,255,255,0.95)',
    terminalBorder: 'rgba(124,58,237,0.2)',
    terminalShadow: '0 20px 80px rgba(0,0,0,0.1), 0 0 0 1px rgba(124,58,237,0.15)',
    titleBarBg: 'rgba(240,238,255,0.9)',
    titleBarBorder: 'rgba(124,58,237,0.1)',
    titleBarText: 'rgba(0,0,0,0.35)',
    lineColor: '#f8f8f2',
    cmdColor: '#16a34a',
    loadingColor: '#0891b2',
    readyColor: '#16a34a',
    asciiColor: '#7c3aed',
    versionColor: '#ca8a04',
    cursorColor: '#333',
    titleColor: '#7c3aed',
    titleShadow: '0 0 30px rgba(124,58,237,0.12)',
    descColor: 'rgba(124,58,237,0.5)',
    tagBorder: 'rgba(124,58,237,0.2)',
    tagBg: 'rgba(124,58,237,0.06)',
    tagColor: 'rgba(124,58,237,0.7)',
    replayColor: 'rgba(124,58,237,0.3)',
    navTheme: 'light' as const,
  },
  dark: {
    splashBg: '#1a1b26',
    contentBg: 'linear-gradient(180deg, #1a1b26 0%, #24283b 50%, #1a1b26 100%)',
    dotBg: 'radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)',
    terminalBg: 'rgba(26,27,38,0.95)',
    terminalBorder: 'rgba(189,147,249,0.3)',
    terminalShadow: '0 20px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.06)',
    titleBarBg: 'rgba(40,42,54,0.9)',
    titleBarBorder: 'rgba(255,255,255,0.06)',
    titleBarText: 'rgba(255,255,255,0.3)',
    lineColor: '#f8f8f2',
    cmdColor: '#50fa7b',
    loadingColor: '#8be9fd',
    readyColor: '#50fa7b',
    asciiColor: '#bd93f9',
    versionColor: '#f1fa8c',
    cursorColor: '#f8f8f2',
    titleColor: '#bd93f9',
    titleShadow: '0 0 30px rgba(189,147,249,0.2)',
    descColor: 'rgba(248,248,242,0.4)',
    tagBorder: 'rgba(189,147,249,0.2)',
    tagBg: 'rgba(189,147,249,0.06)',
    tagColor: 'rgba(189,147,249,0.6)',
    replayColor: 'rgba(248,248,242,0.25)',
    navTheme: 'purple' as const,
  },
}

export default function GenieTerminalPage() {
  const rootRef = useRef<HTMLDivElement>(null)
  const splashRef = useRef<HTMLDivElement>(null)
  const terminalRef = useRef<HTMLDivElement>(null)
  const line1Ref = useRef<HTMLDivElement>(null)
  const line2Ref = useRef<HTMLDivElement>(null)
  const line3Ref = useRef<HTMLDivElement>(null)
  const asciiRef = useRef<HTMLPreElement>(null)
  const line4Ref = useRef<HTMLDivElement>(null)
  const cursorRef = useRef<HTMLSpanElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const tlRef = useRef<gsap.core.Timeline | null>(null)

  const [showReplay, setShowReplay] = useState(false)

  const [isDark, setIsDark] = useState(getInitialDark)
  const tk = isDark ? themeTokens.dark : themeTokens.light

  const toggleDark = useCallback(() => {
    setIsDark(prev => {
      const next = !prev
      persistTheme(next)
      return next
    })
  }, [])

  /** Append typing animation to timeline — simple sequential calls */
  const addTyping = (tl: gsap.core.Timeline, el: HTMLElement, text: string, charDelay = 0.04) => {
    el.textContent = ''
    for (let i = 0; i < text.length; i++) {
      const ch = text[i]
      tl.call(() => { el.textContent += ch }, [], `+=${charDelay}`)
    }
  }

  const runAnimation = () => {
    if (tlRef.current) tlRef.current.kill()
    setShowReplay(false)

    const splash = splashRef.current
    const terminal = terminalRef.current
    const line1 = line1Ref.current
    const line2 = line2Ref.current
    const line3 = line3Ref.current
    const ascii = asciiRef.current
    const line4 = line4Ref.current
    const cursor = cursorRef.current
    const content = contentRef.current

    if (!splash || !terminal || !line1 || !line2 || !line3 || !ascii || !line4 || !cursor || !content) return

    gsap.set(splash, { autoAlpha: 1 })
    gsap.set(terminal, { autoAlpha: 0, scale: 0.9, y: 20 })
    gsap.set([line1, line2, line3, line4], { autoAlpha: 0 })
    gsap.set(ascii, { autoAlpha: 0 })
    gsap.set(cursor, { autoAlpha: 1 })
    gsap.set(content, { autoAlpha: 0, y: 40 })

    line1.textContent = ''
    line2.textContent = ''
    line3.textContent = ''
    line4.textContent = ''

    const tl = gsap.timeline({
      onComplete: () => setShowReplay(true),
    })

    // Phase 1: Terminal window appears
    tl.to(terminal, {
      autoAlpha: 1, scale: 1, y: 0,
      duration: 0.4, ease: 'power3.out',
    })

    // Phase 2: Type first command
    tl.set(line1, { autoAlpha: 1 })
    addTyping(tl, line1, '$ npx genie init', 0.04)

    // Phase 3: Loading response
    tl.set(line2, { autoAlpha: 1 }, '+=0.2')
    addTyping(tl, line2, '⠋ Initializing Genie...', 0.02)

    // Spinner simulation — fast swaps
    tl.call(() => { line2.textContent = '⠙ Loading modules...' }, [], '+=0.15')
      .call(() => { line2.textContent = '⠹ Building workspace...' }, [], '+=0.15')
      .call(() => { line2.textContent = '⠸ Compiling assets...' }, [], '+=0.15')
      .call(() => { line2.textContent = '⠼ Almost ready...' }, [], '+=0.15')
      .call(() => { line2.textContent = '✓ Ready!' }, [], '+=0.15')
      .to(line2, { color: '#50fa7b', duration: 0.15 })

    // Phase 4: Type second command
    tl.set(line3, { autoAlpha: 1 }, '+=0.2')
    addTyping(tl, line3, '$ genie --version', 0.04)

    // Phase 5: ASCII art — reveal all lines rapidly
    const asciiLines = ascii.querySelectorAll('.ascii-line')
    tl.to(ascii, { autoAlpha: 1, duration: 0.01 }, '+=0.2')
    tl.set(asciiLines, { autoAlpha: 0 })
    asciiLines.forEach((line) => {
      tl.to(line, { autoAlpha: 1, duration: 0.01 }, '+=0.06')
    })

    // Phase 6: Version line
    tl.set(line4, { autoAlpha: 1 }, '+=0.15')
    addTyping(tl, line4, '  → v1.0.0  |  Your Intelligent Companion', 0.02)

    // Cursor blink
    tl.to(cursor, { autoAlpha: 0, repeat: 4, yoyo: true, duration: 0.35 }, '+=0.1')

    // Phase 7: Exit
    tl.to(splash, {
      autoAlpha: 0, duration: 0.5, ease: 'power2.inOut',
    }, '+=0.2')
    .to(content, {
      autoAlpha: 1, y: 0, duration: 0.6, ease: 'power2.out',
    }, '-=0.3')

    tlRef.current = tl
  }

  useLayoutEffect(() => {
    runAnimation()
    return () => { if (tlRef.current) tlRef.current.kill() }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const asciiArt = [
    '   ██████╗ ███████╗███╗   ██╗██╗███████╗',
    '  ██╔════╝ ██╔════╝████╗  ██║██║██╔════╝',
    '  ██║  ███╗█████╗  ██╔██╗ ██║██║█████╗  ',
    '  ██║   ██║██╔══╝  ██║╚██╗██║██║██╔══╝  ',
    '  ╚██████╔╝███████╗██║ ╚████║██║███████╗',
    '   ╚═════╝ ╚══════╝╚═╝  ╚═══╝╚═╝╚══════╝',
  ]

  const lineStyle: React.CSSProperties = {
    fontFamily: "'SF Mono', 'Fira Code', 'Cascadia Code', 'Consolas', monospace",
    fontSize: 'clamp(12px, 1.4vw, 15px)',
    lineHeight: 1.8,
    whiteSpace: 'pre',
    color: tk.lineColor,
  }

  return (
    <div ref={rootRef} style={{ position: 'relative', width: '100%', minHeight: '100vh', overflow: 'hidden' }}>
      {/* Splash */}
      <div ref={splashRef} style={{
        position: 'fixed', inset: 0, zIndex: 100,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: tk.splashBg, overflow: 'hidden',
        transition: 'background 0.4s ease',
      }}>
        {/* Subtle dot grid */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: tk.dotBg,
          backgroundSize: '24px 24px',
        }} />

        {/* Theme toggle */}
        <ThemeToggle isDark={isDark} onToggle={toggleDark} />

        {/* Terminal window */}
        <div ref={terminalRef} style={{
          position: 'relative', zIndex: 2,
          width: 'min(90vw, 680px)',
          background: tk.terminalBg,
          borderRadius: 12,
          overflow: 'hidden',
          boxShadow: tk.terminalShadow,
          border: `1px solid ${tk.terminalBorder}`,
          transition: 'background 0.4s ease, border-color 0.3s ease, box-shadow 0.3s ease',
        }}>
          {/* Title bar */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '12px 16px',
            background: tk.titleBarBg,
            borderBottom: `1px solid ${tk.titleBarBorder}`,
            transition: 'background 0.4s ease, border-color 0.3s ease',
          }}>
            <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#ff5f57' }} />
            <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#febc2e' }} />
            <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#28c840' }} />
            <span style={{
              marginLeft: 'auto', marginRight: 'auto',
              fontSize: 12, color: tk.titleBarText,
              fontFamily: "'SF Mono', monospace",
              transition: 'color 0.3s ease',
            }}>
              genie — zsh — 80×24
            </span>
          </div>

          {/* Terminal body */}
          <div style={{ padding: '20px 24px', minHeight: 280 }}>
            <div ref={line1Ref} style={{ ...lineStyle, color: tk.cmdColor, transition: 'color 0.3s ease' }} />
            <div ref={line2Ref} style={{ ...lineStyle, color: tk.loadingColor, marginTop: 4, transition: 'color 0.3s ease' }} />
            <div ref={line3Ref} style={{ ...lineStyle, color: tk.cmdColor, marginTop: 12, transition: 'color 0.3s ease' }} />

            <pre ref={asciiRef} style={{
              margin: '12px 0',
              fontFamily: "'SF Mono', 'Fira Code', monospace",
              fontSize: 'clamp(7px, 1.1vw, 12px)',
              lineHeight: 1.3,
              color: tk.asciiColor,
              overflow: 'hidden',
              transition: 'color 0.3s ease',
            }}>
              {asciiArt.map((line, i) => (
                <span key={i} className="ascii-line" style={{ display: 'block' }}>{line}</span>
              ))}
            </pre>

            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div ref={line4Ref} style={{ ...lineStyle, color: tk.versionColor, transition: 'color 0.3s ease' }} />
              <span ref={cursorRef} style={{
                display: 'inline-block',
                width: 8, height: 18,
                background: tk.cursorColor,
                marginLeft: 2,
                verticalAlign: 'middle',
                transition: 'background 0.3s ease',
              }} />
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div ref={contentRef} style={{
        minHeight: '100vh',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        background: tk.contentBg,
        padding: '60px 24px', gap: 40,
        transition: 'background 0.4s ease',
      }}>
        <SplashNav theme={tk.navTheme} onReplay={runAnimation} />
        <ThemeToggle isDark={isDark} onToggle={toggleDark} style={{ position: 'fixed', top: 56, right: 20 }} />

        <div style={{ maxWidth: 720, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 }}>
          <div style={{
            fontSize: 'clamp(3rem, 8vw, 5rem)', fontWeight: 800,
            fontFamily: "'SF Mono', monospace",
            color: tk.titleColor,
            textShadow: tk.titleShadow,
            transition: 'color 0.3s ease',
          }}>
            Terminal Splash
          </div>
          <p style={{ fontSize: 'clamp(1rem, 2.5vw, 1.2rem)', color: tk.descColor, lineHeight: 1.7, maxWidth: 540, transition: 'color 0.3s ease' }}>
            终端打字机风格入场。模拟真实的终端窗口，命令逐字打出后触发 loading 动画，
            最终用 ASCII Art 大字揭示品牌名。整个过程带有 Dracula 配色主题，适合开发者工具类产品。
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center' }}>
            {['Typewriter', 'ASCII Art', 'Terminal UI', 'Dracula Theme', 'CLI Aesthetic'].map(tag => (
              <span key={tag} style={{
                padding: '6px 14px', borderRadius: 20,
                border: `1px solid ${tk.tagBorder}`, background: tk.tagBg,
                color: tk.tagColor, fontSize: 12, fontWeight: 500,
                transition: 'all 0.3s ease',
              }}>{tag}</span>
            ))}
          </div>
        </div>

        {showReplay && (
          <div style={{ marginTop: 20, fontSize: 13, color: tk.replayColor, display: 'flex', alignItems: 'center', gap: 6 }}>
            <RotateCcw size={13} /> 点击右上角重新播放
          </div>
        )}
      </div>
    </div>
  )
}
