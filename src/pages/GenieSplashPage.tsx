import { useLayoutEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { RotateCcw } from 'lucide-react'
import { SplashNav } from './components/SplashNav'
import { GenieG, GenieE1, GenieN, GenieI, GenieE2 } from './components/GenieLogo'

/**
 * Genie Brand Splash — 品牌 Logo 入场动画
 *
 * 灵感来源：爱奇艺 / Netflix / Apple TV+ 等视频 App 的开屏 Splash
 *
 * 动画编排：
 * 1. 全屏深色背景 + 中心粒子汇聚
 * 2. Logo 字母逐个登场 (stagger)
 * 3. 品牌光晕脉冲 + 下方 tagline 浮现
 * 4. 整个 splash 层上推消失，露出主内容
 */
export default function GenieSplashPage() {
  const rootRef = useRef<HTMLDivElement>(null)
  const splashRef = useRef<HTMLDivElement>(null)
  const logoRef = useRef<HTMLDivElement>(null)
  const glowRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const ring2Ref = useRef<HTMLDivElement>(null)
  const taglineRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const particlesRef = useRef<HTMLDivElement>(null)
  const tlRef = useRef<gsap.core.Timeline | null>(null)

  const [showReplay, setShowReplay] = useState(false)

  const runAnimation = () => {
    if (tlRef.current) {
      tlRef.current.kill()
    }
    setShowReplay(false)

    const splash = splashRef.current
    const logo = logoRef.current
    const glow = glowRef.current
    const ring = ringRef.current
    const ring2 = ring2Ref.current
    const tagline = taglineRef.current
    const content = contentRef.current
    const particles = particlesRef.current

    if (!splash || !logo || !glow || !ring || !ring2 || !tagline || !content || !particles) return

    // Reset states
    gsap.set(splash, { yPercent: 0, autoAlpha: 1 })
    gsap.set(content, { autoAlpha: 0, y: 60 })
    gsap.set(glow, { scale: 0, autoAlpha: 0 })
    gsap.set(ring, { scale: 0, autoAlpha: 0 })
    gsap.set(ring2, { scale: 0, autoAlpha: 0 })
    gsap.set(tagline, { autoAlpha: 0, y: 20 })

    const letters = logo.querySelectorAll<HTMLSpanElement>('.splash-letter')
    gsap.set(letters, { autoAlpha: 0, y: 60, rotateX: -90, scale: 0.6 })

    // Particles
    const particleEls = particles.querySelectorAll<HTMLDivElement>('.particle')
    gsap.set(particleEls, { autoAlpha: 0, scale: 0 })

    const tl = gsap.timeline({
      defaults: { ease: 'power3.out' },
      onComplete: () => setShowReplay(true),
    })

    // Phase 1: Particles converge toward center
    tl.to(particleEls, {
      autoAlpha: 1,
      scale: 1,
      duration: 0.6,
      stagger: { each: 0.03, from: 'random' },
    })
    .to(particleEls, {
      x: 0,
      y: 0,
      duration: 0.8,
      ease: 'power2.in',
      stagger: { each: 0.02, from: 'random' },
    }, '<0.2')

    // Phase 2: Glow burst as particles arrive
    .to(glow, {
      scale: 1,
      autoAlpha: 0.8,
      duration: 0.5,
      ease: 'power2.out',
    }, '-=0.3')
    .to(glow, {
      scale: 1.6,
      autoAlpha: 0.3,
      duration: 1.2,
      ease: 'power1.inOut',
    })

    // Phase 3: Letters stagger in (hero moment)
    .to(letters, {
      autoAlpha: 1,
      y: 0,
      rotateX: 0,
      scale: 1,
      duration: 0.7,
      ease: 'back.out(1.7)',
      stagger: 0.08,
    }, '-=1.1')

    // Hide particles as logo appears
    .to(particleEls, {
      autoAlpha: 0,
      scale: 0.3,
      duration: 0.5,
      stagger: { each: 0.02, from: 'random' },
    }, '-=0.6')

    // Phase 4: Ring pulse
    .to(ring, {
      scale: 1,
      autoAlpha: 0.6,
      duration: 0.6,
      ease: 'power2.out',
    }, '-=0.5')
    .to(ring, {
      scale: 2.5,
      autoAlpha: 0,
      duration: 1.2,
      ease: 'power1.out',
    }, '-=0.1')
    .to(ring2, {
      scale: 1,
      autoAlpha: 0.4,
      duration: 0.5,
      ease: 'power2.out',
    }, '-=1.0')
    .to(ring2, {
      scale: 3,
      autoAlpha: 0,
      duration: 1.4,
      ease: 'power1.out',
    }, '-=0.1')

    // Phase 5: Tagline fades in
    .to(tagline, {
      autoAlpha: 1,
      y: 0,
      duration: 0.6,
    }, '-=1.2')

    // Phase 6: Hold for a beat
    .to({}, { duration: 0.6 })

    // Phase 7: Splash lifts away, content fades in
    .to(splash, {
      yPercent: -100,
      duration: 0.9,
      ease: 'power3.inOut',
    })
    .to(content, {
      autoAlpha: 1,
      y: 0,
      duration: 0.8,
      ease: 'power2.out',
    }, '-=0.5')

    tlRef.current = tl
  }

  useLayoutEffect(() => {
    runAnimation()

    return () => {
      if (tlRef.current) {
        tlRef.current.kill()
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Generate particle initial positions (spread around center)
  const particleCount = 40
  const particleData = Array.from({ length: particleCount }, (_, i) => {
    const angle = (i / particleCount) * Math.PI * 2 + Math.random() * 0.5
    const radius = 120 + Math.random() * 280
    const x = Math.cos(angle) * radius
    const y = Math.sin(angle) * radius
    const size = 2 + Math.random() * 4
    const hue = 220 + Math.random() * 60 // Blue-purple spectrum
    return { x, y, size, hue, delay: Math.random() * 0.3 }
  })

  return (
    <div ref={rootRef} style={{ position: 'relative', width: '100%', minHeight: '100vh', overflow: 'hidden' }}>
      {/* ── Splash Layer ── */}
      <div
        ref={splashRef}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 100,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'radial-gradient(ellipse at center, #0a0e27 0%, #020412 70%, #000 100%)',
          overflow: 'hidden',
        }}
      >
        {/* Background subtle grid */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `
            linear-gradient(rgba(99,102,241,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(99,102,241,0.03) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
          opacity: 0.5,
        }} />

        {/* Particles container */}
        <div ref={particlesRef} style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: 0,
          height: 0,
        }}>
          {particleData.map((p, i) => (
            <div
              key={i}
              className="particle"
              style={{
                position: 'absolute',
                width: p.size,
                height: p.size,
                borderRadius: '50%',
                background: `hsl(${p.hue}, 80%, 70%)`,
                boxShadow: `0 0 ${p.size * 3}px hsl(${p.hue}, 80%, 60%)`,
                transform: `translate(${p.x}px, ${p.y}px)`,
                willChange: 'transform, opacity',
              }}
            />
          ))}
        </div>

        {/* Glow */}
        <div ref={glowRef} style={{
          position: 'absolute',
          width: 320,
          height: 320,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(99,102,241,0.4) 0%, rgba(139,92,246,0.15) 50%, transparent 70%)',
          filter: 'blur(40px)',
          willChange: 'transform, opacity',
        }} />

        {/* Ring pulse 1 */}
        <div ref={ringRef} style={{
          position: 'absolute',
          width: 200,
          height: 200,
          borderRadius: '50%',
          border: '1.5px solid rgba(139,92,246,0.5)',
          willChange: 'transform, opacity',
        }} />

        {/* Ring pulse 2 */}
        <div ref={ring2Ref} style={{
          position: 'absolute',
          width: 160,
          height: 160,
          borderRadius: '50%',
          border: '1px solid rgba(99,102,241,0.4)',
          willChange: 'transform, opacity',
        }} />

        {/* Logo */}
        <div ref={logoRef} style={{
          position: 'relative',
          zIndex: 2,
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          perspective: '800px',
        }}>
          <div className="splash-letter" style={{ display: 'inline-block', willChange: 'transform, opacity', filter: 'drop-shadow(0 0 30px rgba(99,102,241,0.3))' }}>
            <GenieG variant="white" height={90} />
          </div>
          <div className="splash-letter" style={{ display: 'inline-block', willChange: 'transform, opacity', filter: 'drop-shadow(0 0 30px rgba(99,102,241,0.3))' }}>
            <GenieE1 variant="white" height={90} />
          </div>
          <div className="splash-letter" style={{ display: 'inline-block', willChange: 'transform, opacity', filter: 'drop-shadow(0 0 30px rgba(99,102,241,0.3))' }}>
            <GenieN variant="white" height={90} />
          </div>
          <div className="splash-letter" style={{ display: 'inline-block', willChange: 'transform, opacity', filter: 'drop-shadow(0 0 30px rgba(99,102,241,0.3))' }}>
            <GenieI variant="white" height={90} />
          </div>
          <div className="splash-letter" style={{ display: 'inline-block', willChange: 'transform, opacity', filter: 'drop-shadow(0 0 30px rgba(99,102,241,0.3))' }}>
            <GenieE2 variant="white" height={90} />
          </div>
        </div>

        {/* Tagline */}
        <div ref={taglineRef} style={{
          position: 'relative',
          zIndex: 2,
          marginTop: 24,
          fontSize: 'clamp(0.85rem, 2vw, 1.1rem)',
          fontWeight: 400,
          letterSpacing: '0.35em',
          color: 'rgba(165,180,252,0.7)',
          fontFamily: "'Inter', -apple-system, sans-serif",
          textTransform: 'uppercase',
        }}>
          Your Intelligent Companion
        </div>

        {/* Bottom ambient light */}
        <div style={{
          position: 'absolute',
          bottom: -80,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '80%',
          height: 160,
          background: 'radial-gradient(ellipse at center, rgba(99,102,241,0.08) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }} />
      </div>

      {/* ── Content Layer (behind splash) ── */}
      <div ref={contentRef} style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(180deg, #0f0f23 0%, #1a1a3e 50%, #0f0f23 100%)',
        padding: '60px 24px',
        gap: 40,
      }}>
        <SplashNav theme="dark" onReplay={runAnimation} />

        {/* Hero content after splash */}
        <div style={{
          maxWidth: 720,
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 24,
        }}>
          <div style={{
            fontSize: 'clamp(3rem, 8vw, 5rem)',
            fontWeight: 800,
            fontFamily: "'Inter', -apple-system, sans-serif",
            background: 'linear-gradient(135deg, #e0e7ff 0%, #818cf8 50%, #6366f1 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            lineHeight: 1.1,
          }}>
            Genie
          </div>

          <p style={{
            fontSize: 'clamp(1rem, 2.5vw, 1.25rem)',
            color: 'rgba(165,180,252,0.6)',
            lineHeight: 1.7,
            maxWidth: 540,
          }}>
            这是品牌 Logo 入场动画的 demo 效果。灵感来自爱奇艺、Netflix、Apple TV+ 等视频应用的开屏 Splash，
            使用 GSAP Timeline 编排粒子汇聚、字母 stagger 入场、光晕脉冲和页面过渡。
          </p>

          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 10,
            justifyContent: 'center',
            marginTop: 8,
          }}>
            {['GSAP Timeline', 'Stagger', 'Particle FX', 'Glow Pulse', 'Page Transition'].map((tag) => (
              <span
                key={tag}
                style={{
                  padding: '6px 14px',
                  borderRadius: 20,
                  border: '1px solid rgba(99,102,241,0.25)',
                  background: 'rgba(99,102,241,0.08)',
                  color: 'rgba(165,180,252,0.7)',
                  fontSize: 12,
                  fontWeight: 500,
                  letterSpacing: '0.04em',
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Animation breakdown cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 16,
          maxWidth: 800,
          width: '100%',
          marginTop: 16,
        }}>
          {[
            { phase: '01', title: '粒子汇聚', desc: '40 个粒子从四周向中心收束，营造能量聚集感' },
            { phase: '02', title: '光晕爆发', desc: '粒子到达中心后，触发柔和的径向光晕' },
            { phase: '03', title: '字母登场', desc: '品牌名逐字 stagger 入场，带 3D 翻转和弹性' },
            { phase: '04', title: '脉冲扩散', desc: '同心圆环向外扩散，强化品牌高光时刻' },
            { phase: '05', title: 'Tagline 浮现', desc: '品牌标语以渐显动画出现在 logo 下方' },
            { phase: '06', title: '页面过渡', desc: 'Splash 整体上推退出，露出主内容区域' },
          ].map((item) => (
            <div
              key={item.phase}
              style={{
                padding: '20px 18px',
                borderRadius: 12,
                border: '1px solid rgba(99,102,241,0.15)',
                background: 'rgba(99,102,241,0.04)',
                backdropFilter: 'blur(8px)',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'rgba(99,102,241,0.35)'
                e.currentTarget.style.background = 'rgba(99,102,241,0.08)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(99,102,241,0.15)'
                e.currentTarget.style.background = 'rgba(99,102,241,0.04)'
              }}
            >
              <div style={{
                fontSize: 11,
                fontWeight: 600,
                color: '#818cf8',
                letterSpacing: '0.1em',
                marginBottom: 8,
              }}>
                PHASE {item.phase}
              </div>
              <div style={{
                fontSize: 15,
                fontWeight: 600,
                color: '#e0e7ff',
                marginBottom: 6,
              }}>
                {item.title}
              </div>
              <div style={{
                fontSize: 13,
                color: 'rgba(165,180,252,0.5)',
                lineHeight: 1.5,
              }}>
                {item.desc}
              </div>
            </div>
          ))}
        </div>

        {/* Replay hint */}
        {showReplay && (
          <div style={{
            marginTop: 20,
            fontSize: 13,
            color: 'rgba(165,180,252,0.4)',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
          }}>
            <RotateCcw size={13} />
            点击右上角「Replay Animation」可以重新播放
          </div>
        )}
      </div>
    </div>
  )
}
