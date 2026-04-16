import type { CSSProperties } from 'react'
import { useEffect, useLayoutEffect, useRef } from 'react'
import type { LucideIcon } from 'lucide-react'
import {
  ArrowDown,
  ArrowRight,
  ExternalLink,
  Layers3,
  MousePointer2,
  MoveRight,
  Orbit,
  Sparkles,
} from 'lucide-react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './App.css'
import { usePrefersReducedMotion } from './hooks/usePrefersReducedMotion'

gsap.registerPlugin(ScrollTrigger)

type ShowcaseCard = {
  icon: LucideIcon
  title: string
  description: string
  tags: string[]
}

type AccentCard = {
  eyebrow: string
  title: string
  description: string
  accent: string
}

const scrollShowcases: ShowcaseCard[] = [
  {
    icon: Layers3,
    title: 'Parallax Hero',
    description:
      '把背景、玻璃面板、数字球体做成不同速度的层，适合 SaaS 首页或品牌首屏。',
    tags: ['scrub', 'parallax', 'layers'],
  },
  {
    icon: Sparkles,
    title: 'Text Reveal',
    description:
      '标题和段落在进入视口时分批浮现，适合做故事化文案和产品价值陈列。',
    tags: ['reveal', 'stagger', 'copy'],
  },
  {
    icon: Orbit,
    title: 'Pinned Story',
    description:
      '滚动时固定舞台、切换卡片和内容状态，是官网最常见的一种叙事结构。',
    tags: ['pin', 'timeline', 'cards'],
  },
  {
    icon: ArrowDown,
    title: 'Horizontal Gallery',
    description:
      '把纵向滚动映射到横向画廊，适合做作品集、案例墙和横向功能导览。',
    tags: ['horizontal', 'snap', 'portfolio'],
  },
]

const revealLines = [
  'ScrollTrigger 最强的地方，不是“动起来”，而是让页面开始会讲故事。',
  '同一段滚动里，你可以同时控制位移、透明度、层级和叙事节奏。',
  '当内容本身已经排得很清楚，动画只需要负责“何时出现”和“怎么转场”。',
  '真正有参考价值的 demo，不是炫，而是让你知道什么适合业务落地。',
]

const storyCards: AccentCard[] = [
  {
    eyebrow: 'Phase 01',
    title: 'Pin 场景建立叙事主舞台',
    description: '用固定舞台把注意力收束在一个区域，再随着滚动切换状态。',
    accent: '#6ea8ff',
  },
  {
    eyebrow: 'Phase 02',
    title: '卡片切换承接内容重点',
    description: '每次滚动只强调一个层级，其他卡片退后，信息密度会更舒服。',
    accent: '#7b61ff',
  },
  {
    eyebrow: 'Phase 03',
    title: '让动效只服务内容，不抢内容',
    description: '越是偏产品叙事页，越适合用稳一点的平移动画而不是疯狂旋转。',
    accent: '#3fd7b0',
  },
  {
    eyebrow: 'Phase 04',
    title: '最后用 CTA 把注意力收回来',
    description: '完成铺垫之后，用显著按钮或结论模块做收口，转化会更自然。',
    accent: '#ff7f6b',
  },
]

const horizontalPanels: AccentCard[] = [
  {
    eyebrow: 'Panel 01',
    title: 'Launch your motion language',
    description: '先做一个高辨识度视觉母版，再围绕它扩展产品卖点和滚动编排。',
    accent: '#6ea8ff',
  },
  {
    eyebrow: 'Panel 02',
    title: 'Break features into visual chapters',
    description: '横向面板适合把复杂信息拆成一组节奏统一的小章节。',
    accent: '#7b61ff',
  },
  {
    eyebrow: 'Panel 03',
    title: 'Highlight proof, numbers and cues',
    description: '加入数据、标签和轻量图形后，整个滚动过程会更像产品 tour。',
    accent: '#3fd7b0',
  },
  {
    eyebrow: 'Panel 04',
    title: 'End with a clean action area',
    description: '最后一屏只留一个动作，让用户知道滚完后下一步该点哪里。',
    accent: '#ff7f6b',
  },
]

