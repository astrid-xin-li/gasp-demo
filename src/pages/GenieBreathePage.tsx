import { useCallback, useLayoutEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { RotateCcw } from 'lucide-react'
import { SplashNav } from './components/SplashNav'
import { GenieG, GenieEnie, GenieLogo } from './components/GenieLogo'
import { ThemeToggle } from './components/ThemeToggle'
import { getInitialDark, persistTheme } from './utils/theme-cookie'

/**
 * Genie Breathe Splash — 极简呼吸光环风格
 *
 * 编排：G 在屏幕正中心 → 跟光环一起呼吸缩放 → G 滑到左边 → "enie" 展开 → 淡出
 */
export default function GenieBreathePage() {
  const rootRef = useRef<HTMLDivElement>(null)
  const splashRef = useRef<HTMLDivElement>(null)
  const ring1Ref = useRef<HTMLDivElement>(null)
  const ring2Ref = useRef<HTMLDivElement>(null)
  const glowRef = useRef<HTMLDivElement>(null)
  const gRef = useRef<HTMLDivElement>(null)
  const enieRef = useRef<HTMLDivElement>(null)
  const subtitleRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const tlRef = useRef<gsap.core.Timeline | null>(null)

  const [showReplay, setShowReplay] = useState(false)
  const [isDark, setIsDark] = useState(getInitialDark)
  const toggleDark = useCallback(() => {
    setIsDark(prev => { const next = !prev; persistTheme(next); return next })
  }, [])

  const t = isDark ? {
    splashBg: '#111113',
    contentBg: '#111113',
    subtitleColor: 'rgba(255,255,255,0.35)',
    titleColor: '#f0f0f0',
    descColor: 'rgba(255,255,255,0.4)',
    tagBorder: 'rgba(255,255,255,0.1)',
    tagBg: 'rgba(255,255,255,0.04)',
    tagColor: 'rgba(255,255,255,0.5)',
    replayColor: 'rgba(255,255,255,0.25)',
    logoVariant: 'white' as const,
    navTheme: 'dark' as const,
    glowGradient: 'radial-gradient(circle, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.02) 50%, transparent 70%)',
    ringBorder: '1.5px solid rgba(255,255,255,0.15)',
    ringShadow: '0 0 30px rgba(255,255,255,0.04)',
    ring2Border: '1px solid rgba(255,255,255,0.08)',
  } : {
    splashBg: '#f5f5f7',
    contentBg: '#f5f5f7',
    subtitleColor: 'rgba(0,0,0,0.35)',
    titleColor: '#1d1d1f',
    descColor: 'rgba(0,0,0,0.4)',
    tagBorder: 'rgba(0,0,0,0.08)',
    tagBg: 'rgba(0,0,0,0.02)',
    tagColor: 'rgba(0,0,0,0.45)',
    replayColor: 'rgba(0,0,0,0.25)',
    logoVariant: 'black' as const,
    navTheme: 'light' as const,
    glowGradient: 'radial-gradient(circle, rgba(0,0,0,0.07) 0%, rgba(0,0,0,0.02) 50%, transparent 70%)',
    ringBorder: '1.5px solid rgba(0,0,0,0.15)',
    ringShadow: '0 0 30px rgba(0,0,0,0.04)',
    ring2Border: '1px solid rgba(0,0,0,0.08)',
  }

  const runAnimation = () => {
    if (tlRef.current) tlRef.current.kill()
    setShowReplay(false)

    const splash = splashRef.current, ring1 = ring1Ref.current, ring2 = ring2Ref.current
    const glow = glowRef.current, g = gRef.current
    const enie = enieRef.current, subtitle = subtitleRef.current, content = contentRef.current

    if (!splash || !ring1 || !ring2 || !glow || !g || !enie || !subtitle || !content) return

    // Measure: how far G needs to move from center to its brand position
    // G is inside a flex row. We need to know where G sits when "enie" is visible.
    gsap.set(enie, { visibility: 'hidden', clipPath: 'none' })
    const splashRect = splash.getBoundingClientRect()
    const gRect = g.getBoundingClientRect()
    const gCenterX = gRect.left + gRect.width / 2
    const gCenterY = gRect.top + gRect.height / 2
    const screenCenterX = splashRect.left + splashRect.width / 2
    const screenCenterY = splashRect.top + splashRect.height / 2
    // Offset to move G from its flex position to screen center
    const toCenter = {
      x: screenCenterX - gCenterX,
      y: screenCenterY - gCenterY,
    }

    // Reset
    gsap.set(splash, { autoAlpha: 1 })
    gsap.set([ring1, ring2], { scale: 0, autoAlpha: 0 })
    gsap.set(glow, { scale: 0, autoAlpha: 0 })
    gsap.set(g, { x: toCenter.x, y: toCenter.y, scale: 0.3, autoAlpha: 0 })
    gsap.set(enie, { visibility: 'visible', autoAlpha: 0, clipPath: 'inset(0 100% 0 0)' })
    gsap.set(subtitle, { autoAlpha: 0, y: 12 })
    gsap.set(content, { autoAlpha: 0, y: 40 })

    const tl = gsap.timeline({
      defaults: { ease: 'sine.inOut' },
      onComplete: () => setShowReplay(true),
    })

    // Phase 1: G appears at screen center
    tl.to(g, {
      scale: 1, autoAlpha: 1,
      duration: 0.5, ease: 'back.out(1.5)',
    })

    // Phase 2: Breathe OUT — all expand together
    .to(glow, { scale: 1, autoAlpha: 1, duration: 0.9 }, '-=0.1')
    .to(ring1, { scale: 1, autoAlpha: 1, duration: 0.9 }, '<')
    .to(g, { scale: 1.2, duration: 0.9 }, '<')

    // Phase 3: Breathe IN — shrink together
    .to(glow, { scale: 0.5, autoAlpha: 0.4, duration: 0.7 })
    .to(ring1, { scale: 0.5, autoAlpha: 0.4, duration: 0.7 }, '<')
    .to(g, { scale: 0.85, duration: 0.7 }, '<')

    // Phase 4: Breathe OUT bigger — second ring joins
    .to(glow, { scale: 1.4, autoAlpha: 1, duration: 0.9 })
    .to(ring1, { scale: 1.4, autoAlpha: 0.6, duration: 0.9 }, '<')
    .to(ring2, { scale: 1, autoAlpha: 0.4, duration: 0.9 }, '<0.1')
    .to(g, { scale: 1.3, duration: 0.9 }, '<')

    // Phase 5: Rings disperse
    .to([ring1, ring2], { scale: 3, autoAlpha: 0, duration: 0.5, ease: 'power2.in', stagger: 0.03 })
    .to(glow, { scale: 3, autoAlpha: 0, duration: 0.5, ease: 'power2.in' }, '<')

    // Phase 6: G slides from center back to its flex position (left side)
    .to(g, {
      x: 0, y: 0, scale: 1,
      duration: 0.6, ease: 'power3.out',
    }, '-=0.2')

    // Phase 7: "enie" clip-reveals from left to right
    .to(enie, {
      autoAlpha: 1,
      clipPath: 'inset(0 0% 0 0)',
      duration: 0.5, ease: 'power3.out',
    }, '-=0.3')

    // Phase 8: Subtitle
    .to(subtitle, { autoAlpha: 1, y: 0, duration: 0.4 }, '-=0.1')

    // Hold
    .to({}, { duration: 0.5 })

    // Phase 9: Exit
    .to(splash, { autoAlpha: 0, duration: 0.6, ease: 'power2.inOut' })
    .to(content, { autoAlpha: 1, y: 0, duration: 0.6 }, '-=0.3')

    tlRef.current = tl
  }

  useLayoutEffect(() => {
    runAnimation()
    return () => { if (tlRef.current) tlRef.current.kill() }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const ringBase: React.CSSProperties = {
    position: 'absolute',
    borderRadius: '50%',
    willChange: 'transform, opacity',
  }

  const fontStyle: React.CSSProperties = {
    fontSize: 'clamp(3.5rem, 11vw, 7rem)',
    fontWeight: 300,
    fontFamily: "'Inter', 'SF Pro Display', -apple-system, sans-serif",
    letterSpacing: '-0.04em',
    color: '#1d1d1f',
    lineHeight: 1,
  }

  return (
    <div ref={rootRef} style={{ position: 'relative', width: '100%', minHeight: '100vh', overflow: 'hidden' }}>
      <div ref={splashRef} style={{
        position: 'fixed', inset: 0, zIndex: 100,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        background: t.splashBg, overflow: 'hidden',
        transition: 'background 0.4s ease',
      }}>
        <ThemeToggle isDark={isDark} onToggle={toggleDark} style={{ zIndex: 110 }} />
        {/* Grain */}
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.025,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundSize: '128px',
        }} />

        {/* Glow */}
        <div ref={glowRef} style={{
          ...ringBase, width: 300, height: 300,
          background: t.glowGradient,
          transition: 'background 0.4s ease',
        }} />
        {/* Ring 1 */}
        <div ref={ring1Ref} style={{
          ...ringBase, width: 220, height: 220,
          border: t.ringBorder, boxShadow: t.ringShadow,
          transition: 'border 0.4s ease, box-shadow 0.4s ease',
        }} />
        {/* Ring 2 */}
        <div ref={ring2Ref} style={{
          ...ringBase, width: 360, height: 360,
          border: t.ring2Border,
          transition: 'border 0.4s ease',
        }} />

        {/* Brand: G + enie in a flex row, G will be translated to center initially */}
        <div style={{ position: 'relative', zIndex: 2, display: 'flex', alignItems: 'flex-end', gap: 6 }}>
          <div ref={gRef} style={{ willChange: 'transform, opacity' }}><GenieG variant={t.logoVariant} height={80} /></div>
          <div ref={enieRef} style={{ willChange: 'clip-path, opacity' }}><GenieEnie variant={t.logoVariant} height={80} gap={6} /></div>
        </div>

        {/* Subtitle */}
        <div ref={subtitleRef} style={{
          position: 'relative', zIndex: 2, marginTop: 16,
          fontSize: 'clamp(0.75rem, 1.5vw, 0.9rem)', letterSpacing: '0.25em',
          color: t.subtitleColor, textTransform: 'uppercase',
          fontFamily: "'Inter', -apple-system, sans-serif", fontWeight: 300,
          transition: 'color 0.4s ease',
        }}>
          Simplicity is the ultimate sophistication
        </div>
      </div>

      {/* Content */}
      <div ref={contentRef} style={{
        minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        background: t.contentBg, padding: '60px 24px', gap: 40,
        transition: 'background 0.4s ease',
      }}>
        <SplashNav theme={t.navTheme} onReplay={runAnimation} />
        <ThemeToggle isDark={isDark} onToggle={toggleDark} style={{ position: 'fixed', zIndex: 110 }} />
        <div style={{ maxWidth: 720, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 }}>
          <div style={{ fontSize: 'clamp(3rem, 8vw, 5rem)', fontWeight: 300, fontFamily: "'Inter', sans-serif", color: t.titleColor, letterSpacing: '-0.03em', transition: 'color 0.4s ease' }}>
            Breathe Splash
          </div>
          <p style={{ fontSize: 'clamp(1rem, 2.5vw, 1.2rem)', color: t.descColor, lineHeight: 1.7, maxWidth: 540, transition: 'color 0.4s ease' }}>
            极简呼吸光环风格。字母 G 在屏幕正中心出现并跟随光环同步呼吸缩放，
            光环散去后 G 平滑滑到左侧，"enie" 从右侧展开，组成完整品牌名。
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center' }}>
            {['Breathe Ring', 'G → Genie', 'Minimalist', 'Light Theme', 'Apple-like'].map(tag => (
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
