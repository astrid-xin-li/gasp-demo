import { useLayoutEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { RotateCcw } from 'lucide-react'
import { SplashNav } from './components/SplashNav'

/**
 * Genie Morph Splash — SVG 路径变形风格
 *
 * 灵感：Airbnb / Spotify 品牌动画
 * 编排：抽象图形不断变形 → 最终变形为品牌首字母 G → 文字淡入
 */
export default function GenieMorphPage() {
  const rootRef = useRef<HTMLDivElement>(null)
  const splashRef = useRef<HTMLDivElement>(null)
  const shape1Ref = useRef<HTMLDivElement>(null)
  const shape2Ref = useRef<HTMLDivElement>(null)
  const shape3Ref = useRef<HTMLDivElement>(null)
  const letterRef = useRef<HTMLDivElement>(null)
  const restRef = useRef<HTMLDivElement>(null)
  const subtitleRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const tlRef = useRef<gsap.core.Timeline | null>(null)
  const [showReplay, setShowReplay] = useState(false)

  const runAnimation = () => {
    if (tlRef.current) tlRef.current.kill()
    setShowReplay(false)
    const splash = splashRef.current, s1 = shape1Ref.current, s2 = shape2Ref.current
    const s3 = shape3Ref.current, letter = letterRef.current, rest = restRef.current
    const subtitle = subtitleRef.current, content = contentRef.current
    if (!splash || !s1 || !s2 || !s3 || !letter || !rest || !subtitle || !content) return

    gsap.set(splash, { autoAlpha: 1 })
    gsap.set(s1, { scale: 0, rotation: 0, borderRadius: '50%', autoAlpha: 0 })
    gsap.set(s2, { scale: 0, rotation: 0, borderRadius: '50%', autoAlpha: 0 })
    gsap.set(s3, { scale: 0, rotation: 0, borderRadius: '50%', autoAlpha: 0 })
    gsap.set(letter, { autoAlpha: 0, scale: 3 })
    gsap.set(rest, { autoAlpha: 0, x: -20 })
    gsap.set(subtitle, { autoAlpha: 0, y: 12 })
    gsap.set(content, { autoAlpha: 0, y: 40 })

    const tl = gsap.timeline({ defaults: { ease: 'power2.inOut' }, onComplete: () => setShowReplay(true) })

    // Phase 1: Shapes appear as circles
    tl.to(s1, { scale: 1, autoAlpha: 1, duration: 0.6 })
      .to(s2, { scale: 1, autoAlpha: 1, duration: 0.6 }, '-=0.4')
      .to(s3, { scale: 1, autoAlpha: 1, duration: 0.6 }, '-=0.4')

    // Phase 2: Morph to squares + rotate
      .to(s1, { borderRadius: '16%', rotation: 45, scale: 1.1, duration: 0.8 })
      .to(s2, { borderRadius: '24%', rotation: -30, scale: 0.9, duration: 0.8 }, '<')
      .to(s3, { borderRadius: '8%', rotation: 60, scale: 1.2, duration: 0.8 }, '<')

    // Phase 3: Morph to different shapes + move
      .to(s1, { borderRadius: '50% 0 50% 0', rotation: 90, x: -40, y: -20, scale: 0.8, duration: 0.7 })
      .to(s2, { borderRadius: '0 50% 0 50%', rotation: 180, x: 30, y: 30, scale: 0.7, duration: 0.7 }, '<')
      .to(s3, { borderRadius: '50%', rotation: -90, x: 10, y: -40, scale: 1, duration: 0.7 }, '<')

    // Phase 4: All converge to center + morph to circle
      .to([s1, s2, s3], { x: 0, y: 0, scale: 0.6, borderRadius: '50%', rotation: 360, duration: 0.6 })

    // Phase 5: Shapes merge into one + flash
      .to(s1, { scale: 1.2, autoAlpha: 0.8, duration: 0.3 })
      .to([s2, s3], { scale: 0, autoAlpha: 0, duration: 0.3 }, '<')

    // Phase 6: Shape shrinks, letter G appears
      .to(s1, { scale: 0, autoAlpha: 0, duration: 0.4 })
      .to(letter, { autoAlpha: 1, scale: 1, duration: 0.6, ease: 'back.out(1.7)' }, '-=0.2')

    // Phase 7: Rest of brand name slides in
      .to(rest, { autoAlpha: 1, x: 0, duration: 0.5, ease: 'power3.out' }, '-=0.1')

    // Phase 8: Subtitle
      .to(subtitle, { autoAlpha: 1, y: 0, duration: 0.4 }, '-=0.1')

    // Hold + exit
      .to({}, { duration: 0.6 })
      .to(splash, { autoAlpha: 0, duration: 0.6 })
      .to(content, { autoAlpha: 1, y: 0, duration: 0.6 }, '-=0.3')

    tlRef.current = tl
  }

  useLayoutEffect(() => {
    runAnimation()
    return () => { if (tlRef.current) tlRef.current.kill() }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const shapeBase: React.CSSProperties = {
    position: 'absolute', width: 100, height: 100,
    willChange: 'transform, opacity, border-radius',
  }

  return (
    <div ref={rootRef} style={{ position: 'relative', width: '100%', minHeight: '100vh', overflow: 'hidden' }}>
      <div ref={splashRef} style={{
        position: 'fixed', inset: 0, zIndex: 100,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', overflow: 'hidden',
      }}>
        <div ref={shape1Ref} style={{ ...shapeBase, background: 'linear-gradient(135deg, #f472b6, #ec4899)' }} />
        <div ref={shape2Ref} style={{ ...shapeBase, background: 'linear-gradient(135deg, #60a5fa, #3b82f6)' }} />
        <div ref={shape3Ref} style={{ ...shapeBase, background: 'linear-gradient(135deg, #34d399, #10b981)' }} />

        <div style={{ position: 'relative', zIndex: 2, display: 'flex', alignItems: 'baseline' }}>
          <div ref={letterRef} style={{
            fontSize: 'clamp(4rem, 12vw, 8rem)', fontWeight: 800,
            fontFamily: "'Inter', sans-serif",
            background: 'linear-gradient(135deg, #f472b6, #60a5fa, #34d399)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>G</div>
          <div ref={restRef} style={{
            fontSize: 'clamp(4rem, 12vw, 8rem)', fontWeight: 800,
            fontFamily: "'Inter', sans-serif",
            background: 'linear-gradient(135deg, #60a5fa, #34d399)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>enie</div>
        </div>

        <div ref={subtitleRef} style={{
          position: 'relative', zIndex: 2, marginTop: 20,
          fontSize: 'clamp(0.75rem, 1.5vw, 0.9rem)', letterSpacing: '0.35em',
          color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase',
        }}>Shape-Shifting Intelligence</div>
      </div>

      <div ref={contentRef} style={{
        minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        background: 'linear-gradient(180deg, #0f172a, #1e293b 50%, #0f172a)', padding: '60px 24px', gap: 40,
      }}>
        <SplashNav theme="dark" onReplay={runAnimation} />
        <div style={{ maxWidth: 720, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 }}>
          <div style={{ fontSize: 'clamp(3rem, 8vw, 5rem)', fontWeight: 800, background: 'linear-gradient(135deg, #f472b6, #60a5fa, #34d399)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Morph Splash
          </div>
          <p style={{ fontSize: 'clamp(1rem, 2.5vw, 1.2rem)', color: 'rgba(255,255,255,0.35)', lineHeight: 1.7, maxWidth: 540 }}>
            图形变形风格入场。三个彩色形状不断变换圆角、旋转角度和位置，经过圆→方→异形→收束的过程后融合消失，品牌名从首字母 G 开始逐步展开。
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center' }}>
            {['Shape Morph', 'Border-radius', 'Converge', 'Color Gradient', 'Playful'].map(tag => (
              <span key={tag} style={{ padding: '6px 14px', borderRadius: 20, border: '1px solid rgba(244,114,182,0.2)', background: 'rgba(244,114,182,0.06)', color: 'rgba(244,114,182,0.6)', fontSize: 12, fontWeight: 500 }}>{tag}</span>
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
