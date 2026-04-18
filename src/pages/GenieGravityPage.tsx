import { useLayoutEffect, useRef, useState, useCallback } from 'react'
import { gsap } from 'gsap'
import { RotateCcw } from 'lucide-react'
import { SplashNav } from './components/SplashNav'
import { GenieG, GenieE1, GenieN, GenieI, GenieE2 } from './components/GenieLogo'
import { ThemeToggle } from './components/ThemeToggle'
import { getInitialDark, persistTheme } from './utils/theme-cookie'

/**
 * Genie Gravity Splash — 重力掉落 / 弹跳物理风格
 *
 * 灵感：Google Doodle / Dropbox / 趣味品牌
 * 编排：字母从顶部自由落体 → 落地弹跳（多次回弹）→ 装饰元素弹出 + 持续动画
 *       → 副标题多文案切换 → 退出进入页面
 * 支持亮色/暗色模式切换，主题偏好持久化到 cookie
 */

// --- Theme color tokens ---
const themeTokens = {
  light: {
    splashBg: '#fefefe',
    dotColor: '#000',
    dotOpacity: 0.04,
    floorGrad: 'linear-gradient(90deg, transparent, #333, transparent)',
    subtitleColor: 'rgba(0,0,0,0.3)',
    contentBg: '#fefefe',
    titleColor: '#0a0a0a',
    descColor: 'rgba(0,0,0,0.4)',
    tagBorder: 'rgba(0,0,0,0.08)',
    tagBg: 'rgba(0,0,0,0.02)',
    tagColor: 'rgba(0,0,0,0.45)',
    replayColor: 'rgba(0,0,0,0.25)',
    logoVariant: 'black' as const,
    navTheme: 'light' as const,
  },
  dark: {
    splashBg: '#0f0f17',
    dotColor: '#fff',
    dotOpacity: 0.04,
    floorGrad: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)',
    subtitleColor: 'rgba(255,255,255,0.35)',
    contentBg: '#0f0f17',
    titleColor: '#f0f0f0',
    descColor: 'rgba(255,255,255,0.45)',
    tagBorder: 'rgba(255,255,255,0.12)',
    tagBg: 'rgba(255,255,255,0.06)',
    tagColor: 'rgba(255,255,255,0.5)',
    replayColor: 'rgba(255,255,255,0.3)',
    logoVariant: 'white' as const,
    navTheme: 'dark' as const,
  },
}

const SUBTITLES = [
  'Fun Starts Here',
  'Think Different',
  'Create Without Limits',
  'Built for Dreamers',
]

/**
 * 入场动画总时长（秒）— 从 splash 开始到退场的最小持续时间。
 * 副标题会循环播放填满这段时间。如果设为 0 则由内容自然决定（播完即退）。
 * 例：设为 12 表示 splash 至少展示 12 秒。
 */
const SPLASH_DURATION = 0

// Decorative shape definitions — more shapes, richer layout
const DECO_SHAPES: {
  type: 'circle' | 'diamond' | 'triangle' | 'ring' | 'cross' | 'semicircle' | 'hexagon' | 'square'
  color: string
  size: number
  top?: string; bottom?: string; left?: string; right?: string
}[] = [
  { type: 'circle', color: '#feca57', size: 16, top: '18%', left: '14%' },
  { type: 'diamond', color: '#48dbfb', size: 14, top: '22%', right: '16%' },
  { type: 'triangle', color: '#ff6b6b', size: 14, bottom: '28%', left: '24%' },
  { type: 'ring', color: '#54a0ff', size: 18, top: '35%', left: '8%' },
  { type: 'cross', color: '#ff9ff3', size: 14, top: '15%', right: '32%' },
  { type: 'semicircle', color: '#1DDB8B', size: 16, bottom: '22%', right: '12%' },
  { type: 'hexagon', color: '#feca57', size: 12, bottom: '35%', right: '28%' },
  { type: 'square', color: '#ff6b6b', size: 10, top: '40%', right: '8%' },
  { type: 'circle', color: '#48dbfb', size: 10, bottom: '18%', left: '12%' },
  { type: 'diamond', color: '#ff9ff3', size: 10, top: '12%', left: '38%' },
  { type: 'triangle', color: '#54a0ff', size: 10, bottom: '15%', right: '38%' },
  { type: 'ring', color: '#feca57', size: 12, top: '45%', left: '30%' },
]

