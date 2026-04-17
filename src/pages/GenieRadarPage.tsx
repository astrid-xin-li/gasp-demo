import { useLayoutEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { RotateCcw } from 'lucide-react'
import { SplashNav } from './components/SplashNav'

/**
 * Genie Radar Splash — 雷达扫描风格
 *
 * 灵感：科幻 HUD / 军事雷达 / AI 搜索
 * 编排：雷达扫描转圈 → 目标锁定十字准星 → 品牌名被"扫描发现" → 数据叠加层消散
 */
export default function GenieRadarPage() {
  const rootRef = useRef<HTMLDivElement>(null)
  const splashRef = useRef<HTMLDivElement>(null)
  const radarRef = useRef<HTMLDivElement>(null)
  const sweepRef = useRef<HTMLDivElement>(null)
  const crosshairRef = useRef<HTMLDivElement>(null)
  const logoRef = useRef<HTMLDivElement>(null)
  const dataRef = useRef<HTMLDivElement>(null)
  const subtitleRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const tlRef = useRef<gsap.core.Timeline | null>(null)
  const [showReplay, setShowReplay] = useState(false)

  const runAnimation = () => {
    if (tlRef.current) tlRef.current.kill()
    setShowReplay(false)
    const splash = splashRef.current, radar = radarRef.current, sweep = sweepRef.current
    const crosshair = crosshairRef.current, logo = logoRef.current
    const data = dataRef.current, subtitle = subtitleRef.current, content = contentRef.current
    if (!splash || !radar || !sweep || !crosshair || !logo || !data || !subtitle || !content) return

    gsap.set(splash, { autoAlpha: 1 })
    gsap.set(radar, { autoAlpha: 0, scale: 0.8 })
    gsap.set(sweep, { rotation: 0 })
    gsap.set(crosshair, { autoAlpha: 0, scale: 2 })
    gsap.set(logo, { autoAlpha: 0, scale: 0.8, filter: 'blur(10px)' })
    gsap.set(data, { autoAlpha: 0 })
    gsap.set(subtitle, { autoAlpha: 0, y: 12 })
    gsap.set(content, { autoAlpha: 0, y: 40 })

    const tl = gsap.timeline({ defaults: { ease: 'power2.out' }, onComplete: () => setShowReplay(true) })

    // Phase 1: Radar appears
    tl.to(radar, { autoAlpha: 1, scale: 1, duration: 0.6 })

    // Phase 2: Sweep rotates 2 full turns
      .to(sweep, { rotation: 720, duration: 2.4, ease: 'power1.inOut' })

    // Phase 3: Data overlay appears during scan
      .to(data, { autoAlpha: 1, duration: 0.3 }, '-=1.5')

    // Phase 4: Target locked — crosshair zooms in
      .to(crosshair, { autoAlpha: 1, scale: 1, duration: 0.4, ease: 'back.out(2)' }, '-=0.3')

    // Phase 5: Logo "discovered" — deblur + fade in
      .to(logo, { autoAlpha: 1, scale: 1, filter: 'blur(0px)', duration: 0.7 }, '-=0.1')

    // Phase 6: Radar elements fade
      .to([radar, crosshair, data], { autoAlpha: 0, duration: 0.5 }, '+=0.3')

    // Phase 7: Subtitle
      .to(subtitle, { autoAlpha: 1, y: 0, duration: 0.4 }, '-=0.2')

    // Hold + exit
      .to({}, { duration: 0.5 })
      .to(splash, { autoAlpha: 0, duration: 0.6 })
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
        background: '#020a0a', overflow: 'hidden',
      }}>
        {/* Grid background */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'linear-gradient(rgba(0,255,136,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,136,0.03) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }} />

        {/* Radar */}
        <div ref={radarRef} style={{
          position: 'absolute', width: 340, height: 340, borderRadius: '50%',
          border: '1px solid rgba(0,255,136,0.2)',
        }}>
          {/* Inner rings */}
          <div style={{ position: 'absolute', inset: 40, borderRadius: '50%', border: '1px solid rgba(0,255,136,0.12)' }} />
          <div style={{ position: 'absolute', inset: 80, borderRadius: '50%', border: '1px solid rgba(0,255,136,0.08)' }} />
          <div style={{ position: 'absolute', inset: 120, borderRadius: '50%', border: '1px solid rgba(0,255,136,0.05)' }} />
          {/* Cross lines */}
          <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: 1, background: 'rgba(0,255,136,0.08)' }} />
          <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: 1, background: 'rgba(0,255,136,0.08)' }} />
          {/* Sweep */}
          <div ref={sweepRef} style={{
            position: 'absolute', inset: 0, borderRadius: '50%',
            background: 'conic-gradient(from 0deg, transparent 0deg, rgba(0,255,136,0.15) 30deg, transparent 60deg)',
            transformOrigin: 'center center',
          }} />
        </div>

        {/* Crosshair */}
        <div ref={crosshairRef} style={{
          position: 'absolute', width: 80, height: 80, zIndex: 3,
        }}>
          <div style={{ position: 'absolute', top: 0, left: '50%', width: 1, height: 20, background: '#0f8', transform: 'translateX(-50%)' }} />
          <div style={{ position: 'absolute', bottom: 0, left: '50%', width: 1, height: 20, background: '#0f8', transform: 'translateX(-50%)' }} />
          <div style={{ position: 'absolute', left: 0, top: '50%', width: 20, height: 1, background: '#0f8', transform: 'translateY(-50%)' }} />
          <div style={{ position: 'absolute', right: 0, top: '50%', width: 20, height: 1, background: '#0f8', transform: 'translateY(-50%)' }} />
          <div style={{ position: 'absolute', inset: 15, border: '1px solid rgba(0,255,136,0.4)', borderRadius: 4 }} />
        </div>

        {/* Data overlay */}
        <div ref={dataRef} style={{
          position: 'absolute', top: '15%', right: '10%', zIndex: 2,
          fontFamily: "'SF Mono', monospace", fontSize: 11, color: 'rgba(0,255,136,0.4)', lineHeight: 1.8,
        }}>
          <div>SCAN: ACTIVE</div>
          <div>LAT: 39.9042° N</div>
          <div>LNG: 116.4074° E</div>
          <div>TARGET: DETECTED</div>
        </div>

        {/* Logo */}
        <div ref={logoRef} style={{
          position: 'relative', zIndex: 4,
          fontSize: 'clamp(4rem, 12vw, 7rem)', fontWeight: 800,
          fontFamily: "'Inter', sans-serif", letterSpacing: '-0.02em',
          color: '#0f8',
          textShadow: '0 0 40px rgba(0,255,136,0.3), 0 0 80px rgba(0,255,136,0.1)',
        }}>Genie</div>

        <div ref={subtitleRef} style={{
          position: 'relative', zIndex: 4, marginTop: 20,
          fontSize: 'clamp(0.75rem, 1.5vw, 0.9rem)', letterSpacing: '0.4em',
          color: 'rgba(0,255,136,0.35)', textTransform: 'uppercase',
          fontFamily: "'SF Mono', monospace",
        }}>Target Acquired</div>
      </div>

      <div ref={contentRef} style={{
        minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        background: 'linear-gradient(180deg, #020a0a, #0a1a1a 50%, #020a0a)', padding: '60px 24px', gap: 40,
      }}>
        <SplashNav theme="cyan" onReplay={runAnimation} />
        <div style={{ maxWidth: 720, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 }}>
          <div style={{ fontSize: 'clamp(3rem, 8vw, 5rem)', fontWeight: 800, color: '#0f8', textShadow: '0 0 30px rgba(0,255,136,0.2)' }}>
            Radar Splash
          </div>
          <p style={{ fontSize: 'clamp(1rem, 2.5vw, 1.2rem)', color: 'rgba(0,255,136,0.35)', lineHeight: 1.7, maxWidth: 540 }}>
            雷达扫描风格入场。同心圆雷达盘面出现后扫描线连续旋转两圈，数据面板叠加显示，
            扫到目标后十字准星锁定，品牌名从模糊到清晰被"发现"。
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center' }}>
            {['Radar Sweep', 'Crosshair', 'Sci-fi HUD', 'Scan Effect', 'Matrix Green'].map(tag => (
              <span key={tag} style={{ padding: '6px 14px', borderRadius: 20, border: '1px solid rgba(0,255,136,0.2)', background: 'rgba(0,255,136,0.05)', color: 'rgba(0,255,136,0.5)', fontSize: 12, fontWeight: 500 }}>{tag}</span>
            ))}
          </div>
        </div>
        {showReplay && (
          <div style={{ marginTop: 20, fontSize: 13, color: 'rgba(0,255,136,0.25)', display: 'flex', alignItems: 'center', gap: 6 }}>
            <RotateCcw size={13} /> 点击右上角重新播放
          </div>
        )}
      </div>
    </div>
  )
}
