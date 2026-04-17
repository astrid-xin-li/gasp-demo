import { useLayoutEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { RotateCcw } from 'lucide-react'
import { SplashNav } from './components/SplashNav'

/**
 * Genie Liquid Splash — 流体渐变 / 液态金属风格
 *
 * 灵感：Stripe / Lottie / 高端产品发布会
 * 编排：多个渐变色块从不同角度游入 → 相互交融形成背景 → 品牌字从透明到实体 → 底部光带扫过
 */
export default function GenieLiquidPage() {
  const rootRef = useRef<HTMLDivElement>(null)
  const splashRef = useRef<HTMLDivElement>(null)
  const blob1Ref = useRef<HTMLDivElement>(null)
  const blob2Ref = useRef<HTMLDivElement>(null)
  const blob3Ref = useRef<HTMLDivElement>(null)
  const blob4Ref = useRef<HTMLDivElement>(null)
  const logoRef = useRef<HTMLDivElement>(null)
  const outlineRef = useRef<HTMLDivElement>(null)
  const underlineRef = useRef<HTMLDivElement>(null)
  const subtitleRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const tlRef = useRef<gsap.core.Timeline | null>(null)

  const [showReplay, setShowReplay] = useState(false)

  const runAnimation = () => {
    if (tlRef.current) tlRef.current.kill()
    setShowReplay(false)

    const splash = splashRef.current
    const b1 = blob1Ref.current
    const b2 = blob2Ref.current
    const b3 = blob3Ref.current
    const b4 = blob4Ref.current
    const logo = logoRef.current
    const outline = outlineRef.current
    const underline = underlineRef.current
    const subtitle = subtitleRef.current
    const content = contentRef.current

    if (!splash || !b1 || !b2 || !b3 || !b4 || !logo || !outline || !underline || !subtitle || !content) return

    gsap.set(splash, { autoAlpha: 1 })
    gsap.set(b1, { xPercent: -120, yPercent: -80, scale: 0.5 })
    gsap.set(b2, { xPercent: 120, yPercent: 60, scale: 0.5 })
    gsap.set(b3, { xPercent: 60, yPercent: -120, scale: 0.3 })
    gsap.set(b4, { xPercent: -80, yPercent: 100, scale: 0.4 })
    gsap.set(logo, { autoAlpha: 0, scale: 0.9 })
    gsap.set(outline, { autoAlpha: 1, scale: 1 })
    gsap.set(underline, { scaleX: 0, transformOrigin: 'center center' })
    gsap.set(subtitle, { autoAlpha: 0, y: 16 })
    gsap.set(content, { autoAlpha: 0, y: 40 })

    const tl = gsap.timeline({
      defaults: { ease: 'power2.out' },
      onComplete: () => setShowReplay(true),
    })

    // Phase 1: Blobs swim in from edges
    tl.to(b1, { xPercent: -20, yPercent: -15, scale: 1, duration: 1.8, ease: 'power1.out' })
      .to(b2, { xPercent: 25, yPercent: 10, scale: 1, duration: 2, ease: 'power1.out' }, '<0.1')
      .to(b3, { xPercent: 10, yPercent: -25, scale: 1, duration: 1.6, ease: 'power1.out' }, '<0.15')
      .to(b4, { xPercent: -15, yPercent: 20, scale: 1, duration: 1.9, ease: 'power1.out' }, '<0.05')

    // Phase 2: Blobs continue drifting (organic feel)
      .to(b1, { xPercent: -10, yPercent: -5, rotation: 15, duration: 2, ease: 'sine.inOut' }, '-=0.5')
      .to(b2, { xPercent: 15, yPercent: 0, rotation: -10, duration: 2.2, ease: 'sine.inOut' }, '<')
      .to(b3, { xPercent: 5, yPercent: -10, rotation: 20, duration: 1.8, ease: 'sine.inOut' }, '<')
      .to(b4, { xPercent: -5, yPercent: 10, rotation: -15, duration: 2, ease: 'sine.inOut' }, '<')

    // Phase 3: Outline text fades, solid text appears
      .to(outline, {
        autoAlpha: 0,
        scale: 1.05,
        duration: 0.6,
      }, '-=1.5')
      .to(logo, {
        autoAlpha: 1,
        scale: 1,
        duration: 0.8,
        ease: 'power3.out',
      }, '-=1.2')

    // Phase 4: Underline sweeps
      .to(underline, {
        scaleX: 1,
        duration: 0.7,
        ease: 'power3.inOut',
      }, '-=0.5')

    // Phase 5: Subtitle
      .to(subtitle, {
        autoAlpha: 1,
        y: 0,
        duration: 0.5,
      }, '-=0.2')

    // Hold
      .to({}, { duration: 0.6 })

    // Phase 6: Exit — blobs expand & fade, splash dissolves
      .to([b1, b2, b3, b4], {
        scale: 1.8,
        autoAlpha: 0,
        duration: 1,
        ease: 'power2.in',
      })
      .to(splash, {
        autoAlpha: 0,
        duration: 0.5,
      }, '-=0.5')
      .to(content, {
        autoAlpha: 1,
        y: 0,
        duration: 0.7,
      }, '-=0.3')

    tlRef.current = tl
  }

  useLayoutEffect(() => {
    runAnimation()
    return () => { if (tlRef.current) tlRef.current.kill() }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const blobBase: React.CSSProperties = {
    position: 'absolute',
    borderRadius: '40% 60% 55% 45% / 55% 40% 60% 45%',
    filter: 'blur(80px)',
    willChange: 'transform, opacity',
  }

  return (
    <div ref={rootRef} style={{ position: 'relative', width: '100%', minHeight: '100vh', overflow: 'hidden' }}>
      {/* Splash */}
      <div ref={splashRef} style={{
        position: 'fixed', inset: 0, zIndex: 100,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        background: '#08080c', overflow: 'hidden',
      }}>
        {/* Gradient blobs */}
        <div ref={blob1Ref} style={{
          ...blobBase,
          width: '55vw', height: '55vw', maxWidth: 600, maxHeight: 600,
          background: 'linear-gradient(135deg, #ff6b6b, #ee5a24, #f0932b)',
          opacity: 0.5,
        }} />
        <div ref={blob2Ref} style={{
          ...blobBase,
          width: '50vw', height: '50vw', maxWidth: 550, maxHeight: 550,
          background: 'linear-gradient(225deg, #6c5ce7, #a29bfe, #74b9ff)',
          opacity: 0.5,
        }} />
        <div ref={blob3Ref} style={{
          ...blobBase,
          width: '40vw', height: '40vw', maxWidth: 450, maxHeight: 450,
          background: 'linear-gradient(315deg, #00cec9, #55efc4, #81ecec)',
          opacity: 0.4,
        }} />
        <div ref={blob4Ref} style={{
          ...blobBase,
          width: '45vw', height: '45vw', maxWidth: 500, maxHeight: 500,
          background: 'linear-gradient(45deg, #fd79a8, #e84393, #d63031)',
          opacity: 0.35,
        }} />

        {/* Logo: outline version (shows first) */}
        <div ref={outlineRef} style={{
          position: 'relative', zIndex: 2,
          fontSize: 'clamp(4rem, 13vw, 8.5rem)',
          fontWeight: 800,
          fontFamily: "'Inter', -apple-system, sans-serif",
          letterSpacing: '-0.02em',
          color: 'transparent',
          WebkitTextStroke: '1.5px rgba(255,255,255,0.3)',
          lineHeight: 1,
        }}>
          Genie
        </div>

        {/* Logo: solid version */}
        <div ref={logoRef} style={{
          position: 'absolute', zIndex: 3,
          fontSize: 'clamp(4rem, 13vw, 8.5rem)',
          fontWeight: 800,
          fontFamily: "'Inter', -apple-system, sans-serif",
          letterSpacing: '-0.02em',
          color: '#fff',
          lineHeight: 1,
          textShadow: '0 0 60px rgba(255,255,255,0.15)',
        }}>
          Genie
        </div>

        {/* Underline */}
        <div ref={underlineRef} style={{
          position: 'relative', zIndex: 3,
          width: 'clamp(80px, 20vw, 160px)', height: 2,
          marginTop: 16,
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)',
          willChange: 'transform',
        }} />

        {/* Subtitle */}
        <div ref={subtitleRef} style={{
          position: 'relative', zIndex: 3,
          marginTop: 20,
          fontSize: 'clamp(0.75rem, 1.6vw, 0.95rem)',
          letterSpacing: '0.35em',
          color: 'rgba(255,255,255,0.4)',
          textTransform: 'uppercase',
          fontFamily: "'Inter', -apple-system, sans-serif",
        }}>
          Fluid Intelligence
        </div>
      </div>

      {/* Content */}
      <div ref={contentRef} style={{
        minHeight: '100vh',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        background: 'linear-gradient(180deg, #08080c 0%, #12121e 50%, #08080c 100%)',
        padding: '60px 24px', gap: 40,
      }}>
        <SplashNav theme="dark" onReplay={runAnimation} />

        <div style={{ maxWidth: 720, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 }}>
          <div style={{
            fontSize: 'clamp(3rem, 8vw, 5rem)', fontWeight: 800,
            fontFamily: "'Inter', -apple-system, sans-serif",
            background: 'linear-gradient(135deg, #ff6b6b, #a29bfe, #55efc4, #fd79a8)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>
            Liquid Splash
          </div>
          <p style={{ fontSize: 'clamp(1rem, 2.5vw, 1.2rem)', color: 'rgba(255,255,255,0.35)', lineHeight: 1.7, maxWidth: 540 }}>
            流体渐变风格入场。四个高斯模糊的渐变色块从屏幕四角游入中心区域，有机地漂浮交融，
            在它们汇合的同时品牌名从描边变为实体，配合光带扫过和优雅的渐隐退场。
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center' }}>
            {['Gradient Blobs', 'Organic Motion', 'Outline→Solid', 'Light Sweep', 'Stripe-like'].map(tag => (
              <span key={tag} style={{
                padding: '6px 14px', borderRadius: 20,
                border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.03)',
                color: 'rgba(255,255,255,0.45)', fontSize: 12, fontWeight: 500,
              }}>{tag}</span>
            ))}
          </div>
        </div>

        {showReplay && (
          <div style={{ marginTop: 20, fontSize: 13, color: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', gap: 6 }}>
            <RotateCcw size={13} /> 点击右上角重新播放
          </div>
        )}
      </div>
    </div>
  )
}
