import { useCallback, useLayoutEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { RotateCcw } from 'lucide-react'
import { SplashNav } from './components/SplashNav'
import { GenieG, GenieE1, GenieN, GenieI, GenieE2 } from './components/GenieLogo'
import { ThemeToggle } from './components/ThemeToggle'
import { getInitialDark, persistTheme } from './utils/theme-cookie'

/**
 * Genie Typeface Splash — 排版动力学风格
 *
 * 灵感：Nike / Adidas / 时尚杂志
 * 编排：超大字母从四面八方飞入 → 碰撞挤压 → 弹开归位 → 组合成品牌名
 */
export default function GenieTypefacePage() {
  const rootRef = useRef<HTMLDivElement>(null)
  const splashRef = useRef<HTMLDivElement>(null)
  const lettersRef = useRef<(HTMLDivElement | null)[]>([])
  const lineRef = useRef<HTMLDivElement>(null)
  const subtitleRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const tlRef = useRef<gsap.core.Timeline | null>(null)
  const [showReplay, setShowReplay] = useState(false)
  const [isDark, setIsDark] = useState(getInitialDark)
  const toggleDark = useCallback(() => {
    setIsDark(prev => { const next = !prev; persistTheme(next); return next })
  }, [])

  const t = isDark ? {
    splashBg: '#0f0f12',
    contentBg: '#0f0f12',
    subtitleColor: 'rgba(255,255,255,0.35)',
    titleColor: '#f0f0f0',
    descColor: 'rgba(255,255,255,0.4)',
    tagBorder: 'rgba(255,255,255,0.1)',
    tagBg: 'rgba(255,255,255,0.04)',
    tagColor: 'rgba(255,255,255,0.5)',
    replayColor: 'rgba(255,255,255,0.25)',
    logoVariant: 'white' as const,
    navTheme: 'dark' as const,
    lineColor: '#f0f0f0',
    underlineGradient: 'linear-gradient(90deg, transparent, #fff, transparent)',
  } : {
    splashBg: '#f8f8f8',
    contentBg: '#f8f8f8',
    subtitleColor: 'rgba(0,0,0,0.35)',
    titleColor: '#0a0a0a',
    descColor: 'rgba(0,0,0,0.4)',
    tagBorder: 'rgba(0,0,0,0.08)',
    tagBg: 'rgba(0,0,0,0.02)',
    tagColor: 'rgba(0,0,0,0.45)',
    replayColor: 'rgba(0,0,0,0.25)',
    logoVariant: 'black' as const,
    navTheme: 'light' as const,
    lineColor: '#0a0a0a',
    underlineGradient: 'linear-gradient(90deg, transparent, #000, transparent)',
  }

  const letters = ['G', 'E', 'N', 'I', 'E']
  // Each letter flies in from a different direction
  const flyFrom = [
    { x: -400, y: -300, rotation: -45, scale: 2 },
    { x: 500, y: -200, rotation: 30, scale: 1.8 },
    { x: 0, y: 500, rotation: 0, scale: 2.5 },
    { x: -500, y: 200, rotation: -60, scale: 1.5 },
    { x: 400, y: 400, rotation: 45, scale: 2 },
  ]

  const runAnimation = () => {
    if (tlRef.current) tlRef.current.kill()
    setShowReplay(false)
    const splash = splashRef.current, line = lineRef.current
    const subtitle = subtitleRef.current, content = contentRef.current
    const els = lettersRef.current.filter(Boolean) as HTMLDivElement[]
    if (!splash || !line || !subtitle || !content || els.length !== 5) return

    gsap.set(splash, { autoAlpha: 1 })
    gsap.set(line, { scaleX: 0 })
    gsap.set(subtitle, { autoAlpha: 0, y: 12 })
    gsap.set(content, { autoAlpha: 0, y: 40 })
    els.forEach((el, i) => {
      gsap.set(el, { ...flyFrom[i], autoAlpha: 0 })
    })

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' }, onComplete: () => setShowReplay(true) })

    // Phase 1: Letters fly in simultaneously with stagger
    els.forEach((el, i) => {
      tl.to(el, {
        x: 0, y: 0, rotation: 0, scale: 1, autoAlpha: 1,
        duration: 0.8, ease: 'power4.out',
      }, i * 0.1)
    })

    // Phase 2: Overshoot — letters squeeze together
    tl.to(els, {
      letterSpacing: '-0.15em',
      scaleX: 0.9,
      duration: 0.15,
      ease: 'power2.in',
    }, '-=0.1')

    // Phase 3: Bounce back — letters spread to final position
    .to(els, {
      letterSpacing: '0em',
      scaleX: 1,
      duration: 0.4,
      ease: 'elastic.out(1, 0.5)',
    })

    // Phase 4: Underline sweep
    .to(line, { scaleX: 1, duration: 0.5, ease: 'power3.inOut' }, '-=0.2')

    // Phase 5: Subtitle
    .to(subtitle, { autoAlpha: 1, y: 0, duration: 0.4 })

    // Hold + exit
    .to({}, { duration: 0.6 })
    .to(splash, { autoAlpha: 0, scale: 0.95, duration: 0.6 })
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
      <div ref={splashRef} style={{
        position: 'fixed', inset: 0, zIndex: 100,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        background: t.splashBg, overflow: 'hidden',
        transition: 'background 0.4s ease',
      }}>
        <ThemeToggle isDark={isDark} onToggle={toggleDark} style={{ zIndex: 110 }} />
        <div style={{ position: 'relative', zIndex: 2, display: 'flex', alignItems: 'flex-end', gap: 6 }}>
          {[GenieG, GenieE1, GenieN, GenieI, GenieE2].map((Letter, i) => (
            <div
              key={i}
              ref={el => { lettersRef.current[i] = el }}
              style={{ willChange: 'transform, opacity' }}
            ><Letter variant={t.logoVariant} height={100} /></div>
          ))}
        </div>
        <div ref={lineRef} style={{
          width: 'clamp(100px, 30vw, 240px)', height: 4, marginTop: 12,
          background: t.lineColor, transformOrigin: 'center center',
          transition: 'background 0.4s ease',
        }} />
        <div ref={subtitleRef} style={{
          marginTop: 20, fontSize: 'clamp(0.75rem, 1.5vw, 0.9rem)',
          letterSpacing: '0.4em', color: t.subtitleColor, textTransform: 'uppercase',
          fontWeight: 500, transition: 'color 0.4s ease',
        }}>Bold By Design</div>
      </div>

      <div ref={contentRef} style={{
        minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        background: t.contentBg, padding: '60px 24px', gap: 40,
        transition: 'background 0.4s ease',
      }}>
        <SplashNav theme={t.navTheme} onReplay={runAnimation} />
        <ThemeToggle isDark={isDark} onToggle={toggleDark} style={{ position: 'fixed', zIndex: 110 }} />
        <div style={{ maxWidth: 720, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 }}>
          <div style={{ fontSize: 'clamp(3rem, 8vw, 5rem)', fontWeight: 900, color: t.titleColor, transition: 'color 0.4s ease' }}>
            Typeface Splash
          </div>
          <p style={{ fontSize: 'clamp(1rem, 2.5vw, 1.2rem)', color: t.descColor, lineHeight: 1.7, maxWidth: 540, transition: 'color 0.4s ease' }}>
            排版动力学风格入场。每个字母从屏幕不同方向高速飞入，带有不同的旋转角度和缩放。
            字母到达中心后有轻微挤压弹跳效果，配合粗体横线扫入，追求运动品牌般的力量感。
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center' }}>
            {['Kinetic Type', 'Fly-in', 'Bounce', 'Bold Weight', 'Nike-like'].map(tag => (
              <span key={tag} style={{ padding: '6px 14px', borderRadius: 20, border: `1px solid ${t.tagBorder}`, background: t.tagBg, color: t.tagColor, fontSize: 12, fontWeight: 500, transition: 'all 0.4s ease' }}>{tag}</span>
            ))}
          </div>
        </div>
        {showReplay && (
          <div style={{ marginTop: 20, fontSize: 13, color: t.replayColor, display: 'flex', alignItems: 'center', gap: 6, transition: 'color 0.4s ease' }}>
            <RotateCcw size={13} /> 点击右上角重新播放
          </div>
        )}
      </div>
    </div>
  )
}