const mouseShowcases: ShowcaseCard[] = [
  {
    icon: MousePointer2,
    title: 'Cursor Follower',
    description: '让一个柔和的光标层跟随鼠标，做出官网级的“空气感”。',
    tags: ['cursor', 'follow', 'label'],
  },
  {
    icon: Sparkles,
    title: 'Magnetic Buttons',
    description: '按钮根据鼠标位置轻微吸附，能明显提升 CTA 的交互手感。',
    tags: ['magnetic', 'cta', 'hover'],
  },
  {
    icon: Layers3,
    title: '3D Tilt Cards',
    description: '卡片根据鼠标位置倾斜，并叠加微弱光斑，适合案例卡或功能卡。',
    tags: ['tilt', 'depth', 'cards'],
  },
  {
    icon: Orbit,
    title: 'Spotlight Surface',
    description: '在卡片内做跟随鼠标的聚光层，适合科技感 landing page。',
    tags: ['spotlight', 'glow', 'surface'],
  },
]

function App() {
  const appRef = useRef<HTMLDivElement>(null)
  const cursorRef = useRef<HTMLDivElement>(null)
  const cursorLabelRef = useRef<HTMLSpanElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)
  const reducedMotion = usePrefersReducedMotion()

  useLayoutEffect(() => {
    const root = appRef.current

    if (!root) {
      return undefined
    }

    if (reducedMotion) {
      gsap.set(progressRef.current, { scaleX: 0 })
      return undefined
    }

    const ctx = gsap.context(() => {
      gsap.from('.hero-copy > *', {
        opacity: 0,
        y: 36,
        duration: 0.9,
        ease: 'power3.out',
        stagger: 0.08,
      })

      gsap.from('.hero-panel', {
        opacity: 0,
        y: 48,
        duration: 1,
        ease: 'power3.out',
        stagger: 0.1,
        delay: 0.18,
      })

      gsap.from('.hero-metric', {
        opacity: 0,
        y: 32,
        duration: 0.8,
        ease: 'power3.out',
        stagger: 0.08,
        delay: 0.25,
      })

      gsap.from('.showcase-card', {
        opacity: 0,
        y: 42,
        duration: 0.8,
        ease: 'power3.out',
        stagger: 0.12,
        scrollTrigger: {
          trigger: '.showcase-grid',
          start: 'top 78%',
        },
      })

      gsap.to('.hero-orb--one', {
        yPercent: -24,
        xPercent: 8,
        ease: 'none',
        scrollTrigger: {
          trigger: '.hero',
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      })

      gsap.to('.hero-orb--two', {
        yPercent: 18,
        xPercent: -10,
        ease: 'none',
        scrollTrigger: {
          trigger: '.hero',
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      })

      gsap.to('.hero-panel--primary', {
        yPercent: -12,
        rotate: -5,
        ease: 'none',
        scrollTrigger: {
          trigger: '.hero',
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      })

      gsap.to('.hero-panel--secondary', {
        yPercent: 16,
        rotate: 6,
        ease: 'none',
        scrollTrigger: {
          trigger: '.hero',
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      })

      gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((line) => {
        gsap.fromTo(
          line,
          {
            opacity: 0,
            y: 72,
            clipPath: 'inset(0 0 100% 0)',
          },
          {
            opacity: 1,
            y: 0,
            clipPath: 'inset(0 0 0% 0)',
            duration: 1,
            ease: 'power4.out',
            scrollTrigger: {
              trigger: line,
              start: 'top 82%',
            },
          },
        )
      })

      gsap.from('.reveal-kpi', {
        opacity: 0,
        y: 40,
        duration: 0.85,
        ease: 'power3.out',
        stagger: 0.12,
        scrollTrigger: {
          trigger: '.reveal-metrics',
          start: 'top 82%',
        },
      })

      const storyItems = gsap.utils.toArray<HTMLElement>('.story-card')

      if (storyItems.length > 0) {
        const totalStoryItems = storyItems.length

        storyItems.forEach((card, index) => {
          gsap.set(card, {
            zIndex: totalStoryItems - index,
            opacity: index === 0 ? 1 : 0.42,
            y: index === 0 ? 0 : 56 + index * 18,
            scale: index === 0 ? 1 : Math.max(0.88, 0.96 - index * 0.02),
          })

          const meter = card.querySelector<HTMLElement>('.story-card__meter')

          if (meter) {
            gsap.set(meter, {
              scaleX: index === 0 ? 1 : 0,
              transformOrigin: 'left center',
            })
          }
        })

        const storyTimeline = gsap.timeline({
          defaults: { ease: 'power2.inOut' },
          scrollTrigger: {
            trigger: '.story-demo',
            start: 'top top',
            end: `+=${(storyItems.length - 1) * 420}`,
            scrub: 1,
            pin: '.story-shell',
          },
        })

        storyItems.slice(0, -1).forEach((card, index) => {
          const nextCard = storyItems[index + 1]
          const currentMeter = card.querySelector<HTMLElement>('.story-card__meter')
          const nextMeter = nextCard.querySelector<HTMLElement>('.story-card__meter')

          storyTimeline
            .set(nextCard, { zIndex: totalStoryItems + index + 1 }, index)
            .to(
              card,
              {
                y: -120,
                opacity: 0,
                scale: 0.88,
                duration: 1,
              },
              index,
            )
            .to(
              nextCard,
              {
                y: 0,
                opacity: 1,
                scale: 1,
                duration: 1,
              },
              index,
            )

          if (currentMeter) {
            storyTimeline.to(
              currentMeter,
              {
                scaleX: 0,
                duration: 0.45,
              },
              index,
            )
          }

          if (nextMeter) {
            storyTimeline.to(
              nextMeter,
              {
                scaleX: 1,
                duration: 0.55,
              },
              index + 0.2,
            )
          }
        })
      }

      const horizontalTrack = root.querySelector<HTMLElement>('.horizontal-track')

      if (horizontalTrack) {
        gsap.to(horizontalTrack, {
          x: () => -(horizontalTrack.scrollWidth - window.innerWidth + 48),
          ease: 'none',
          scrollTrigger: {
            trigger: '.horizontal-demo',
            start: 'top top',
            end: () => `+=${horizontalTrack.scrollWidth}`,
            pin: true,
            scrub: 1,
            snap: 1 / Math.max(horizontalPanels.length - 1, 1),
          },
        })
      }

      const progressBar = progressRef.current

      if (progressBar) {
        ScrollTrigger.create({
          start: 0,
          end: 'max',
          onUpdate: (self) => {
            gsap.set(progressBar, { scaleX: self.progress })
          },
        })
      }

      ScrollTrigger.refresh()
    }, root)

    return () => {
      ctx.revert()
    }
  }, [reducedMotion])

  useEffect(() => {
    const root = appRef.current
    const cursor = cursorRef.current
    const label = cursorLabelRef.current

    if (!root || !cursor || !label) {
      return undefined
    }

    const canUseFinePointer = window.matchMedia('(pointer: fine)').matches

    if (reducedMotion || !canUseFinePointer) {
      root.classList.remove('is-pointer-active')
      return undefined
    }

    gsap.set(cursor, { xPercent: -50, yPercent: -50 })

    const xTo = gsap.quickTo(cursor, 'x', {
      duration: 0.28,
      ease: 'power3.out',
    })
    const yTo = gsap.quickTo(cursor, 'y', {
      duration: 0.28,
      ease: 'power3.out',
    })

    const handlePointerMove = (event: PointerEvent) => {
      xTo(event.clientX)
      yTo(event.clientY)
      root.classList.add('is-pointer-active')
    }

    const handlePointerLeave = () => {
      root.classList.remove('is-pointer-active')
      label.textContent = 'move'
      cursor.classList.remove('cursor--highlight')
    }

    root.addEventListener('pointermove', handlePointerMove)
    root.addEventListener('pointerleave', handlePointerLeave)

    const cleanups: Array<() => void> = []

    const cursorTargets = Array.from(
      root.querySelectorAll<HTMLElement>('[data-cursor]'),
    )

    cursorTargets.forEach((target) => {
      const handleEnter = () => {
        label.textContent = target.dataset.cursor ?? 'hover'
        cursor.classList.add('cursor--highlight')
      }

      const handleLeave = () => {
        label.textContent = 'move'
        cursor.classList.remove('cursor--highlight')
      }

      target.addEventListener('pointerenter', handleEnter)
      target.addEventListener('pointerleave', handleLeave)

      cleanups.push(() => {
        target.removeEventListener('pointerenter', handleEnter)
        target.removeEventListener('pointerleave', handleLeave)
      })
    })

    const magneticButtons = Array.from(
      root.querySelectorAll<HTMLElement>('.magnetic-button'),
    )

    magneticButtons.forEach((button) => {
      const moveX = gsap.quickTo(button, 'x', {
        duration: 0.35,
        ease: 'power3.out',
      })
      const moveY = gsap.quickTo(button, 'y', {
        duration: 0.35,
        ease: 'power3.out',
      })

      const handleMove = (event: PointerEvent) => {
        const bounds = button.getBoundingClientRect()
        const offsetX = event.clientX - bounds.left - bounds.width / 2
        const offsetY = event.clientY - bounds.top - bounds.height / 2

        moveX(offsetX * 0.22)
        moveY(offsetY * 0.26)
      }

      const handleLeave = () => {
        moveX(0)
        moveY(0)
      }

      button.addEventListener('pointermove', handleMove)
      button.addEventListener('pointerleave', handleLeave)

      cleanups.push(() => {
        button.removeEventListener('pointermove', handleMove)
        button.removeEventListener('pointerleave', handleLeave)
      })
    })

    const tiltCards = Array.from(root.querySelectorAll<HTMLElement>('.tilt-card'))

    tiltCards.forEach((card) => {
      const handleEnter = () => {
        gsap.to(card, {
          scale: 1.02,
          duration: 0.35,
          ease: 'power2.out',
        })
      }

      const handleMove = (event: PointerEvent) => {
        const bounds = card.getBoundingClientRect()
        const relativeX = event.clientX - bounds.left
        const relativeY = event.clientY - bounds.top
        const rotateY = ((relativeX / bounds.width) - 0.5) * 14
        const rotateX = (0.5 - relativeY / bounds.height) * 12

        card.style.setProperty('--spotlight-x', `${relativeX}px`)
        card.style.setProperty('--spotlight-y', `${relativeY}px`)

        gsap.to(card, {
          rotateX,
          rotateY,
          duration: 0.45,
          ease: 'power3.out',
          transformPerspective: 1200,
        })
      }

      const handleLeave = () => {
        gsap.to(card, {
          rotateX: 0,
          rotateY: 0,
          scale: 1,
          duration: 0.55,
          ease: 'power3.out',
        })
      }

      card.addEventListener('pointerenter', handleEnter)
      card.addEventListener('pointermove', handleMove)
      card.addEventListener('pointerleave', handleLeave)

      cleanups.push(() => {
        card.removeEventListener('pointerenter', handleEnter)
        card.removeEventListener('pointermove', handleMove)
        card.removeEventListener('pointerleave', handleLeave)
      })
    })

    return () => {
      root.removeEventListener('pointermove', handlePointerMove)
      root.removeEventListener('pointerleave', handlePointerLeave)
      cleanups.forEach((cleanup) => cleanup())
    }
  }, [reducedMotion])

  return (
    <div
      className={`app ${reducedMotion ? '' : 'app--interactive'}`.trim()}
      ref={appRef}
    >
      <div className="scroll-progress" aria-hidden="true">
        <div className="scroll-progress__bar" ref={progressRef}></div>
      </div>

      <div className="cursor" ref={cursorRef} aria-hidden="true">
        <span ref={cursorLabelRef}>move</span>
      </div>

      <header className="topbar">
        <a className="brand" href="#top" data-cursor="home">
          <span className="brand__pulse"></span>
          GSAP Motion Lab
        </a>

        <nav className="topbar__nav" aria-label="Section navigation">
          <a href="#scroll-lab" data-cursor="scroll">
            Scroll demos
          </a>
          <a href="#mouse-lab" data-cursor="mouse">
            Mouse demos
          </a>
          <a href="/buffer-layers" data-cursor="subpage">
            Buffer page
          </a>
          <a href="#notes" data-cursor="notes">
            Notes
          </a>
        </nav>
      </header>

      <main>
        <section className="section hero" id="top">
          <div className="hero-copy">
            <span className="eyebrow">GSAP scroll + cursor experiments</span>
            <h1>
              把官网常见滚动特效和鼠标交互，做成一个能直接对照试的 demo
              仓库。
            </h1>
            <p className="hero-copy__lead">
              我参考了 `gsap.com` 上最常见的交互范式，把最值得落地的几类效果整理成一页：
              视差、文字 reveal、pin 场景、横向长廊，再加 cursor follower、磁吸按钮、3D
              tilt 和 spotlight 卡片，方便你快速挑方向。
            </p>

            <div className="hero-actions">
              <a className="button button--primary" href="#scroll-lab" data-cursor="view">
                先看滚动 demo
                <ArrowRight size={18} />
              </a>
              <a className="button button--ghost" href="#mouse-lab" data-cursor="hover">
                再看鼠标特效
                <MousePointer2 size={18} />
              </a>
              <a className="button button--ghost" href="/buffer-layers" data-cursor="route">
                看三种 buffer 子页
                <ExternalLink size={18} />
              </a>
              <a className="button button--ghost" href="/buffer-layers-irregular" data-cursor="irregular">
                看不规则单页
                <Layers3 size={18} />
              </a>
            </div>

            <ul className="hero-tags" aria-label="Selected GSAP keywords">
              <li>ScrollTrigger</li>
              <li>Pin + Scrub</li>
              <li>Horizontal Scroll</li>
              <li>Cursor Follower</li>
            </ul>
          </div>

          <div className="hero-visual" aria-hidden="true">
            <div className="hero-orb hero-orb--one"></div>
            <div className="hero-orb hero-orb--two"></div>

            <article className="hero-panel hero-panel--primary">
              <span>Scroll language</span>
              <strong>让页面会讲故事</strong>
              <p>把滚动从“浏览”变成“推进剧情”。</p>
            </article>

            <article className="hero-panel hero-panel--secondary">
              <span>Mouse language</span>
              <strong>让 hover 更有手感</strong>
              <p>把 CTA、卡片和指针做出更细腻的反馈。</p>
            </article>

            <div className="hero-metrics">
              <div className="hero-metric">
                <small>Scroll demos</small>
                <strong>4</strong>
              </div>
              <div className="hero-metric">
                <small>Mouse demos</small>
                <strong>4</strong>
              </div>
              <div className="hero-metric">
                <small>Plugins</small>
                <strong>GSAP + ScrollTrigger</strong>
              </div>
            </div>
          </div>
        </section>

        <section className="section section--intro" id="scroll-lab">
          <div className="section-heading">
            <div>
              <span className="eyebrow">Scroll showcase</span>
              <h2>你最常会在官网、产品页和作品集中用到的滚动效果</h2>
            </div>
            <p>
              这里不是追求“全都炫一遍”，而是把最值得落地的几类滚动方式整理出来，方便你判断什么适合自己的业务页面。
            </p>
          </div>

          <div className="showcase-grid">
            {scrollShowcases.map(({ icon: Icon, title, description, tags }) => (
              <article className="showcase-card" key={title} data-cursor="open">
                <div className="showcase-card__icon">
                  <Icon size={20} />
                </div>
                <h3>{title}</h3>
                <p>{description}</p>
                <ul>
                  {tags.map((tag) => (
                    <li key={tag}>{tag}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section className="section demo demo--parallax">
          <div className="demo-copy">
            <span className="eyebrow">Demo 01 / Parallax hero</span>
            <h2>多层元素按不同速度移动，做出明显的纵深感</h2>
            <p>
              这种效果最适合放在首页第一屏：背景球体、内容卡片和数字标签分别用不同的
              `scrub` 节奏滚动，简单但非常有官网感。
            </p>
          </div>

          <div className="parallax-stage">
            <div className="parallax-card parallax-card--xl" data-cursor="scrub">
              <span>Layer 01</span>
              <strong>背景负责氛围，前景负责信息。</strong>
            </div>
            <div className="parallax-card" data-cursor="depth">
              <span>Layer 02</span>
              <strong>玻璃面板轻一点，读感会更高级。</strong>
            </div>
            <div className="parallax-card" data-cursor="flow">
              <span>Layer 03</span>
              <strong>标签与数字用来建立运动节奏。</strong>
            </div>
          </div>
        </section>

        <section className="section demo reveal-demo">
          <div className="demo-copy">
            <span className="eyebrow">Demo 02 / Text reveal</span>
            <h2>文案分段进场，让信息被“读到”，而不是被一口气扔给用户</h2>
            <p>
              如果你的页面内容偏产品价值、品牌表达或案例说明，这种 reveal 会比夸张的物理动画更稳，也更容易控制阅读节奏。
            </p>
          </div>

          <div className="reveal-board">
            {revealLines.map((line) => (
              <p className="reveal-line" data-reveal key={line}>
                {line}
              </p>
            ))}
          </div>

          <div className="reveal-metrics">
            <article className="reveal-kpi" data-cursor="data">
              <small>Best for</small>
              <strong>品牌页 / 功能介绍 / 案例叙事</strong>
            </article>
            <article className="reveal-kpi" data-cursor="stagger">
              <small>Animation recipe</small>
              <strong>translateY + opacity + clip-path</strong>
            </article>
            <article className="reveal-kpi" data-cursor="pace">
              <small>Feel</small>
              <strong>克制、清晰、适合业务落地</strong>
            </article>
          </div>
        </section>

        <section className="section demo story-demo">
          <div className="story-shell">
            <div className="demo-copy demo-copy--sticky">
              <span className="eyebrow">Demo 03 / Pinned storytelling</span>
              <h2>固定一个舞台，再让内容随着滚动逐步切换</h2>
              <p>
                这是 `ScrollTrigger` 里最常见也最实用的一类：用户滚动时，舞台固定不动，但卡片、状态和重点依次前进，特别适合做产品能力说明。
              </p>
              <div className="demo-note">
                <Layers3 size={18} />
                用 `pin + scrub + timeline` 把多个阶段串起来。
              </div>
            </div>

            <div className="story-stage" aria-label="Pinned storytelling cards">
              {storyCards.map((card, index) => (
                <article
                  className="story-card"
                  key={card.title}
                  style={{ '--story-accent': card.accent } as CSSProperties}
                  data-cursor="pin"
                >
                  <div className="story-card__meta">
                    <span>{card.eyebrow}</span>
                    <span>0{index + 1}</span>
                  </div>
                  <h3>{card.title}</h3>
                  <p>{card.description}</p>
                  <div className="story-card__meter"></div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section demo horizontal-demo">
          <div className="demo-copy">
            <span className="eyebrow">Demo 04 / Horizontal gallery</span>
            <h2>用纵向滚动推动横向长廊，特别适合作品集和功能导览</h2>
            <p>
              这个模式非常适合案例展示：面板宽、空间足，而且可以配合 `snap` 让每一屏停得更干净。滚动的时候，视线会自然被导向下一个重点模块。
            </p>
          </div>

          <div className="horizontal-viewport">
            <div className="horizontal-track">
              {horizontalPanels.map((panel) => (
                <article
                  className="horizontal-panel"
                  key={panel.title}
                  style={{ '--panel-accent': panel.accent } as CSSProperties}
                  data-cursor="slide"
                >
                  <span>{panel.eyebrow}</span>
                  <h3>{panel.title}</h3>
                  <p>{panel.description}</p>
                  <div className="horizontal-panel__arrow">
                    <MoveRight size={20} />
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section section--intro" id="mouse-lab">
          <div className="section-heading">
            <div>
              <span className="eyebrow">Mouse showcase</span>
              <h2>滚动之外，再给页面加一点“会回应用户”的手感</h2>
            </div>
            <p>
              鼠标特效最怕用力过猛，所以这里我选的都是偏实用型：能显著提升交互质感，但又不会干扰阅读和点击。
            </p>
          </div>

          <div className="showcase-grid showcase-grid--mouse">
            {mouseShowcases.map(({ icon: Icon, title, description, tags }) => (
              <article className="showcase-card" key={title} data-cursor="hover">
                <div className="showcase-card__icon">
                  <Icon size={20} />
                </div>
                <h3>{title}</h3>
                <p>{description}</p>
                <ul>
                  {tags.map((tag) => (
                    <li key={tag}>{tag}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section className="section mouse-demo">
          <div className="mouse-layout">
            <article className="cursor-arena" data-cursor="follow">
              <span className="eyebrow">Cursor follower</span>
              <h2>移动鼠标看看：自定义 cursor 会跟随并根据 hover 目标切换标签</h2>
              <p>
                这个 demo 适合创意首页、portfolio 或 AI 产品 landing page。相比直接改原生 cursor，叠一层柔和的跟随光标会更细腻。
              </p>

              <div className="magnetic-row">
                <button className="magnetic-button" data-cursor="launch" type="button">
                  Launch CTA
                </button>
                <button className="magnetic-button" data-cursor="docs" type="button">
                  Explore Docs
                </button>
                <button className="magnetic-button" data-cursor="book" type="button">
                  Save Idea
                </button>
              </div>
            </article>

            <div className="tilt-grid">
              <article className="tilt-card" data-cursor="tilt">
                <span>Mouse tilt</span>
                <h3>让卡片轻微倾斜，营造空间感</h3>
                <p>适合案例卡、定价卡、AI 能力卡，既有反馈又不会太跳。</p>
              </article>
              <article className="tilt-card" data-cursor="glow">
                <span>Spotlight</span>
                <h3>跟随鼠标的局部高光</h3>
                <p>通过聚光层强调 hover 区域，尤其适合深色科技风页面。</p>
              </article>
              <article className="tilt-card" data-cursor="depth">
                <span>Depth cue</span>
                <h3>把 hover 做成带层次的空间反馈</h3>
                <p>比普通阴影更有“被触碰”的感觉，适合作为视觉升级项。</p>
              </article>
            </div>
          </div>
        </section>

        <section className="section notes" id="notes">
          <div className="section-heading section-heading--compact">
            <div>
              <span className="eyebrow">What to pick</span>
              <h2>如果你想从这些 demo 里挑一套先落到业务页，可以这样选</h2>
            </div>
          </div>

          <div className="notes-grid">
            <article className="note-card" data-cursor="saaS">
              <strong>SaaS / AI 首页</strong>
              <p>优先用 Parallax Hero + Text Reveal + Magnetic CTA，专业感最稳。</p>
            </article>
            <article className="note-card" data-cursor="portfolio">
              <strong>作品集 / 案例页</strong>
              <p>优先用 Horizontal Gallery + Tilt Cards，展示感更强。</p>
            </article>
            <article className="note-card" data-cursor="story">
              <strong>产品叙事页</strong>
              <p>优先用 Pinned Storytelling，让滚动成为内容推进器。</p>
            </article>
          </div>
        </section>
      </main>
    </div>
  )
}

export default App
