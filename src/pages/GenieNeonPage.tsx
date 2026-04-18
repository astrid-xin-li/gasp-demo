import { useLayoutEffect, useRef, useState, useCallback } from 'react'
import { gsap } from 'gsap'
import { RotateCcw } from 'lucide-react'
import { SplashNav } from './components/SplashNav'
import { ThemeToggle } from './components/ThemeToggle'
import { getInitialDark, persistTheme } from './utils/theme-cookie'

/**
 * Genie Neon Splash — 霓虹灯管风格
 *
 * 灵感：赛博夜城 / 日式霓虹街 / Tron
 * 编排：灯管逐段点亮描边 → 频闪通电效果 → 全亮发光 → 背景环境光弥漫
 * 注意：splash 部分始终保持暗色风格（霓虹效果需要暗底），仅 content 部分切换亮暗
 */

const themeTokens = {
  light: {
    contentBg: 'linear-gradient(180deg, #faf5ff, #f0e6ff 50%, #faf5ff)',
    titleColor: '#9333ea',
    titleShadow: '0 0 40px rgba(147,51,234,0.15)',
    descColor: 'rgba(147,51,234,0.45)',
    tagBorder: 'rgba(147,51,234,0.2)',
    tagBg: 'rgba(147,51,234,0.06)',
    tagColor: 'rgba(147,51,234,0.6)',
    replayColor: 'rgba(147,51,234,0.3)',
    navTheme: 'light' as const,
  },
  dark: {
    contentBg: 'linear-gradient(180deg, #0a0a0f, #15101f 50%, #0a0a0f)',
    titleColor: '#fff',
    titleShadow: '0 0 40px rgba(188,19,254,0.4)',
    descColor: 'rgba(188,19,254,0.35)',
    tagBorder: 'rgba(188,19,254,0.2)',
    tagBg: 'rgba(188,19,254,0.06)',
    tagColor: 'rgba(188,19,254,0.5)',
    replayColor: 'rgba(188,19,254,0.25)',
    navTheme: 'purple' as const,
  },
}

