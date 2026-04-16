import type { CSSProperties } from 'react'
import { useLayoutEffect, useRef } from 'react'
import { ArrowLeft, Layers3 } from 'lucide-react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import '../buffer-layers.css'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'

gsap.registerPlugin(ScrollTrigger)

type IrregularAlign = 'start' | 'center' | 'end'
type IrregularXAlign = 'left' | 'right'

type IrregularBufferLayer = {
  step: string
  label: string
  title: string
  description: string
  detailLines?: string[]
  footer: string
  accent: string
  background: string
  kind: 'numbers' | 'chinese' | 'english' | 'emoji' | 'thanks' | 'version'
  irregularHeight: string
  irregularWidth: string
  irregularAlign: IrregularAlign
  irregularXAlign: IrregularXAlign
}

const irregularBufferLayers: IrregularBufferLayer[] = [
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
    irregularHeight: '248%',
    irregularWidth: '100%',
    irregularAlign: 'end',
    irregularXAlign: 'right',
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
    irregularHeight: '58%',
    irregularWidth: '84%',
    irregularAlign: 'end',
    irregularXAlign: 'left',
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
    irregularHeight: '168%',
    irregularWidth: '94%',
    irregularAlign: 'center',
    irregularXAlign: 'right',
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
    irregularHeight: '46%',
    irregularWidth: '76%',
    irregularAlign: 'end',
    irregularXAlign: 'left',
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
    irregularHeight: '152%',
    irregularWidth: '88%',
    irregularAlign: 'start',
    irregularXAlign: 'right',
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
    irregularHeight: '54%',
    irregularWidth: '90%',
    irregularAlign: 'center',
    irregularXAlign: 'left',
  },
]