function DecoShape({ type, color, size }: { type: string; color: string; size: number }) {
  switch (type) {
    case 'circle':
      return <div style={{ width: size, height: size, borderRadius: '50%', background: color }} />
    case 'diamond':
      return <div style={{ width: size, height: size, borderRadius: 2, background: color, transform: 'rotate(45deg)' }} />
    case 'triangle':
      return (
        <div style={{
          width: 0, height: 0,
          borderLeft: `${size * 0.57}px solid transparent`,
          borderRight: `${size * 0.57}px solid transparent`,
          borderBottom: `${size}px solid ${color}`,
        }} />
      )
    case 'ring':
      return <div style={{ width: size, height: size, borderRadius: '50%', border: `2.5px solid ${color}`, background: 'transparent' }} />
    case 'cross':
      return (
        <div style={{ position: 'relative', width: size, height: size }}>
          <div style={{ position: 'absolute', top: '50%', left: 0, width: '100%', height: 2.5, background: color, borderRadius: 1, transform: 'translateY(-50%)' }} />
          <div style={{ position: 'absolute', left: '50%', top: 0, width: 2.5, height: '100%', background: color, borderRadius: 1, transform: 'translateX(-50%)' }} />
        </div>
      )
    case 'semicircle':
      return <div style={{ width: size, height: size / 2, borderRadius: `${size}px ${size}px 0 0`, background: color }} />
    case 'hexagon':
      return (
        <svg width={size} height={size} viewBox="0 0 20 20">
          <polygon points="10,1 18.66,5.5 18.66,14.5 10,19 1.34,14.5 1.34,5.5" fill={color} />
        </svg>
      )
    case 'square':
      return <div style={{ width: size, height: size, borderRadius: 2, background: color }} />
    default:
      return null
  }
}