export default function GenieNeonPage() {
  const rootRef = useRef<HTMLDivElement>(null)
  const splashRef = useRef<HTMLDivElement>(null)
  const lettersRef = useRef<(HTMLSpanElement | null)[]>([])
  const glowRef = useRef<HTMLDivElement>(null)
  const reflectionRef = useRef<HTMLDivElement>(null)
  const subtitleRef = useRef<HTMLDivElement>(null)
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

  const brand = 'GENIE'

  const runAnimation = () => {
    if (tlRef.current) tlRef.current.kill()
    setShowReplay(false)
    const splash = splashRef.current, glow = glowRef.current
    const reflection = reflectionRef.current
    const subtitle = subtitleRef.current, content = contentRef.current
    const els = lettersRef.current.filter(Boolean) as HTMLSpanElement[]
    if (!splash || !glow || !reflection || !subtitle || !content || els.length !== 5) return

    gsap.set(splash, { autoAlpha: 1 })
    gsap.set(els, { color: 'rgba(255,255,255,0.05)', textShadow: 'none' })
    gsap.set(glow, { autoAlpha: 0 })
    gsap.set(reflection, { autoAlpha: 0 })
    gsap.set(subtitle, { autoAlpha: 0, y: 10 })
    gsap.set(content, { autoAlpha: 0, y: 40 })

    const neonOn = {
      color: '#fff',
      textShadow: '0 0 7px #fff, 0 0 10px #fff, 0 0 21px #fff, 0 0 42px #bc13fe, 0 0 82px #bc13fe, 0 0 92px #bc13fe, 0 0 102px #bc13fe, 0 0 151px #bc13fe',
    }
    const neonDim = {
      color: 'rgba(255,255,255,0.15)',
      textShadow: '0 0 2px rgba(188,19,254,0.2)',
    }
    const neonOff = {
      color: 'rgba(255,255,255,0.05)',
      textShadow: 'none',
    }

    const tl = gsap.timeline({ onComplete: () => setShowReplay(true) })

    // Phase 1: Letters light up one by one
    els.forEach((el, i) => {
      tl.to(el, { ...neonOn, duration: 0.15 }, 0.3 + i * 0.2)
        .to(el, { ...neonDim, duration: 0.1 }, 0.3 + i * 0.2 + 0.15)
    })

    // Phase 2: Flicker — random on/off bursts
    const flickerTime = tl.duration() + 0.1
    // Quick flicker burst
    tl.to(els[0], { ...neonOn, duration: 0.04 }, flickerTime)
      .to(els[0], { ...neonOff, duration: 0.04 }, flickerTime + 0.04)
      .to(els[2], { ...neonOn, duration: 0.05 }, flickerTime + 0.05)
      .to(els[2], { ...neonDim, duration: 0.04 }, flickerTime + 0.1)
      .to(els[4], { ...neonOn, duration: 0.04 }, flickerTime + 0.08)
      .to(els[4], { ...neonOff, duration: 0.04 }, flickerTime + 0.12)
      .to(els[1], { ...neonOn, duration: 0.05 }, flickerTime + 0.15)
      .to(els[1], { ...neonDim, duration: 0.04 }, flickerTime + 0.2)
      .to(els[3], { ...neonOn, duration: 0.05 }, flickerTime + 0.18)
      .to(els[3], { ...neonOff, duration: 0.04 }, flickerTime + 0.23)

    // Phase 3: Full power — all on
    tl.to(els, { ...neonOn, duration: 0.1 }, '+=0.1')
      .to(els, { ...neonDim, duration: 0.06 }, '+=0.05')
      .to(els, { ...neonOn, duration: 0.08 })

    // Phase 4: Ambient glow + reflection
    tl.to(glow, { autoAlpha: 1, duration: 0.8, ease: 'power1.out' }, '-=0.3')
      .to(reflection, { autoAlpha: 0.4, duration: 0.8, ease: 'power1.out' }, '<')

    // Phase 5: Subtitle
    tl.to(subtitle, { autoAlpha: 1, y: 0, duration: 0.4 }, '-=0.3')

    // Hold + exit
    tl.to({}, { duration: 0.6 })
      .to(splash, { autoAlpha: 0, duration: 0.7 })
      .to(content, { autoAlpha: 1, y: 0, duration: 0.6 }, '-=0.3')

    tlRef.current = tl
  }

  useLayoutEffect(() => {
    runAnimation()
    return () => { if (tlRef.current) tlRef.current.kill() }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div ref={rootRef} style={{ position: 'relative', width: '100%', minHeight: '100vh', overflow: 'hidden' }}>
      {/* Splash — always dark for neon effect */}
      <div ref={splashRef} style={{
        position: 'fixed', inset: 0, zIndex: 100,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        background: '#0a0a0f', overflow: 'hidden',
      }}>
        {/* Brick wall texture hint */}
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.04,
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 24px, rgba(255,255,255,0.1) 24px, rgba(255,255,255,0.1) 25px), repeating-linear-gradient(90deg, transparent, transparent 48px, rgba(255,255,255,0.06) 48px, rgba(255,255,255,0.06) 49px)',
        }} />

        {/* Ambient glow */}
        <div ref={glowRef} style={{
          position: 'absolute', width: 500, height: 300, borderRadius: '50%',
          background: 'radial-gradient(ellipse, rgba(188,19,254,0.12) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }} />

        {/* Logo */}
        <div style={{
          position: 'relative', zIndex: 2, display: 'flex', gap: 'clamp(4px, 1vw, 12px)',
        }}>
          {brand.split('').map((char, i) => (
            <span
              key={i}
              ref={el => { lettersRef.current[i] = el }}
              style={{
                fontSize: 'clamp(4rem, 14vw, 9rem)', fontWeight: 700,
                fontFamily: "'Inter', sans-serif", letterSpacing: '0.05em',
                willChange: 'color, text-shadow',
              }}
            >{char}</span>
          ))}
        </div>

        {/* Floor reflection */}
        <div ref={reflectionRef} style={{
          position: 'relative', zIndex: 2, marginTop: -8,
          fontSize: 'clamp(4rem, 14vw, 9rem)', fontWeight: 700,
          fontFamily: "'Inter', sans-serif", letterSpacing: '0.05em',
          display: 'flex', gap: 'clamp(4px, 1vw, 12px)',
          color: 'rgba(188,19,254,0.15)',
          transform: 'scaleY(-0.3)', transformOrigin: 'top center',
          filter: 'blur(3px)',
          maskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.4), transparent)',
          WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.4), transparent)',
        }}>
          {brand.split('').map((char, i) => <span key={i}>{char}</span>)}
        </div>

        {/* Subtitle — stays dark-themed */}
        <div ref={subtitleRef} style={{
          position: 'relative', zIndex: 2, marginTop: 16,
          fontSize: 'clamp(0.7rem, 1.4vw, 0.85rem)', letterSpacing: '0.5em',
          color: 'rgba(188,19,254,0.4)', textTransform: 'uppercase',
          fontFamily: "'Inter', sans-serif",
        }}>Illuminated</div>
      </div>

      {/* Content — switches dark/light */}
      <div ref={contentRef} style={{
        minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        background: tk.contentBg, padding: '60px 24px', gap: 40,
        transition: 'background 0.4s ease',
      }}>
        <SplashNav theme={tk.navTheme} onReplay={runAnimation} />
        <ThemeToggle isDark={isDark} onToggle={toggleDark} style={{ position: 'fixed', top: 56, right: 20 }} />
        <div style={{ maxWidth: 720, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 }}>
          <div style={{ fontSize: 'clamp(3rem, 8vw, 5rem)', fontWeight: 700, color: tk.titleColor, textShadow: tk.titleShadow, transition: 'color 0.3s ease' }}>
            Neon Splash
          </div>
          <p style={{ fontSize: 'clamp(1rem, 2.5vw, 1.2rem)', color: tk.descColor, lineHeight: 1.7, maxWidth: 540, transition: 'color 0.3s ease' }}>
            霓虹灯管风格入场。字母逐个点亮后快速闪灭，模拟灯管通电时的频闪不稳定感，
            最终全部稳定亮起，配合地面倒影和环境光弥漫，还原赛博夜城的霓虹美学。
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center' }}>
            {['Neon Glow', 'Flicker', 'Reflection', 'Cyberpunk', 'Text-shadow'].map(tag => (
              <span key={tag} style={{ padding: '6px 14px', borderRadius: 20, border: `1px solid ${tk.tagBorder}`, background: tk.tagBg, color: tk.tagColor, fontSize: 12, fontWeight: 500, transition: 'all 0.3s ease' }}>{tag}</span>
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
