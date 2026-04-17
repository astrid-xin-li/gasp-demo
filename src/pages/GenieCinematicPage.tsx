import { useLayoutEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { RotateCcw } from 'lucide-react'
import { SplashNav } from './components/SplashNav'

/**
 * Genie Cinematic Splash — 电影幕帘风格
 *
 * 灵感：Netflix / Disney+ 开屏
 * 编排：幕帘从中间拉开 → 品牌字体从景深推入 → 光线扫过 → 背景渐变转场
 */
export default function GenieCinematicPage() {
  const rootRef = useRef<HTMLDivElement>(null)
  const splashRef = useRef<HTMLDivElement>(null)
  const curtainLeftRef = useRef<HTMLDivElement>(null)
  const curtainRightRef = useRef<HTMLDivElement>(null)
  const logoRef = useRef<HTMLDivElement>(null)
  const shineRef = useRef<HTMLDivElement>(null)
  const subtitleRef = useRef<HTMLDivElement>(null)
  const lensFlareRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const tlRef = useRef<gsap.core.Timeline | null>(null)

  const [showReplay, setShowReplay] = useState(false)

  const runAnimation = () => {
    if (tlRef.current) tlRef.current.kill()
    setShowReplay(false)

    const splash = splashRef.current
    const cl = curtainLeftRef.current
    const cr = curtainRightRef.current
    const logo = logoRef.current
    const shine = shineRef.current
    const subtitle = subtitleRef.current
    const lensFlare = lensFlareRef.current
    const content = contentRef.current

    if (!splash || !cl || !cr || !logo || !shine || !subtitle || !lensFlare || !content) return

    gsap.set(splash, { autoAlpha: 1 })
    gsap.set(cl, { xPercent: 0 })
    gsap.set(cr, { xPercent: 0 })
    gsap.set(logo, { autoAlpha: 0, scale: 2.5, z: -200 })
    gsap.set(shine, { xPercent: -120, autoAlpha: 0 })
    gsap.set(subtitle, { autoAlpha: 0, y: 20 })
    gsap.set(lensFlare, { autoAlpha: 0, scale: 0 })
    gsap.set(content, { autoAlpha: 0, y: 40 })

    const tl = gsap.timeline({
      defaults: { ease: 'power3.out' },
      onComplete: () => setShowReplay(true),
    })

    // Phase 1: Curtains pull apart
    tl.to(cl, { xPercent: -100, duration: 1.2, ease: 'power2.inOut' })
      .to(cr, { xPercent: 100, duration: 1.2, ease: 'power2.inOut' }, '<')

    // Phase 2: Logo zooms from deep background
      .to(logo, {
        autoAlpha: 1,
        scale: 1,
        z: 0,
        duration: 1.4,
        ease: 'expo.out',
      }, '-=0.6')

    // Phase 3: Light sweep across logo
      .to(shine, {
        xPercent: 220,
        autoAlpha: 1,
        duration: 0.8,
        ease: 'power2.inOut',
      }, '-=0.5')

    // Phase 4: Lens flare burst
      .to(lensFlare, {
        autoAlpha: 0.7,
        scale: 1,
        duration: 0.4,
        ease: 'power2.out',
      }, '-=0.4')
      .to(lensFlare, {
        autoAlpha: 0,
        scale: 2,
        duration: 0.8,
        ease: 'power1.out',
      })

    // Phase 5: Subtitle appears
      .to(subtitle, {
        autoAlpha: 1,
        y: 0,
        duration: 0.6,
      }, '-=0.8')

    // Hold
      .to({}, { duration: 0.5 })

    // Phase 6: Fade out splash, reveal content
      .to(splash, {
        autoAlpha: 0,
        scale: 1.05,
        duration: 0.8,
        ease: 'power2.inOut',
      })
      .to(content, {
        autoAlpha: 1,
        y: 0,
        duration: 0.8,
      }, '-=0.4')

    tlRef.current = tl
  }

  useLayoutEffect(() => {
    runAnimation()
    return () => { if (tlRef.current) tlRef.current.kill() }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div ref={rootRef} style={{ position: 'relative', width: '100%', minHeight: '100vh', overflow: 'hidden' }}>
      {/* Splash */}
      <div ref={splashRef} style={{
        position: 'fixed', inset: 0, zIndex: 100,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: '#000', overflow: 'hidden', perspective: '600px',
      }}>
        {/* Curtain Left */}
        <div ref={curtainLeftRef} style={{
          position: 'absolute', top: 0, left: 0, width: '50%', height: '100%',
          background: 'linear-gradient(90deg, #1a0a00 0%, #2d1200 60%, #4a1e00 100%)',
          zIndex: 10,
          boxShadow: '4px 0 40px rgba(180,100,20,0.3)',
        }}>
          {/* Curtain texture */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'repeating-linear-gradient(90deg, transparent, transparent 3px, rgba(255,255,255,0.02) 3px, rgba(255,255,255,0.02) 6px)',
          }} />
        </div>

        {/* Curtain Right */}
        <div ref={curtainRightRef} style={{
          position: 'absolute', top: 0, right: 0, width: '50%', height: '100%',
          background: 'linear-gradient(270deg, #1a0a00 0%, #2d1200 60%, #4a1e00 100%)',
          zIndex: 10,
          boxShadow: '-4px 0 40px rgba(180,100,20,0.3)',
        }}>
          <div style={{
            position: 'absolute', inset: 0,
            background: 'repeating-linear-gradient(90deg, transparent, transparent 3px, rgba(255,255,255,0.02) 3px, rgba(255,255,255,0.02) 6px)',
          }} />
        </div>

        {/* Background behind curtains */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse at center, #0c0c1e 0%, #020208 100%)',
        }} />

        {/* Logo */}
        <div ref={logoRef} style={{
          position: 'relative', zIndex: 5,
          fontSize: 'clamp(4rem, 12vw, 8rem)',
          fontWeight: 800,
          fontFamily: "'Inter', -apple-system, sans-serif",
          letterSpacing: '-0.03em',
          color: '#f5e6d3',
          textShadow: '0 0 60px rgba(255,200,100,0.3), 0 0 120px rgba(255,160,60,0.15)',
          overflow: 'hidden',
          transformStyle: 'preserve-3d',
        }}>
          Genie

          {/* Light sweep */}
          <div ref={shineRef} style={{
            position: 'absolute',
            top: 0, left: 0,
            width: '40%', height: '100%',
            background: 'linear-gradient(90deg, transparent, rgba(255,220,160,0.4), transparent)',
            transform: 'skewX(-20deg)',
            pointerEvents: 'none',
          }} />
        </div>

        {/* Lens Flare */}
        <div ref={lensFlareRef} style={{
          position: 'absolute',
          width: 300, height: 300,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,200,100,0.6) 0%, rgba(255,160,60,0.2) 40%, transparent 70%)',
          filter: 'blur(20px)',
          zIndex: 4,
        }} />

        {/* Subtitle */}
        <div ref={subtitleRef} style={{
          position: 'absolute',
          bottom: '30%',
          zIndex: 5,
          fontSize: 'clamp(0.8rem, 1.8vw, 1rem)',
          letterSpacing: '0.4em',
          color: 'rgba(245,230,211,0.5)',
          textTransform: 'uppercase',
          fontFamily: "'Inter', -apple-system, sans-serif",
        }}>
          A Cinematic Experience
        </div>

        {/* Vignette */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.6) 100%)',
          zIndex: 6, pointerEvents: 'none',
        }} />
      </div>

      {/* Content */}
      <div ref={contentRef} style={{
        minHeight: '100vh',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        background: 'linear-gradient(180deg, #0c0c1e 0%, #1a1a2e 50%, #0c0c1e 100%)',
        padding: '60px 24px', gap: 40,
      }}>
        <SplashNav theme="warm" onReplay={runAnimation} />

        <div style={{ maxWidth: 720, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 }}>
          <div style={{
            fontSize: 'clamp(3rem, 8vw, 5rem)', fontWeight: 800,
            fontFamily: "'Inter', -apple-system, sans-serif",
            color: '#f5e6d3',
            textShadow: '0 0 40px rgba(255,200,100,0.2)',
          }}>
            Cinematic Splash
          </div>
          <p style={{ fontSize: 'clamp(1rem, 2.5vw, 1.2rem)', color: 'rgba(245,230,211,0.5)', lineHeight: 1.7, maxWidth: 540 }}>
            电影幕帘风格入场。双侧幕帘从中间拉开，品牌名从景深推入画面，光线从左侧扫过字体，
            配合 Lens Flare 闪光效果，营造电影院开场的仪式感。
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center' }}>
            {['Curtain Pull', 'Depth Zoom', 'Light Sweep', 'Lens Flare', 'Vignette'].map(tag => (
              <span key={tag} style={{
                padding: '6px 14px', borderRadius: 20,
                border: '1px solid rgba(255,200,100,0.2)',
                background: 'rgba(255,200,100,0.06)',
                color: 'rgba(245,230,211,0.6)', fontSize: 12, fontWeight: 500,
              }}>{tag}</span>
            ))}
          </div>
        </div>

        {showReplay && (
          <div style={{ marginTop: 20, fontSize: 13, color: 'rgba(245,230,211,0.3)', display: 'flex', alignItems: 'center', gap: 6 }}>
            <RotateCcw size={13} /> 点击右上角重新播放
          </div>
        )}
      </div>
    </div>
  )
}
