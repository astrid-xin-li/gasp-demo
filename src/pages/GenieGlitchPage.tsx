import { useLayoutEffect, useRef, useState, useMemo, useCallback } from 'react'
import { gsap } from 'gsap'
import { RotateCcw } from 'lucide-react'
import { SplashNav } from './components/SplashNav'
import { ThemeToggle } from './components/ThemeToggle'
import { getInitialDark, persistTheme } from './utils/theme-cookie'

/**
 * Genie Glitch Splash — 故障艺术 / 赛博朋克风格
 *
 * 编排：扫描线闪烁 → 文字故障抖动 → RGB 分离 → 稳定显现 → 数据流背景消散
 */

const themeTokens = {
  light: {
    splashBg: '#f0faff',
    contentBg: 'linear-gradient(180deg, #f0faff, #e4f5ff 50%, #f0faff)',
    mainTextColor: '#1a1a1a',
    mainTextShadow: '0 0 20px rgba(0,180,220,0.15)',
    subtitleColor: 'rgba(0,140,180,0.6)',
    titleColor: '#0891b2',
    titleShadow: '0 0 30px rgba(8,145,178,0.15)',
    descColor: 'rgba(0,140,180,0.6)',
    tagBorder: 'rgba(8,145,178,0.2)',
    tagBg: 'rgba(8,145,178,0.06)',
    tagColor: 'rgba(8,145,178,0.7)',
    replayColor: 'rgba(0,140,180,0.35)',
    navTheme: 'light' as const,
  },
  dark: {
    splashBg: '#0a0a0a',
    contentBg: 'linear-gradient(180deg, #0a0a0a 0%, #111 50%, #0a0a0a 100%)',
    mainTextColor: '#fff',
    mainTextShadow: '0 0 20px rgba(0,255,255,0.3)',
    subtitleColor: 'rgba(0,255,255,0.5)',
    titleColor: '#0ff',
    titleShadow: '0 0 30px rgba(0,255,255,0.3)',
    descColor: 'rgba(0,255,255,0.4)',
    tagBorder: 'rgba(0,255,255,0.2)',
    tagBg: 'rgba(0,255,255,0.05)',
    tagColor: 'rgba(0,255,255,0.6)',
    replayColor: 'rgba(0,255,255,0.3)',
    navTheme: 'cyan' as const,
  },
}

