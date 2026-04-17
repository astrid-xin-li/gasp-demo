import { useLayoutEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { RotateCcw } from 'lucide-react'
import { SplashNav } from './components/SplashNav'

/**
 * Genie Gravity Splash — 重力掉落 / 弹跳物理风格
 *
 * 灵感：Google Doodle / Dropbox / 趣味品牌
 * 编排：字母从顶部自由落体 → 落地弹跳（多次回弹）→ 稳定后弹出装饰元素
 */
export default function GenieGravityPage() {
  const rootRef = useRef<HTMLDivElement>(null)
  const splashRef = useRef<HTMLDivElement>(null)
  const lettersRef = useRef<(HTMLDivElement | null)[]>([])
  const floorRef = useRef<HTMLDivElement>(null)
  const deco1Ref = useRef<HTMLDivElement>(null)
  const deco2Ref = useRef<HTMLDivElement>(null)
  const deco3Ref = useRef<HTMLDivElement>(null)
  const subtitleRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const tlRef = useRef<gsap.core.Timeline | null>(null)
  const [showReplay, setShowReplay] = useState(false)

  const letters = ['G', 'e', 'n', 'i', 'e']
  const colors = ['#ff6b6b', '#feca57', '#48dbfb', '#ff9ff3', '#54a0ff']

  const runAnimation = () => {
    if (tlRef.current) tlRef.current.kill()
    setShowReplay(false)
    const splash = splashRef.current, floor = floorRef.current
    const d1 = deco1Ref.current, d2 = deco2Ref.current, d3 = deco3Ref.current
    const subtitle = subtitleRef.current, content = contentRef.current
    const els = lettersRef.current.filter(Boolean) as HTMLDivElement[]
    if (!splash || !floor || !d1 || !d2 || !d3 || !subtitle || !content || els.length !== 5) return

    gsap.set(splash, { autoAlpha: 1 })
    gsap.set(floor, { scaleX: 0 })
    gsap.set([d1, d2, d3], { scale: 0, autoAlpha: 0 })
    gsap.set(subtitle, { autoAlpha: 0, y: 10 })
    gsap.set(content, { autoAlpha: 0, y: 40 })
    els.forEach((el) => {
      gsap.set(el, { y: -500, autoAlpha: 0, rotation: 0 })
    })

    const tl = gsap.timeline({ defaults: { ease: 'none' }, onComplete: () => setShowReplay(true) })

    // Phase 1: Floor line appears
    tl.to(floor, { scaleX: 1, duration: 0.3, ease: 'power2.out' })

    // Phase 2: Letters drop with stagger — gravity + bounce
    els.forEach((el, i) => {
      const startTime = 0.3 + i * 0.12
      // Drop (accelerating like gravity)
      tl.to(el, { y: 0, autoAlpha: 1, duration: 0.5, ease: 'power2.in', rotation: (i % 2 === 0 ? 8 : -8) }, startTime)
      // First bounce
        .to(el, { y: -60, duration: 0.2, ease: 'power2.out' }, startTime + 0.5)
        .to(el, { y: 0, duration: 0.2, ease: 'power2.in' }, startTime + 0.7)
      // Second bounce (smaller)
        .to(el, { y: -20, duration: 0.12, ease: 'power2.out' }, startTime + 0.9)
        .to(el, { y: 0, duration: 0.12, ease: 'power2.in' }, startTime + 1.02)
      // Settle rotation
        .to(el, { rotation: 0, duration: 0.3, ease: 'elastic.out(1, 0.4)' }, startTime + 1.14)
    })

    // Phase 3: Decorative elements pop out
    const decoTime = 0.3 + 5 * 0.12 + 1.3
    tl.to(d1, { scale: 1, autoAlpha: 1, duration: 0.4, ease: 'back.out(3)' }, decoTime)
      .to(d2, { scale: 1, autoAlpha: 1, duration: 0.4, ease: 'back.out(3)' }, decoTime + 0.1)
      .to(d3, { scale: 1, autoAlpha: 1, duration: 0.4, ease: 'back.out(3)' }, decoTime + 0.2)

    // Phase 4: Subtitle
    tl.to(subtitle, { autoAlpha: 1, y: 0, duration: 0.4, ease: 'power2.out' }, decoTime + 0.3)

    // Hold + exit
    tl.to({}, { duration: 0.5 })
      .to(splash, { autoAlpha: 0, y: -30, duration: 0.5, ease: 'power2.in' })
      .to(content, { autoAlpha: 1, y: 0, duration: 0.6, ease: 'power2.out' }, '-=0.3')

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
        background: '#fefefe', overflow: 'hidden',
      }}>
        {/* Dot pattern */}
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.04,
          backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)',
          backgroundSize: '20px 20px',
        }} />

        {/* Letters */}
        <div style={{ position: 'relative', zIndex: 2, display: 'flex', alignItems: 'flex-end', gap: 'clamp(2px, 0.5vw, 8px)' }}>
          {letters.map((char, i) => (
            <div
              key={i}
              ref={el => { lettersRef.current[i] = el }}
              style={{
                fontSize: 'clamp(4.5rem, 14vw, 9rem)', fontWeight: 800,
                fontFamily: "'Inter', sans-serif",
                color: colors[i], lineHeight: 1,
                willChange: 'transform, opacity',
                filter: `drop-shadow(0 4px 12px ${colors[i]}40)`,
              }}
            >{char}</div>
          ))}
        </div>

        {/* Floor line */}
        <div ref={floorRef} style={{
          width: 'clamp(200px, 50vw, 480px)', height: 3, marginTop: 4,
          background: 'linear-gradient(90deg, transparent, #333, transparent)',
          transformOrigin: 'center center', zIndex: 2,
        }} />

        {/* Decorative elements */}
        <div ref={deco1Ref} style={{
          position: 'absolute', top: '25%', left: '20%', width: 16, height: 16,
          borderRadius: '50%', background: '#feca57', zIndex: 1,
        }} />
        <div ref={deco2Ref} style={{
          position: 'absolute', top: '30%', right: '22%', width: 12, height: 12,
          borderRadius: 2, background: '#48dbfb', transform: 'rotate(45deg)', zIndex: 1,
        }} />
        <div ref={deco3Ref} style={{
          position: 'absolute', bottom: '32%', left: '30%', width: 0, height: 0,
          borderLeft: '8px solid transparent', borderRight: '8px solid transparent',
          borderBottom: '14px solid #ff6b6b', zIndex: 1,
        }} />

        <div ref={subtitleRef} style={{
          marginTop: 24, fontSize: 'clamp(0.75rem, 1.5vw, 0.9rem)',
          letterSpacing: '0.3em', color: 'rgba(0,0,0,0.3)', textTransform: 'uppercase',
          fontWeight: 500, zIndex: 2,
        }}>Fun Starts Here</div>
      </div>

      <div ref={contentRef} style={{
        minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        background: '#fefefe', padding: '60px 24px', gap: 40,
      }}>
        <SplashNav theme="light" onReplay={runAnimation} />
        <div style={{ maxWidth: 720, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 }}>
          <div style={{ fontSize: 'clamp(3rem, 8vw, 5rem)', fontWeight: 800, color: '#0a0a0a' }}>
            Gravity Splash
          </div>
          <p style={{ fontSize: 'clamp(1rem, 2.5vw, 1.2rem)', color: 'rgba(0,0,0,0.4)', lineHeight: 1.7, maxWidth: 540 }}>
            重力掉落弹跳风格入场。彩色字母从屏幕顶部自由落体，落地后经过多次弹跳逐渐稳定，
            每个字母有轻微的旋转摇摆。装饰图形弹出增添趣味感，适合面向年轻用户的活泼品牌。
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center' }}>
            {['Gravity Drop', 'Bounce Physics', 'Colorful', 'Playful', 'Google-like'].map(tag => (
              <span key={tag} style={{ padding: '6px 14px', borderRadius: 20, border: '1px solid rgba(0,0,0,0.08)', background: 'rgba(0,0,0,0.02)', color: 'rgba(0,0,0,0.45)', fontSize: 12, fontWeight: 500 }}>{tag}</span>
            ))}
          </div>
        </div>
        {showReplay && (
          <div style={{ marginTop: 20, fontSize: 13, color: 'rgba(0,0,0,0.25)', display: 'flex', alignItems: 'center', gap: 6 }}>
            <RotateCcw size={13} /> 点击右上角重新播放
          </div>
        )}
      </div>
    </div>
  )
}
