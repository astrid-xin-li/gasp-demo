import type { CSSProperties } from 'react'
import { useLayoutEffect, useRef } from 'react'
import { ArrowLeft, ArrowDown, Layers3, PauseCircle } from 'lucide-react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import '../buffer-layers.css'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'

gsap.registerPlugin(ScrollTrigger)

type BufferLayer = {
  step: string
  label: string
  title: string
  description: string
  footer: string
  accent: string
  background: string
  kind: 'numbers' | 'chinese' | 'english' | 'emoji' | 'thanks' | 'version'
}

const bufferLayers: BufferLayer[] = [
  {
    step: '01',
    label: 'Numbers first',
    title: '08 · 21 · 144 · 2048',
    description:
      '先用数字建立节奏感：从离散的数据开始，让用户感受到“这一页正在进入下一层状态”。',
    footer: 'Buffer hold: 数字停住 1 个段落，再让下一层上来。',
    accent: '#6ea8ff',
    background:
      'linear-gradient(180deg, rgba(255,255,255,0.96), rgba(234,241,255,0.96))',
    kind: 'numbers',
  },
  {
    step: '02',
    label: 'Chinese layer',
    title: '先停顿一下，再让下一层缓缓盖上来。',
    description:
      '第二层用中文讲清楚规则：当前层不是立刻切走，而是先留出一个 buffer，让内容有被读到的时间。',
    footer: 'Buffer hold: 中文层停住后，再开始覆盖切换。',
    accent: '#7b61ff',
    background:
      'linear-gradient(180deg, rgba(247,243,255,0.98), rgba(236,229,255,0.98))',
    kind: 'chinese',
  },
  {
    step: '03',
    label: 'English layer',
    title: 'WAIT. HOLD. THEN COVER.',
    description:
      'English copy works well for a more editorial or portfolio-like moment. The layer stays still first, then the next sheet rises from the bottom.',
    footer: 'Buffer hold: pause before the next reveal feels intentional.',
    accent: '#2f59d9',
    background:
      'linear-gradient(180deg, rgba(236,244,255,0.98), rgba(221,236,255,0.98))',
    kind: 'english',
  },
  {
    step: '04',
    label: 'Emoji layer',
    title: '🙂 ✨ 🫧 🚀 🌈 💿',
    description:
      '这一层故意做得轻一点：emoji 不承担复杂信息，只负责把氛围和情绪拉起来，像是一个短暂的呼吸段落。',
    footer: 'Buffer hold: 情绪层也应该有停留，而不是一闪而过。',
    accent: '#ff8a65',
    background:
      'linear-gradient(180deg, rgba(255,246,241,0.98), rgba(255,234,225,0.98))',
    kind: 'emoji',
  },
  {
    step: '05',
    label: 'Thanks layer',
    title: '谢谢你一路滚到这里。',
    description:
      '第五层把语气收回来，用一段简短的致谢把前面的节奏沉淀一下，让最后一层版本信息出现前有一个情绪落点。',
    footer: 'Buffer hold: 致谢层像一个柔和的收束。',
    accent: '#3fd7b0',
    background:
      'linear-gradient(180deg, rgba(239,255,250,0.98), rgba(224,249,241,0.98))',
    kind: 'thanks',
  },
  {
    step: '06',
    label: 'Version layer',
    title: 'v0.6 — Buffer Cover Scroll',
    description:
      '最后一层放版本号和说明，像一个正式的收尾页：告诉人这不是普通切屏，而是一种“停顿后再覆盖”的滚动叙事节奏。',
    footer: 'Final layer: 停在这里，完成整段滚动体验。',
    accent: '#111827',
    background:
      'linear-gradient(180deg, rgba(245,247,250,0.98), rgba(227,232,240,0.98))',
    kind: 'version',
  },
]

function renderLayerVisual(layer: BufferLayer) {
  switch (layer.kind) {
    case 'numbers':
      return (
        <div className="buffer-layer__visual buffer-layer__visual--numbers" aria-hidden="true">
          <span>08</span>
          <span>21</span>
          <span>144</span>
          <span>2048</span>
        </div>
      )
    case 'chinese':
      return (
        <div className="buffer-layer__visual buffer-layer__visual--copy" aria-hidden="true">
          <strong>先停顿</strong>
          <strong>再覆盖</strong>
          <strong>最后上提</strong>
        </div>
      )
    case 'english':
      return (
        <div className="buffer-layer__visual buffer-layer__visual--copy" aria-hidden="true">
          <strong>HOLD</strong>
          <strong>COVER</strong>
          <strong>REVEAL</strong>
        </div>
      )
    case 'emoji':
      return (
        <div className="buffer-layer__visual buffer-layer__visual--emoji" aria-hidden="true">
          <span>🙂</span>
          <span>✨</span>
          <span>🫧</span>
          <span>🚀</span>
          <span>🌈</span>
          <span>💿</span>
        </div>
      )
    case 'thanks':
      return (
        <div className="buffer-layer__visual buffer-layer__visual--thanks" aria-hidden="true">
          <span>THANK YOU</span>
          <small>for scrolling with patience</small>
        </div>
      )
    case 'version':
      return (
        <div className="buffer-layer__visual buffer-layer__visual--version" aria-hidden="true">
          <span>release</span>
          <strong>0.6</strong>
          <small>buffer / cover / scroll</small>
        </div>
      )
  }
}

