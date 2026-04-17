import { useLayoutEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { RotateCcw } from 'lucide-react'
import { SplashNav } from './components/SplashNav'

/**
 * Genie Terminal Splash — 终端打字机风格
 *
 * 灵感：Vercel / GitHub CLI / 黑客帝国
 * 编排：终端窗口出现 → 命令逐字打出 → 加载动画 → ASCII 艺术字揭示 → 光标闪烁
 */
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
    color: '#f8f8f2',
  }

  return (
    <div ref={rootRef} style={{ position: 'relative', width: '100%', minHeight: '100vh', overflow: 'hidden' }}>
      {/* Splash */}
      <div ref={splashRef} style={{
        position: 'fixed', inset: 0, zIndex: 100,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: '#1a1b26', overflow: 'hidden',
      }}>
        {/* Subtle dot grid */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }} />

        {/* Terminal window */}
        <div ref={terminalRef} style={{
          position: 'relative', zIndex: 2,
          width: 'min(90vw, 680px)',
          background: '#282a36',
          borderRadius: 12,
          overflow: 'hidden',
          boxShadow: '0 20px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.06)',
        }}>
          {/* Title bar */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '12px 16px',
            background: 'rgba(0,0,0,0.3)',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
          }}>
            <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#ff5f57' }} />
            <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#febc2e' }} />
            <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#28c840' }} />
            <span style={{
              marginLeft: 'auto', marginRight: 'auto',
              fontSize: 12, color: 'rgba(255,255,255,0.3)',
              fontFamily: "'SF Mono', monospace",
            }}>
              genie — zsh — 80×24
            </span>
          </div>

          {/* Terminal body */}
          <div style={{ padding: '20px 24px', minHeight: 280 }}>
            <div ref={line1Ref} style={{ ...lineStyle, color: '#50fa7b' }} />
            <div ref={line2Ref} style={{ ...lineStyle, color: '#8be9fd', marginTop: 4 }} />
            <div ref={line3Ref} style={{ ...lineStyle, color: '#50fa7b', marginTop: 12 }} />

            <pre ref={asciiRef} style={{
              margin: '12px 0',
              fontFamily: "'SF Mono', 'Fira Code', monospace",
              fontSize: 'clamp(7px, 1.1vw, 12px)',
              lineHeight: 1.3,
              color: '#bd93f9',
              overflow: 'hidden',
            }}>
              {asciiArt.map((line, i) => (
                <span key={i} className="ascii-line" style={{ display: 'block' }}>{line}</span>
              ))}
            </pre>

            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div ref={line4Ref} style={{ ...lineStyle, color: '#f1fa8c' }} />
              <span ref={cursorRef} style={{
                display: 'inline-block',
                width: 8, height: 18,
                background: '#f8f8f2',
                marginLeft: 2,
                verticalAlign: 'middle',
              }} />
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div ref={contentRef} style={{
        minHeight: '100vh',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        background: 'linear-gradient(180deg, #1a1b26 0%, #24283b 50%, #1a1b26 100%)',
        padding: '60px 24px', gap: 40,
      }}>
        <SplashNav theme="purple" onReplay={runAnimation} />

        <div style={{ maxWidth: 720, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 }}>
          <div style={{
            fontSize: 'clamp(3rem, 8vw, 5rem)', fontWeight: 800,
            fontFamily: "'SF Mono', monospace",
            color: '#bd93f9',
            textShadow: '0 0 30px rgba(189,147,249,0.2)',
          }}>
            Terminal Splash
          </div>
          <p style={{ fontSize: 'clamp(1rem, 2.5vw, 1.2rem)', color: 'rgba(248,248,242,0.4)', lineHeight: 1.7, maxWidth: 540 }}>
            终端打字机风格入场。模拟真实的终端窗口，命令逐字打出后触发 loading 动画，
            最终用 ASCII Art 大字揭示品牌名。整个过程带有 Dracula 配色主题，适合开发者工具类产品。
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center' }}>
            {['Typewriter', 'ASCII Art', 'Terminal UI', 'Dracula Theme', 'CLI Aesthetic'].map(tag => (
              <span key={tag} style={{
                padding: '6px 14px', borderRadius: 20,
                border: '1px solid rgba(189,147,249,0.2)', background: 'rgba(189,147,249,0.06)',
                color: 'rgba(189,147,249,0.6)', fontSize: 12, fontWeight: 500,
              }}>{tag}</span>
            ))}
          </div>
        </div>

        {showReplay && (
          <div style={{ marginTop: 20, fontSize: 13, color: 'rgba(248,248,242,0.25)', display: 'flex', alignItems: 'center', gap: 6 }}>
            <RotateCcw size={13} /> 点击右上角重新播放
          </div>
        )}
      </div>
    </div>
  )
}