export default function GenieGlitchPage() {
  const rootRef = useRef<HTMLDivElement>(null)
  const splashRef = useRef<HTMLDivElement>(null)
  const logoRef = useRef<HTMLDivElement>(null)
  const glitchRedRef = useRef<HTMLDivElement>(null)
  const glitchBlueRef = useRef<HTMLDivElement>(null)
  const scanlineRef = useRef<HTMLDivElement>(null)
  const flashRef = useRef<HTMLDivElement>(null)
  const subtitleRef = useRef<HTMLDivElement>(null)
  const borderFrameRef = useRef<HTMLDivElement>(null)
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

  // Random data stream characters
  const dataChars = useMemo(() => {
    const chars = '01アイウエオカキクケコ{}[]<>/\\|_=+-*&^%$#@!GENIE'
    return Array.from({ length: 200 }, () => ({
      char: chars[Math.floor(Math.random() * chars.length)],
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 8 + Math.random() * 6,
      opacity: 0.02 + Math.random() * 0.08,
      delay: Math.random() * 2,
    }))
  }, [])

  const runAnimation = () => {
    if (tlRef.current) tlRef.current.kill()
    setShowReplay(false)

    const splash = splashRef.current
    const logo = logoRef.current
    const red = glitchRedRef.current
    const blue = glitchBlueRef.current
    const scanline = scanlineRef.current
    const flash = flashRef.current
    const subtitle = subtitleRef.current
    const borderFrame = borderFrameRef.current
    const content = contentRef.current

    if (!splash || !logo || !red || !blue || !scanline || !flash || !subtitle || !borderFrame || !content) return

    gsap.set(splash, { autoAlpha: 1 })
    gsap.set([logo, red, blue], { autoAlpha: 0 })
    gsap.set(scanline, { yPercent: -100 })
    gsap.set(flash, { autoAlpha: 0 })
    gsap.set(subtitle, { autoAlpha: 0, y: 10 })
    gsap.set(borderFrame, { autoAlpha: 0 })
    gsap.set(content, { autoAlpha: 0, y: 40 })

    const tl = gsap.timeline({
      defaults: { ease: 'none' },
      onComplete: () => setShowReplay(true),
    })

    // Phase 1: Scanline sweep
    tl.to(scanline, {
      yPercent: 200,
      duration: 0.6,
      ease: 'power1.inOut',
    })

    // Phase 2: Flash + glitch appear
    .to(flash, { autoAlpha: 0.8, duration: 0.05 }, '-=0.3')
    .to(flash, { autoAlpha: 0, duration: 0.05 })
    .set([logo, red, blue], { autoAlpha: 1 })

    // Phase 3: Glitch shaking - RGB split
    .to(red, { x: -8, y: -3, duration: 0.05 })
    .to(blue, { x: 8, y: 3, duration: 0.05 }, '<')
    .to(red, { x: 12, y: 2, duration: 0.04 })
    .to(blue, { x: -10, y: -2, duration: 0.04 }, '<')
    .to(flash, { autoAlpha: 0.6, duration: 0.03 })
    .to(flash, { autoAlpha: 0, duration: 0.03 })
    .to(red, { x: -6, y: 4, duration: 0.05 })
    .to(blue, { x: 5, y: -4, duration: 0.05 }, '<')
    .to(red, { x: 15, y: -2, duration: 0.04 })
    .to(blue, { x: -12, y: 1, duration: 0.04 }, '<')
    .to(flash, { autoAlpha: 0.4, duration: 0.03 })
    .to(flash, { autoAlpha: 0, duration: 0.03 })
    .to(red, { x: -3, y: 1, duration: 0.06 })
    .to(blue, { x: 3, y: -1, duration: 0.06 }, '<')

    // Phase 4: Stabilize
    .to([red, blue], {
      x: 0, y: 0,
      duration: 0.3,
      ease: 'power2.out',
    })

    // Phase 5: Border frame appears
    .to(borderFrame, {
      autoAlpha: 1,
      duration: 0.4,
    }, '-=0.2')

    // Phase 6: Final flash
    .to(flash, { autoAlpha: 0.3, duration: 0.04 }, '+=0.1')
    .to(flash, { autoAlpha: 0, duration: 0.06 })

    // Phase 7: Subtitle
    .to(subtitle, {
      autoAlpha: 1,
      y: 0,
      duration: 0.5,
      ease: 'power2.out',
    }, '-=0.1')

    // Hold
    .to({}, { duration: 0.8 })

    // Phase 8: Glitch exit
    .to(flash, { autoAlpha: 0.8, duration: 0.04 })
    .to(splash, {
      autoAlpha: 0,
      duration: 0.3,
      ease: 'power2.in',
    })
    .to(content, {
      autoAlpha: 1,
      y: 0,
      duration: 0.7,
      ease: 'power2.out',
    }, '-=0.2')

    tlRef.current = tl
  }

  useLayoutEffect(() => {
    runAnimation()
    return () => { if (tlRef.current) tlRef.current.kill() }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const logoStyle: React.CSSProperties = {
    fontSize: 'clamp(4rem, 14vw, 9rem)',
    fontWeight: 900,
    fontFamily: "'SF Mono', 'Fira Code', 'Consolas', monospace",
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    willChange: 'transform',
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
        {/* Data stream background */}
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
          {dataChars.map((d, i) => (
            <span key={i} style={{
              position: 'absolute',
              left: `${d.x}%`, top: `${d.y}%`,
              fontSize: d.size, color: '#0ff',
              opacity: d.opacity,
              fontFamily: "'SF Mono', monospace",
              animation: `dataFlicker ${1 + d.delay}s infinite alternate`,
            }}>
              {d.char}
            </span>
          ))}
        </div>

        {/* Scanline */}
        <div ref={scanlineRef} style={{
          position: 'absolute', left: 0, right: 0, height: 4,
          background: 'linear-gradient(180deg, transparent, rgba(0,255,255,0.15), transparent)',
          boxShadow: '0 0 20px rgba(0,255,255,0.2)',
          zIndex: 5,
        }} />

        {/* Flash overlay */}
        <div ref={flashRef} style={{
          position: 'absolute', inset: 0,
          background: '#fff', zIndex: 8, pointerEvents: 'none',
        }} />

        {/* Theme toggle */}
        <ThemeToggle isDark={isDark} onToggle={toggleDark} style={{ zIndex: 10 }} />

        {/* Logo layers */}
        <div style={{ position: 'relative', zIndex: 4 }}>
          {/* Red channel */}
          <div ref={glitchRedRef} style={{
            ...logoStyle,
            position: 'absolute', top: 0, left: 0,
            color: 'rgba(255,0,0,0.7)',
            mixBlendMode: 'screen',
          }}>
            GENIE
          </div>
          {/* Blue channel */}
          <div ref={glitchBlueRef} style={{
            ...logoStyle,
            position: 'absolute', top: 0, left: 0,
            color: 'rgba(0,255,255,0.7)',
            mixBlendMode: 'screen',
          }}>
            GENIE
          </div>
          {/* Main text */}
          <div ref={logoRef} style={{
            ...logoStyle,
            position: 'relative',
            color: tk.mainTextColor,
            textShadow: tk.mainTextShadow,
            transition: 'color 0.3s ease',
          }}>
            GENIE
          </div>
        </div>

        {/* Border frame */}
        <div ref={borderFrameRef} style={{
          position: 'absolute',
          inset: '10%',
          border: '1px solid rgba(0,255,255,0.15)',
          zIndex: 3,
        }}>
          <div style={{ position: 'absolute', top: -4, left: -4, width: 20, height: 20, borderTop: '2px solid #0ff', borderLeft: '2px solid #0ff' }} />
          <div style={{ position: 'absolute', top: -4, right: -4, width: 20, height: 20, borderTop: '2px solid #0ff', borderRight: '2px solid #0ff' }} />
          <div style={{ position: 'absolute', bottom: -4, left: -4, width: 20, height: 20, borderBottom: '2px solid #0ff', borderLeft: '2px solid #0ff' }} />
          <div style={{ position: 'absolute', bottom: -4, right: -4, width: 20, height: 20, borderBottom: '2px solid #0ff', borderRight: '2px solid #0ff' }} />
        </div>

        {/* Subtitle */}
        <div ref={subtitleRef} style={{
          position: 'absolute', bottom: '25%', zIndex: 5,
          fontSize: 'clamp(0.7rem, 1.5vw, 0.9rem)',
          letterSpacing: '0.5em', color: tk.subtitleColor,
          textTransform: 'uppercase',
          fontFamily: "'SF Mono', monospace",
          transition: 'color 0.3s ease',
        }}>
          {'> SYSTEM INITIALIZED_'}
        </div>

        {/* CRT scanlines overlay */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 9, pointerEvents: 'none',
          background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.15) 2px, rgba(0,0,0,0.15) 4px)',
        }} />
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
            fontSize: 'clamp(3rem, 8vw, 5rem)', fontWeight: 900,
            fontFamily: "'SF Mono', monospace",
            color: tk.titleColor, textShadow: tk.titleShadow,
            letterSpacing: '0.05em',
            transition: 'color 0.3s ease',
          }}>
            Glitch Splash
          </div>
          <p style={{ fontSize: 'clamp(1rem, 2.5vw, 1.2rem)', color: tk.descColor, lineHeight: 1.7, maxWidth: 540, transition: 'color 0.3s ease' }}>
            故障艺术风格入场。扫描线扫过屏幕触发白闪，品牌文字以 RGB 三通道分离的形式剧烈抖动，
            随后稳定归位。CRT 扫描线叠加 + 矩阵风数据流背景，赛博朋克感拉满。
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center' }}>
            {['RGB Split', 'Scanline', 'CRT Effect', 'Glitch Shake', 'Data Stream'].map(tag => (
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

      <style>{`
        @keyframes dataFlicker {
          0% { opacity: 0.02; }
          50% { opacity: 0.08; }
          100% { opacity: 0.02; }
        }
      `}</style>
    </div>
  )
}