function renderLayerVisual(layer: IrregularBufferLayer) {
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

export default function IrregularBufferLayersPage() {
  const rootRef = useRef<HTMLDivElement>(null)
  const reducedMotion = usePrefersReducedMotion()

  useLayoutEffect(() => {
    const root = rootRef.current

    if (!root || reducedMotion) {
      return undefined
    }

    const ctx = gsap.context(() => {
      const irregularStage = root.querySelector<HTMLElement>('.buffer-irregular-stage')
      const irregularLayers = gsap.utils.toArray<HTMLElement>('.buffer-irregular-layer')
      const totalIrregularLayers = irregularLayers.length
      const irregularIntroHoldDuration = 0.36
      const irregularBottomHoldDuration = 0.66
      const irregularTransitionDuration = 1.08
      const irregularViewportHeight = Math.max(irregularStage?.clientHeight ?? window.innerHeight, 320)
      const irregularLayerMetrics = irregularLayers.map((layer) => {
        const sheet = layer.querySelector<HTMLElement>('.buffer-irregular-layer__sheet')
        const travel = sheet ? Math.max(sheet.offsetHeight - irregularViewportHeight, 0) : 0
        const travelDuration =
          travel > 0 ? 0.5 + Math.min(travel / irregularViewportHeight, 0.9) * 0.62 : 0.36

        return {
          sheet,
          travel,
          travelDuration,
        }
      })
      const irregularTotalDuration =
        irregularLayerMetrics.reduce(
          (sum, metric) =>
            sum + irregularIntroHoldDuration + metric.travelDuration + irregularBottomHoldDuration,
          0,
        ) +
        (totalIrregularLayers - 1) * irregularTransitionDuration

      irregularLayers.forEach((layer, index) => {
        const { sheet } = irregularLayerMetrics[index]

        gsap.set(layer, {
          yPercent: index === 0 ? 0 : 112,
          autoAlpha: index === 0 ? 1 : 0,
          zIndex: totalIrregularLayers - index,
        })

        if (sheet) {
          gsap.set(sheet, {
            y: index === 0 ? 0 : 72,
            opacity: 1,
            scale: 1,
            rotate: 0,
          })
        }
      })

      const irregularTimeline = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: '.buffer-irregular-section',
          start: 'top top',
          end: () => `+=${window.innerHeight * irregularTotalDuration}`,
          pin: '.buffer-irregular-shell',
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      })

      irregularLayers.forEach((layer, index) => {
        const { sheet: currentSheet, travel, travelDuration } = irregularLayerMetrics[index]

        irregularTimeline.to({}, { duration: irregularIntroHoldDuration })

        if (currentSheet) {
          irregularTimeline.to(
            currentSheet,
            {
              y: -travel,
              duration: travelDuration,
              ease: 'none',
            },
            '>',
          )
        } else {
          irregularTimeline.to({}, { duration: travelDuration }, '>')
        }

        irregularTimeline.to(
          {},
          {
            duration: index === 0 ? irregularBottomHoldDuration + 0.28 : irregularBottomHoldDuration,
          },
        )

        if (index === totalIrregularLayers - 1) {
          return
        }

        const nextLayer = irregularLayers[index + 1]
        const nextSheet = irregularLayerMetrics[index + 1]?.sheet

        irregularTimeline.set(nextLayer, {
          zIndex: totalIrregularLayers + index + 1,
          autoAlpha: 1,
        })

        irregularTimeline.to(
          layer,
          {
            autoAlpha: 0,
            duration: irregularTransitionDuration,
          },
          '>',
        )

        if (currentSheet) {
          irregularTimeline.to(
            currentSheet,
            {
              y: -(travel + 28),
              opacity: 0.2,
              duration: irregularTransitionDuration,
            },
            '<',
          )
        }

        irregularTimeline.fromTo(
          nextLayer,
          {
            yPercent: 112,
            autoAlpha: 1,
          },
          {
            yPercent: 0,
            autoAlpha: 1,
            duration: irregularTransitionDuration,
            ease: 'power3.out',
          },
          '<',
        )

        if (nextSheet) {
          irregularTimeline.fromTo(
            nextSheet,
            {
              y: 84,
              opacity: 1,
              scale: 1,
              rotate: 0,
            },
            {
              y: 0,
              opacity: 1,
              scale: 1,
              rotate: 0,
              duration: irregularTransitionDuration * 0.9,
              ease: 'power2.out',
            },
            '<0.06',
          )
        }
      })

      ScrollTrigger.refresh()
    }, root)

    return () => {
      ctx.revert()
    }
  }, [reducedMotion])

  return (
    <div
      className={`buffer-page buffer-page--irregular-only ${reducedMotion ? 'buffer-page--reduced' : ''}`.trim()}
      ref={rootRef}
    >
      <header className="buffer-topbar">
        <a className="buffer-topbar__link" href="/">
          <ArrowLeft size={18} />
          返回主 demo
        </a>
        <a className="buffer-topbar__link" href="/buffer-layers">
          <Layers3 size={18} />
          查看三种对照页
        </a>
      </header>

      <main>
        <section className="buffer-irregular-section" id="irregular-stage">
          <div className="buffer-irregular-shell">
            <div className="buffer-irregular-stage" aria-label="Six irregular height cover panels">
              {irregularBufferLayers.map((layer) => (
                <article
                  className="buffer-irregular-layer"
                  data-align={layer.irregularAlign}
                  data-xalign={layer.irregularXAlign}
                  key={layer.step}
                  style={{
                    '--buffer-accent': layer.accent,
                    '--buffer-bg': layer.background,
                    '--irregular-height': layer.irregularHeight,
                    '--irregular-width': layer.irregularWidth,
                  } as CSSProperties}
                >
                  <div className="buffer-irregular-layer__sheet">
                    <div className="buffer-irregular-layer__header">
                      <span>{layer.label}</span>
                      <span>{layer.step}</span>
                    </div>

                    <div className="buffer-irregular-layer__body">
                      <div className="buffer-irregular-layer__visual-wrap">{renderLayerVisual(layer)}</div>
                      <div className="buffer-irregular-layer__copy">
                        <h3>{layer.title}</h3>
                        <p>{layer.description}</p>
                        {layer.detailLines ? (
                          <ul className="buffer-irregular-layer__details">
                            {layer.detailLines.map((detail) => (
                              <li key={detail}>{detail}</li>
                            ))}
                          </ul>
                        ) : null}
                      </div>
                    </div>

                    <div className="buffer-irregular-layer__footer">{layer.footer}</div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