export default function BufferLayersPage() {
  const rootRef = useRef<HTMLDivElement>(null)
  const reducedMotion = usePrefersReducedMotion()

  useLayoutEffect(() => {
    const root = rootRef.current

    if (!root || reducedMotion) {
      return undefined
    }

    const ctx = gsap.context(() => {
      const layers = gsap.utils.toArray<HTMLElement>('.buffer-layer')
      const totalLayers = layers.length
      const holdDuration = 0.8
      const transitionDuration = 1

      layers.forEach((layer, index) => {
        const inner = layer.querySelector<HTMLElement>('.buffer-layer__inner')

        gsap.set(layer, {
          yPercent: index === 0 ? 0 : 100,
          zIndex: totalLayers - index,
          opacity: 1,
        })

        if (inner) {
          gsap.set(inner, {
            y: index === 0 ? 0 : 36,
            opacity: index === 0 ? 1 : 0.35,
          })
        }
      })

      const timeline = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: '.buffer-stack-section',
          start: 'top top',
          end: () =>
            `+=${window.innerHeight * (totalLayers * holdDuration + (totalLayers - 1) * transitionDuration)}`,
          pin: '.buffer-stack-shell',
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      })

      layers.forEach((layer, index) => {
        timeline.to({}, { duration: holdDuration })

        if (index === totalLayers - 1) {
          return
        }

        const nextLayer = layers[index + 1]
        const currentInner = layer.querySelector<HTMLElement>('.buffer-layer__inner')
        const nextInner = nextLayer.querySelector<HTMLElement>('.buffer-layer__inner')

        timeline
          .set(nextLayer, { zIndex: totalLayers + index + 1 })
          .to(
            layer,
            {
              yPercent: -100,
              duration: transitionDuration,
            },
            '>'
          )
          .fromTo(
            nextLayer,
            {
              yPercent: 100,
            },
            {
              yPercent: 0,
              duration: transitionDuration,
            },
            '<'
          )

        if (currentInner) {
          timeline.to(
            currentInner,
            {
              y: -28,
              opacity: 0.14,
              duration: transitionDuration * 0.72,
            },
            '<'
          )
        }

        if (nextInner) {
          timeline.fromTo(
            nextInner,
            {
              y: 42,
              opacity: 0.28,
            },
            {
              y: 0,
              opacity: 1,
              duration: transitionDuration * 0.78,
              ease: 'power2.out',
            },
            '<0.12'
          )
        }
      })

      gsap.from('.buffer-hero > *', {
        opacity: 0,
        y: 30,
        duration: 0.9,
        ease: 'power3.out',
        stagger: 0.08,
      })

      gsap.from('.buffer-stack-copy > *', {
        opacity: 0,
        y: 26,
        duration: 0.75,
        ease: 'power3.out',
        stagger: 0.08,
        scrollTrigger: {
          trigger: '.buffer-stack-section',
          start: 'top 76%',
        },
      })

      ScrollTrigger.refresh()
    }, root)

    return () => {
      ctx.revert()
    }
  }, [reducedMotion])

  return (
    <div
      className={`buffer-page ${reducedMotion ? 'buffer-page--reduced' : ''}`.trim()}
      ref={rootRef}
    >
      <header className="buffer-topbar">
        <a className="buffer-topbar__link" href="/">
          <ArrowLeft size={18} />
          返回主 demo
        </a>
        <a className="buffer-topbar__link" href="#buffer-stage">
          <ArrowDown size={18} />
          跳到 6 层滚动
        </a>
      </header>

      <main>
        <section className="buffer-hero">
          <span className="buffer-eyebrow">Sub page / Buffered stacked scroll</span>
          <h1>6 层内容，一层层停住，再覆盖上来。</h1>
          <p>
            这个子页面专门实现你要的节奏：每层先完整展示，接着进入一段页面几乎不动的
            buffer 区域，然后下一层才会从底部覆盖上来。你可以把它理解成“停顿感更强的分层 pin
            滚动”。
          </p>
        </section>

        <section className="buffer-stack-section" id="buffer-stage">
          <div className="buffer-stack-shell">
            <aside className="buffer-stack-copy">
              <span className="buffer-eyebrow">Demo 05 / Layer buffer</span>
              <h2>先停顿，再切层。</h2>
              <p>
                左边这块说明固定，右边是 6 层舞台。每一层都会经历两个阶段：
                <strong>先 hold</strong>，再 <strong>cover</strong>。这样滚动不会太急，内容也更容易被读完。
              </p>

              <div className="buffer-pill-row">
                <span className="buffer-pill">
                  <PauseCircle size={16} />
                  Buffer hold
                </span>
                <span className="buffer-pill">
                  <Layers3 size={16} />
                  6 overlay layers
                </span>
              </div>

              <ol className="buffer-outline">
                <li>数字</li>
                <li>中文</li>
                <li>英文</li>
                <li>Emoji</li>
                <li>致谢</li>
                <li>版本</li>
              </ol>
            </aside>

            <div className="buffer-stack-stage" aria-label="Six layered buffered scroll panels">
              {bufferLayers.map((layer) => (
                <article
                  className="buffer-layer"
                  key={layer.step}
                  style={{
                    '--buffer-accent': layer.accent,
                    '--buffer-bg': layer.background,
                  } as CSSProperties}
                >
                  <div className="buffer-layer__inner">
                    <div className="buffer-layer__meta">
                      <span>{layer.label}</span>
                      <span>{layer.step}</span>
                    </div>

                    <div className="buffer-layer__content">
                      {renderLayerVisual(layer)}
                      <h3>{layer.title}</h3>
                      <p>{layer.description}</p>
                    </div>

                    <div className="buffer-layer__footer">{layer.footer}</div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="buffer-outro">
          <span className="buffer-eyebrow">Usage note</span>
          <h2>这个结构很适合做分章节叙事、品牌官网或作品集过场。</h2>
          <p>
            如果你想，我下一步可以继续把这个子页升级成：每一层里再带自己的小动画，或者做成你可以直接替换文案和配色的数据驱动模板。
          </p>
        </section>
      </main>
    </div>
  )
}
