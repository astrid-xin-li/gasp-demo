import type { CSSProperties } from 'react'
import { useLayoutEffect, useRef } from 'react'
import { ArrowLeft, ArrowDown, Layers3, PauseCircle } from 'lucide-react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import '../buffer-layers.css'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'

gsap.registerPlugin(ScrollTrigger)

type IrregularAlign = 'start' | 'center' | 'end'
type IrregularXAlign = 'left' | 'right'

type BufferLayer = {
  step: string
  label: string
  title: string
  description: string
  footer: string
  accent: string
  background: string
  kind: 'numbers' | 'chinese' | 'english' | 'emoji' | 'thanks' | 'version'
  irregularHeight: string
  irregularWidth: string
  irregularAlign: IrregularAlign
  irregularXAlign: IrregularXAlign
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
    irregularHeight: '72%',
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
    irregularHeight: '64%',
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
          yPercent: index === 0 ? 0 : 104,
          zIndex: totalLayers - index,
          opacity: 1,
        })

        if (inner) {
          gsap.set(inner, {
            y: index === 0 ? 0 : 42,
            opacity: 1,
            scale: index === 0 ? 1 : 0.98,
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

        timeline.set(nextLayer, { zIndex: totalLayers + index + 1 })

        if (currentInner) {
          timeline.to(
            currentInner,
            {
              y: -14,
              scale: 0.985,
              duration: transitionDuration,
            },
            '>'
          )
        }

        timeline.fromTo(
          nextLayer,
          {
            yPercent: 104,
          },
          {
            yPercent: 0,
            duration: transitionDuration,
            ease: 'power2.inOut',
          },
          '<'
        )

        if (nextInner) {
          timeline.fromTo(
            nextInner,
            {
              y: 46,
              scale: 0.98,
            },
            {
              y: 0,
              scale: 1,
              duration: transitionDuration * 0.82,
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

      gsap.from('.buffer-flow-copy > *', {
        opacity: 0,
        y: 26,
        duration: 0.75,
        ease: 'power3.out',
        stagger: 0.08,
        scrollTrigger: {
          trigger: '.buffer-flow-section',
          start: 'top 76%',
        },
      })

      const flowCards = gsap.utils.toArray<HTMLElement>('.flow-card')

      flowCards.forEach((card, index) => {
        const visual = card.querySelector<HTMLElement>('.flow-card__visual-wrap')
        const copy = card.querySelector<HTMLElement>('.flow-card__copy')

        gsap.fromTo(
          card,
          {
            y: 72,
            opacity: 0.24,
            scale: 0.97,
          },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 85%',
              end: 'top 35%',
              scrub: 1,
            },
          }
        )

        if (visual) {
          gsap.fromTo(
            visual,
            {
              y: 42,
              rotate: index % 2 === 0 ? -2 : 2,
            },
            {
              y: -12,
              rotate: 0,
              ease: 'none',
              scrollTrigger: {
                trigger: card,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 1,
              },
            }
          )
        }

        if (copy) {
          gsap.fromTo(
            copy,
            {
              y: 26,
              opacity: 0.42,
            },
            {
              y: 0,
              opacity: 1,
              duration: 0.82,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: card,
                start: 'top 72%',
              },
            }
          )
        }
      })

      gsap.from('.buffer-irregular-copy > *', {
        opacity: 0,
        y: 26,
        duration: 0.75,
        ease: 'power3.out',
        stagger: 0.08,
        scrollTrigger: {
          trigger: '.buffer-irregular-section',
          start: 'top 76%',
        },
      })

      const irregularStage = root.querySelector<HTMLElement>('.buffer-irregular-stage')
      const irregularLayers = gsap.utils.toArray<HTMLElement>('.buffer-irregular-layer')
      const totalIrregularLayers = irregularLayers.length
      const irregularIntroHoldDuration = 0.24
      const irregularBottomHoldDuration = 0.52
      const irregularTransitionDuration = 0.94
      const irregularStagePadding = 32
      const irregularViewportHeight = Math.max(
        (irregularStage?.clientHeight ?? window.innerHeight * 0.76) - irregularStagePadding,
        320
      )
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
          (sum, metric) => sum + irregularIntroHoldDuration + metric.travelDuration + irregularBottomHoldDuration,
          0
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
            y: index === 0 ? 0 : 56,
            opacity: index === 0 ? 1 : 0.82,
            scale: index === 0 ? 1 : 0.95,
            rotate: index === 0 ? 0 : index % 2 === 0 ? -1.8 : 1.8,
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
            '>'
          )
        } else {
          irregularTimeline.to({}, { duration: travelDuration }, '>')
        }

        irregularTimeline.to(
          {},
          {
            duration:
              index === 0 ? irregularBottomHoldDuration + 0.28 : irregularBottomHoldDuration,
          }
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
            autoAlpha: 0.08,
            duration: irregularTransitionDuration,
          },
          '>'
        )

        if (currentSheet) {
          irregularTimeline.to(
            currentSheet,
            {
              y: -(travel + 42),
              scale: 0.92,
              opacity: 0.08,
              rotate: index % 2 === 0 ? -2.8 : 2.8,
              duration: irregularTransitionDuration,
            },
            '<'
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
          '<'
        )

        if (nextSheet) {
          irregularTimeline.fromTo(
            nextSheet,
            {
              y: 88,
              scale: 0.92,
              opacity: 0.68,
              rotate: index % 2 === 0 ? 3.2 : -3.2,
            },
            {
              y: 0,
              scale: 1,
              opacity: 1,
              rotate: 0,
              duration: irregularTransitionDuration * 0.86,
              ease: 'power2.out',
            },
            '<0.04'
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
          跳到覆盖滚动
        </a>
        <a className="buffer-topbar__link" href="#flow-stage">
          <ArrowDown size={18} />
          跳到平铺滚动
        </a>
        <a className="buffer-topbar__link" href="#irregular-stage">
          <ArrowDown size={18} />
          跳到不规则高度
        </a>
        <a className="buffer-topbar__link" href="/buffer-layers-irregular">
          <Layers3 size={18} />
          只看不规则单页
        </a>
      </header>

      <main>
        <section className="buffer-hero">
          <span className="buffer-eyebrow">Sub page / Overlay + flow + irregular</span>
          <h1>6 层内容，三种滚动节奏。</h1>
          <p>
            这个子页面现在有三种版本：上半段是 <strong>覆盖式 buffer scroll</strong>，中间是
            <strong>平铺滚动版</strong>，下面新增了一套 <strong>不规则高度覆盖版</strong>。
            同样是数字、中文、英文、Emoji、致谢、版本六层内容，但视觉节奏会明显不同。
          </p>
        </section>

        <section className="buffer-stack-section" id="buffer-stage">
          <div className="buffer-stack-shell">
            <aside className="buffer-stack-copy">
              <span className="buffer-eyebrow">Demo A / Layer cover</span>
              <h2>先停顿，再覆盖。</h2>
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

        <section className="buffer-flow-section" id="flow-stage">
          <div className="buffer-flow-shell">
            <aside className="buffer-flow-copy">
              <span className="buffer-eyebrow">Demo B / Tiled flow</span>
              <h2>继续下滚，平铺展开。</h2>
              <p>
                这一版不再让下一层去覆盖上一层，而是把六张内容卡直接铺开在文档流里。
                每张卡保持独立阅读节奏，滚动时做轻微上浮、入场和视觉偏移，更适合作品集或内容流式排版。
              </p>

              <div className="buffer-pill-row">
                <span className="buffer-pill">
                  <ArrowDown size={16} />
                  Tiled narrative
                </span>
                <span className="buffer-pill">
                  <Layers3 size={16} />
                  Same 6 layers
                </span>
              </div>

              <ol className="buffer-outline">
                <li>更像连续阅读</li>
                <li>每张卡独立展示</li>
                <li>适合长页作品集</li>
              </ol>
            </aside>

            <div className="buffer-flow-list" aria-label="Six tiled scroll panels">
              {bufferLayers.map((layer, index) => (
                <article
                  className={`flow-card ${index % 2 === 1 ? 'flow-card--alt' : ''}`.trim()}
                  key={`${layer.step}-flow`}
                  style={{
                    '--buffer-accent': layer.accent,
                    '--buffer-bg': layer.background,
                  } as CSSProperties}
                >
                  <div className="flow-card__header">
                    <span>{layer.label}</span>
                    <span>{layer.step}</span>
                  </div>

                  <div className="flow-card__body">
                    <div className="flow-card__visual-wrap">{renderLayerVisual(layer)}</div>

                    <div className="flow-card__copy">
                      <span className="flow-card__eyebrow">Flat flow presentation</span>
                      <h3>{layer.title}</h3>
                      <p>{layer.description}</p>
                    </div>
                  </div>

                  <div className="flow-card__footer">
                    <span>{layer.footer}</span>
                    <span>Flow view / {layer.step}</span>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="buffer-irregular-section" id="irregular-stage">
          <div className="buffer-irregular-shell">
            <aside className="buffer-irregular-copy">
              <span className="buffer-eyebrow">Demo C / Irregular height cover</span>
              <h2>高度不一，也能覆盖。</h2>
              <p>
                这一版保留“先停顿、再覆盖”的节奏，但把六层内容做成了不同高度、不同宽度的片层。
                每一层都会先在当前舞台里向下读到内容底部，短暂停住，再由下一层从下方覆盖上来。
              </p>

              <div className="buffer-pill-row">
                <span className="buffer-pill">
                  <PauseCircle size={16} />
                  Variable height
                </span>
                <span className="buffer-pill">
                  <Layers3 size={16} />
                  Irregular sheets
                </span>
              </div>

              <ol className="buffer-outline">
                <li>高度不一致</li>
                <li>宽度也有变化</li>
                <li>仍然是 buffer 后覆盖</li>
              </ol>
            </aside>

            <div className="buffer-irregular-stage" aria-label="Six irregular height cover panels">
              {bufferLayers.map((layer) => (
                <article
                  className="buffer-irregular-layer"
                  data-align={layer.irregularAlign}
                  data-xalign={layer.irregularXAlign}
                  key={`${layer.step}-irregular`}
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
                      </div>
                    </div>

                    <div className="buffer-irregular-layer__footer">{layer.footer}</div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="buffer-outro">
          <span className="buffer-eyebrow">Usage note</span>
          <h2>一个适合章节叙事，一个适合连续展示，一个适合更自由的版式。</h2>
          <p>
            现在这个子页已经有三种同题对照：如果你想强调“切层感”和“停顿感”，就用覆盖版本；如果你想更自然地往下读，就用平铺版本；如果你想更像编辑设计或作品策展，就用不规则高度版本。
            如果你愿意，我下一步可以继续把这三套都抽成可配置模板。
          </p>
        </section>
      </main>
    </div>
  )
}
