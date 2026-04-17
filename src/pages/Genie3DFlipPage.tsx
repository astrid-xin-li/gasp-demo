import { useLayoutEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { RotateCcw } from 'lucide-react'
import { SplashNav } from './components/SplashNav'

/**
 * Genie 3D Flip Splash — 3D 翻转多面体风格
 * 灵感：Apple 产品发布 / 高端汽车广告
 */
export default function Genie3DFlipPage() {
  const rootRef = useRef<HTMLDivElement>(null)
  const splashRef = useRef<HTMLDivElement>(null)
  const cubeRef = useRef<HTMLDivElement>(null)
  const brandRef = useRef<HTMLDivElement>(null)
  const lineLeftRef = useRef<HTMLDivElement>(null)
  const lineRightRef = useRef<HTMLDivElement>(null)
  const subtitleRef = useRef<HTMLDivElement>(null)
  const ambientRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const tlRef = useRef<gsap.core.Timeline | null>(null)
  const [showReplay, setShowReplay] = useState(false)

  const runAnimation = () => {
    if (tlRef.current) tlRef.current.kill()
    setShowReplay(false)
    const splash = splashRef.current, cube = cubeRef.current, brand = brandRef.current
    const ll = lineLeftRef.current, lr = lineRightRef.current
    const subtitle = subtitleRef.current, ambient = ambientRef.current, content = contentRef.current
    if (!splash || !cube || !brand || !ll || !lr || !subtitle || !ambient || !content) return

    gsap.set(splash, { autoAlpha: 1 })
    gsap.set(cube, { rotateX: 45, rotateY: -180, scale: 0.3, autoAlpha: 0 })
    gsap.set(brand, { autoAlpha: 0, scale: 0.8 })
    gsap.set(ll, { scaleX: 0, transformOrigin: 'right center' })
    gsap.set(lr, { scaleX: 0, transformOrigin: 'left center' })
    gsap.set(subtitle, { autoAlpha: 0, y: 16 })
    gsap.set(ambient, { autoAlpha: 0, scale: 0.5 })
    gsap.set(content, { autoAlpha: 0, y: 40 })

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' }, onComplete: () => setShowReplay(true) })

    tl.to(cube, { rotateX: 360, rotateY: 360, scale: 0.8, autoAlpha: 1, duration: 1.5, ease: 'power2.out' })
      .to(cube, { rotateX: 720, rotateY: 720, scale: 1, duration: 1.8, ease: 'power2.inOut' })
      .to(ambient, { autoAlpha: 0.5, scale: 1, duration: 1, ease: 'power1.out' }, '-=1')
      .to(cube, { autoAlpha: 0, scale: 1.3, duration: 0.6, ease: 'power2.in' })
      .to(brand, { autoAlpha: 1, scale: 1, duration: 0.7, ease: 'back.out(1.5)' }, '-=0.3')
      .to(ll, { scaleX: 1, duration: 0.5 }, '-=0.3')
      .to(lr, { scaleX: 1, duration: 0.5 }, '<')
      .to(subtitle, { autoAlpha: 1, y: 0, duration: 0.5 }, '-=0.2')
      .to(ambient, { scale: 1.3, autoAlpha: 0.3, duration: 0.8, ease: 'sine.inOut' })
      .to(ambient, { scale: 1, autoAlpha: 0.5, duration: 0.8, ease: 'sine.inOut' })
      .to({}, { duration: 0.3 })
      .to(splash, { autoAlpha: 0, duration: 0.7, ease: 'power2.inOut' })
      .to(content, { autoAlpha: 1, y: 0, duration: 0.7 }, '-=0.3')

    tlRef.current = tl
  }

  useLayoutEffect(() => {
    runAnimation()
    return () => { if (tlRef.current) tlRef.current.kill() }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const cubeSize = 180
  const half = cubeSize / 2
  const faceBase: React.CSSProperties = {
    position: 'absolute', width: cubeSize, height: cubeSize,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 48, fontWeight: 700, fontFamily: "'Inter', sans-serif",
    backfaceVisibility: 'hidden', border: '1px solid rgba(255,255,255,0.1)',
  }

  return (
    <div ref={rootRef} style={{ position: 'relative', width: '100%', minHeight: '100vh', overflow: 'hidden' }}>
      <div ref={splashRef} style={{
        position: 'fixed', inset: 0, zIndex: 100,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        background: 'radial-gradient(ellipse at center, #111827, #030712)', overflow: 'hidden', perspective: 1200,
      }}>
        <div style={{
          position: 'absolute', bottom: 0, left: '-20%', right: '-20%', height: '50%',
          backgroundImage: 'linear-gradient(rgba(56,189,248,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(56,189,248,0.05) 1px, transparent 1px)',
          backgroundSize: '60px 60px', transform: 'perspective(500px) rotateX(60deg)', transformOrigin: 'center top',
        }} />

        <div ref={ambientRef} style={{
          position: 'absolute', width: 400, height: 400, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(56,189,248,0.15), rgba(168,85,247,0.08) 50%, transparent 70%)',
          filter: 'blur(60px)',
        }} />

        <div ref={cubeRef} style={{
          position: 'relative', zIndex: 2, width: cubeSize, height: cubeSize,
          transformStyle: 'preserve-3d', willChange: 'transform',
        }}>
          <div style={{ ...faceBase, background: 'linear-gradient(135deg, rgba(56,189,248,0.2), rgba(168,85,247,0.2))', transform: `translateZ(${half}px)`, color: '#38bdf8' }}>G</div>
          <div style={{ ...faceBase, background: 'linear-gradient(135deg, rgba(168,85,247,0.2), rgba(236,72,153,0.2))', transform: `rotateY(180deg) translateZ(${half}px)`, color: '#a855f7' }}>N</div>
          <div style={{ ...faceBase, background: 'linear-gradient(135deg, rgba(34,197,94,0.2), rgba(56,189,248,0.2))', transform: `rotateY(90deg) translateZ(${half}px)`, color: '#22c55e' }}>E</div>
          <div style={{ ...faceBase, background: 'linear-gradient(135deg, rgba(236,72,153,0.2), rgba(249,115,22,0.2))', transform: `rotateY(-90deg) translateZ(${half}px)`, color: '#ec4899' }}>I</div>
          <div style={{ ...faceBase, background: 'linear-gradient(135deg, rgba(249,115,22,0.2), rgba(234,179,8,0.2))', transform: `rotateX(90deg) translateZ(${half}px)`, color: '#f97316' }}>E</div>
          <div style={{ ...faceBase, background: 'linear-gradient(135deg, rgba(234,179,8,0.2), rgba(34,197,94,0.2))', transform: `rotateX(-90deg) translateZ(${half}px)`, color: '#eab308' }}>✦</div>
        </div>

        <div ref={brandRef} style={{ position: 'absolute', zIndex: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
          <div style={{
            fontSize: 'clamp(4rem, 12vw, 7.5rem)', fontWeight: 800, fontFamily: "'Inter', sans-serif", letterSpacing: '-0.03em',
            background: 'linear-gradient(135deg, #38bdf8, #a855f7 40%, #ec4899 70%, #f97316)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', lineHeight: 1,
          }}>Genie</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, width: '100%' }}>
            <div ref={lineLeftRef} style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, transparent, rgba(56,189,248,0.5))' }} />
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'linear-gradient(135deg, #38bdf8, #a855f7)' }} />
            <div ref={lineRightRef} style={{ flex: 1, height: 1, background: 'linear-gradient(270deg, transparent, rgba(168,85,247,0.5))' }} />
          </div>
          <div ref={subtitleRef} style={{
            fontSize: 'clamp(0.75rem, 1.5vw, 0.9rem)', letterSpacing: '0.35em',
            color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase',
          }}>Multidimensional Intelligence</div>
        </div>
      </div>

      <div ref={contentRef} style={{
        minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        background: 'linear-gradient(180deg, #030712, #111827 50%, #030712)', padding: '60px 24px', gap: 40,
      }}>
        <SplashNav theme="dark" onReplay={runAnimation} />
        <div style={{ maxWidth: 720, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 }}>
          <div style={{
            fontSize: 'clamp(3rem, 8vw, 5rem)', fontWeight: 800,
            background: 'linear-gradient(135deg, #38bdf8, #a855f7, #ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>3D Flip Splash</div>
          <p style={{ fontSize: 'clamp(1rem, 2.5vw, 1.2rem)', color: 'rgba(255,255,255,0.35)', lineHeight: 1.7, maxWidth: 540 }}>
            3D 翻转多面体风格入场。品牌字母分布在立方体的六个面上，方块从远处飞入并持续旋转，
            每个面依次闪过，最终方块消散后品牌名以彩虹渐变完整呈现。
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center' }}>
            {['CSS 3D Cube', 'Rotation', 'Dissolve→Reveal', 'Rainbow Gradient', 'Perspective Grid'].map(tag => (
              <span key={tag} style={{
                padding: '6px 14px', borderRadius: 20,
                border: '1px solid rgba(56,189,248,0.2)', background: 'rgba(56,189,248,0.05)',
                color: 'rgba(56,189,248,0.5)', fontSize: 12, fontWeight: 500,
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