export default function GenieGravityPage() {
  const rootRef = useRef<HTMLDivElement>(null)
  const splashRef = useRef<HTMLDivElement>(null)
  const lettersRef = useRef<(HTMLDivElement | null)[]>([])
  const floorRef = useRef<HTMLDivElement>(null)
  const decoRefs = useRef<(HTMLDivElement | null)[]>([])
  const subtitleRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const tlRef = useRef<gsap.core.Timeline | null>(null)
  const floatTweensRef = useRef<gsap.core.Tween[]>([])

  const [isDark, setIsDark] = useState(getInitialDark)
  const t = isDark ? themeTokens.dark : themeTokens.light

  const toggleDark = useCallback(() => {
    setIsDark(prev => {
      const next = !prev
      persistTheme(next)
      return next
    })
  }, [])

  const startSingleFloating = (deco: HTMLDivElement, i: number) => {
    const duration = 2.5 + Math.random() * 2
    const yRange = 14 + Math.random() * 16
    const xRange = 10 + Math.random() * 12
    const rotRange = 25 + Math.random() * 35

    floatTweensRef.current.push(
      gsap.to(deco, {
        y: `+=${yRange}`,
        x: `+=${(i % 2 === 0 ? 1 : -1) * xRange}`,
        rotation: `+=${(i % 2 === 0 ? 1 : -1) * rotRange}`,
        duration,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
      })
    )

    // Pulse scale for some shapes
    if (i % 3 === 0) {
      floatTweensRef.current.push(
        gsap.to(deco, {
          scale: 1.5,
          duration: duration * 0.8,
          delay: 0.3,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
        })
      )
    }
  }

  const killFloatingTweens = () => {
    floatTweensRef.current.forEach(tw => tw.kill())
    floatTweensRef.current = []
  }
  const [showReplay, setShowReplay] = useState(false)

  const colors = ['#ff6b6b', '#feca57', '#48dbfb', '#ff9ff3', '#54a0ff']

  const runAnimation = () => {
    if (tlRef.current) tlRef.current.kill()
    killFloatingTweens()
    setShowReplay(false)

    const splash = splashRef.current, floor = floorRef.current
    const subtitle = subtitleRef.current, content = contentRef.current
    const els = lettersRef.current.filter(Boolean) as HTMLDivElement[]
    const decos = decoRefs.current.filter(Boolean) as HTMLDivElement[]
    if (!splash || !floor || !subtitle || !content || els.length !== 5) return

    gsap.set(splash, { autoAlpha: 1 })
    gsap.set(floor, { scaleX: 0, autoAlpha: 0 })
    gsap.set(decos, { scale: 0, autoAlpha: 0 })
    gsap.set(subtitle, { autoAlpha: 0, y: 10 })
    gsap.set(content, { autoAlpha: 0, y: 40 })
    els.forEach((el) => {
      gsap.set(el, { y: -600, autoAlpha: 0, rotation: 0, scale: 1 })
    })

    const tl = gsap.timeline({ defaults: { ease: 'none' }, onComplete: () => setShowReplay(true) })

    // Phase 1: Floor line draws in with a glow
    tl.to(floor, { scaleX: 1, autoAlpha: 1, duration: 0.35, ease: 'power3.out' })

    // Phase 2: Letters drop with stagger — enhanced gravity + triple bounce + squash-stretch
    els.forEach((el, i) => {
      const startTime = 0.3 + i * 0.14
      const rotDir = i % 2 === 0 ? 1 : -1

      tl
        // Drop with slight rotation
        .to(el, {
          y: 0, autoAlpha: 1, duration: 0.45, ease: 'power3.in',
          rotation: rotDir * 10,
        }, startTime)
        // Impact squash
        .to(el, {
          scaleY: 0.75, scaleX: 1.2, duration: 0.06, ease: 'power1.in',
        }, startTime + 0.45)
        // Stretch back + first bounce up
        .to(el, {
          scaleY: 1.15, scaleX: 0.9, y: -70, duration: 0.2, ease: 'power2.out',
        }, startTime + 0.51)
        // Second fall
        .to(el, {
          scaleY: 1, scaleX: 1, y: 0, duration: 0.18, ease: 'power2.in',
        }, startTime + 0.71)
        // Small squash
        .to(el, {
          scaleY: 0.88, scaleX: 1.1, duration: 0.04, ease: 'power1.in',
        }, startTime + 0.89)
        // Second bounce (smaller)
        .to(el, {
          scaleY: 1.05, scaleX: 0.96, y: -28, duration: 0.14, ease: 'power2.out',
        }, startTime + 0.93)
        .to(el, {
          scaleY: 1, scaleX: 1, y: 0, duration: 0.12, ease: 'power2.in',
        }, startTime + 1.07)
        // Third bounce (tiny wiggle)
        .to(el, {
          y: -8, duration: 0.08, ease: 'power2.out',
        }, startTime + 1.19)
        .to(el, {
          y: 0, duration: 0.08, ease: 'power2.in',
        }, startTime + 1.27)
        // Settle rotation with elastic
        .to(el, {
          rotation: 0, duration: 0.4, ease: 'elastic.out(1.2, 0.35)',
        }, startTime + 1.0)
    })

    // Phase 3: Decorative shapes pop out with stagger + each starts floating independently
    const decoStartTime = 0.3 + 5 * 0.14 + 1.2
    decos.forEach((deco, i) => {
      const delay = decoStartTime + i * 0.06
      const easeVariants = ['back.out(4)', 'back.out(3)', 'elastic.out(1,0.5)', 'back.out(2.5)']
      tl.to(deco, {
        scale: 1, autoAlpha: 1,
        duration: 0.4,
        ease: easeVariants[i % easeVariants.length],
        rotation: `+=${(i % 2 === 0 ? 1 : -1) * 15}`,
      }, delay)
      // Each shape starts floating right after it appears
      tl.call(() => {
        startSingleFloating(deco, i)
      }, [], delay + 0.35)
    })

    // Phase 4: Subtitle text cycling
    // If SPLASH_DURATION > 0, subtitles loop to fill the remaining time.
    // Otherwise, play once and exit.
    const subtitleStartTime = decoStartTime + decos.length * 0.06 + 0.2
    const SUBTITLE_INTERVAL = 1.2 // seconds per subtitle (fade-in + hold + fade-out)
    const onePassDuration = SUBTITLES.length * SUBTITLE_INTERVAL
    const naturalExitTime = subtitleStartTime + onePassDuration + 0.3

    // Determine the actual exit time
    const exitTime = SPLASH_DURATION > 0
      ? Math.max(SPLASH_DURATION, naturalExitTime)
      : naturalExitTime

    // Calculate how many subtitle slots we need to fill
    const availableTime = exitTime - 0.3 - subtitleStartTime
    const totalSlots = Math.max(SUBTITLES.length, Math.floor(availableTime / SUBTITLE_INTERVAL))

    for (let i = 0; i < totalSlots; i++) {
      const text = SUBTITLES[i % SUBTITLES.length]
      const isLast = i === totalSlots - 1
      const t = subtitleStartTime + i * SUBTITLE_INTERVAL

      // Fade in + slide up
      tl.call(() => {
        if (subtitle) subtitle.textContent = text
      }, [], t)
        .fromTo(subtitle,
          { autoAlpha: 0, y: 16, scale: 0.9 },
          { autoAlpha: 1, y: 0, scale: 1, duration: 0.4, ease: 'back.out(2)' },
          t,
        )

      // Fade out (unless it's the last one)
      if (!isLast) {
        tl.to(subtitle, {
          autoAlpha: 0, y: -12, scale: 0.94,
          duration: 0.3, ease: 'power2.in',
        }, t + 0.8)
      }
    }

    // Hold + exit
    tl.to({}, { duration: 0.1 }, exitTime)
      .to(splash, { autoAlpha: 0, y: -40, scale: 0.97, duration: 0.6, ease: 'power3.in' })
      .to(content, { autoAlpha: 1, y: 0, duration: 0.6, ease: 'power2.out' }, '-=0.35')

    tlRef.current = tl
  }

  useLayoutEffect(() => {
    runAnimation()
    return () => {
      if (tlRef.current) tlRef.current.kill()
      killFloatingTweens()
    }
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
        {/* Dot pattern */}
        <div style={{
          position: 'absolute', inset: 0, opacity: t.dotOpacity,
          backgroundImage: `radial-gradient(circle, ${t.dotColor} 1px, transparent 1px)`,
          backgroundSize: '20px 20px',
        }} />

        {/* Theme toggle button */}
        <ThemeToggle isDark={isDark} onToggle={toggleDark} />

        {/* Letters */}
        <div style={{ position: 'relative', zIndex: 2, display: 'flex', alignItems: 'flex-end', gap: 'clamp(4px, 1vw, 10px)' }}>
          {[GenieG, GenieE1, GenieN, GenieI, GenieE2].map((Letter, i) => (
            <div
              key={i}
              ref={el => { lettersRef.current[i] = el }}
              style={{
                willChange: 'transform, opacity',
                filter: `drop-shadow(0 4px 12px ${colors[i]}40)`,
              }}
            ><Letter variant={t.logoVariant} height={90} /></div>
          ))}
        </div>

        {/* Floor line */}
        <div ref={floorRef} style={{
          width: 'clamp(200px, 50vw, 480px)', height: 3, marginTop: 4,
          background: t.floorGrad,
          transformOrigin: 'center center', zIndex: 2,
        }} />

        {/* Decorative elements — 12 shapes */}
        {DECO_SHAPES.map((shape, i) => (
          <div
            key={i}
            ref={el => { decoRefs.current[i] = el }}
            style={{
              position: 'absolute',
              top: shape.top, bottom: shape.bottom,
              left: shape.left, right: shape.right,
              zIndex: 1, willChange: 'transform, opacity',
            }}
          >
            <DecoShape type={shape.type} color={shape.color} size={shape.size} />
          </div>
        ))}

        <div ref={subtitleRef} style={{
          marginTop: 24, fontSize: 'clamp(0.75rem, 1.5vw, 0.9rem)',
          letterSpacing: '0.3em', color: t.subtitleColor, textTransform: 'uppercase',
          fontWeight: 500, zIndex: 2, minHeight: '1.5em', textAlign: 'center',
          transition: 'color 0.3s ease',
        }}>Fun Starts Here</div>
      </div>

      <div ref={contentRef} style={{
        minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        background: t.contentBg, padding: '60px 24px', gap: 40,
        transition: 'background 0.4s ease',
      }}>
        <SplashNav theme={t.navTheme} onReplay={runAnimation} />
        <div style={{ maxWidth: 720, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 }}>
          <div style={{ fontSize: 'clamp(3rem, 8vw, 5rem)', fontWeight: 800, color: t.titleColor, transition: 'color 0.3s ease' }}>
            Gravity Splash
          </div>
          <p style={{ fontSize: 'clamp(1rem, 2.5vw, 1.2rem)', color: t.descColor, lineHeight: 1.7, maxWidth: 540, transition: 'color 0.3s ease' }}>
            重力掉落弹跳风格入场。彩色字母从屏幕顶部自由落体，落地后经过多次弹跳逐渐稳定，
            每个字母有轻微的旋转摇摆。装饰图形弹出增添趣味感，适合面向年轻用户的活泼品牌。
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center' }}>
            {['Gravity Drop', 'Bounce Physics', 'Colorful', 'Playful', 'Google-like'].map(tag => (
              <span key={tag} style={{
                padding: '6px 14px', borderRadius: 20,
                border: `1px solid ${t.tagBorder}`, background: t.tagBg,
                color: t.tagColor, fontSize: 12, fontWeight: 500,
                transition: 'all 0.3s ease',
              }}>{tag}</span>
            ))}
          </div>
        </div>
        {showReplay && (
          <div style={{ marginTop: 20, fontSize: 13, color: t.replayColor, display: 'flex', alignItems: 'center', gap: 6 }}>
            <RotateCcw size={13} /> 点击右上角重新播放
          </div>
        )}
      </div>
    </div>
  )
}
