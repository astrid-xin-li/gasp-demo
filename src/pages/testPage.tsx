import type { CSSProperties } from 'react'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import '../buffer-layers.css'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'
import { MioraNavbar } from './components/miora-navbar'
import { MioraHeroCanvas } from './components/miora-hero-canvas'
import { MioraHeroOverlay } from './components/miora-hero-overlay'
import { MioraHeroKeyframes } from './components/miora-hero-keyframes'
import { useHeroParallax } from './components/use-hero-parallax'
import { MioraConceptSection } from './components/miora-concept-section'
import { MioraShowcaseSection } from './components/miora-showcase-section'
import { MioraGallerySection } from './components/miora-gallery-section'
import { MioraFooter } from './components/miora-footer'
import { MioraFloatingScrollbar } from './components/miora-floating-scrollbar'
import { MioraI18nContext, mioraT } from './i18n-context'

gsap.registerPlugin(ScrollTrigger)

type IrregularAlign = 'start' | 'center' | 'end'
type IrregularXAlign = 'left' | 'right'

const MOBILE_BREAKPOINT = 768

const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(() => {
    return typeof window !== 'undefined' ? window.innerWidth < MOBILE_BREAKPOINT : false
  })

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return isMobile
}

type TestPageLayerConfig = {
  step: string
  background: string
  accent: string
  irregularHeight: string
  irregularWidth: string
  irregularAlign: IrregularAlign
  irregularXAlign: IrregularXAlign
}

type LayerOneProps = {
  parallax: ReturnType<typeof useHeroParallax>
}

function TestPageLayerOne({ parallax }: LayerOneProps) {
  return (
    <>
      <section
        ref={parallax.containerRef}
        className="relative w-full overflow-visible bg-transparent"
        style={{ height: `${parallax.sectionHeight}px` }}
      >
        <MioraHeroOverlay
          decorLeftRef={parallax.decorLeftRef}
          decorRightRef={parallax.decorRightRef}
          loadedAssets={parallax.loadedAssets}
          playedEntrances={parallax.playedEntrances}
          heroVisualsReady={parallax.heroVisualsReady}
          handleAssetLoad={parallax.handleAssetLoad}
          scale={parallax.scale}
          windowSize={parallax.windowSize}
          scaledWidth={parallax.scaledWidth}
        />
      </section>
      <MioraConceptSection />
    </>
  )
}

function TestPageLayerTwo() {
  return <MioraShowcaseSection />
}

function TestPageLayerThree() {
  return (
    <>
      <MioraGallerySection />
      <MioraFooter />
    </>
  )
}

export default function TestPage() {
  const rootRef = useRef<HTMLDivElement>(null)
  const reducedMotion = usePrefersReducedMotion()
  const isMobile = useIsMobile()
  const parallax = useHeroParallax()
  const [activeLayer, setActiveLayer] = useState(0)
  const [canvasHidden, setCanvasHidden] = useState(false)

  const testPageLayers: TestPageLayerConfig[] = [
    {
      step: '01',
      background: 'linear-gradient(180deg, rgba(0,0,0,0), rgba(0,0,0,0))',
      accent: '#6ea8ff',
      irregularHeight: '200vh',
      irregularWidth: '100%',
      irregularAlign: 'end',
      irregularXAlign: 'right',
    },
    {
      step: '02',
      background: 'linear-gradient(180deg, rgba(0,0,0,1), rgba(0,0,0,1))',
      accent: '#7b61ff',
      irregularHeight: '150vh',
      irregularWidth: '100%',
      irregularAlign: 'center',
      irregularXAlign: 'left',
    },
    {
      step: '03',
      background: 'linear-gradient(180deg, rgba(0,0,0,1), rgba(0,0,0,1))',
      accent: '#3fd7b0',
      irregularHeight: '165vh',
      irregularWidth: '100%',
      irregularAlign: 'start',
      irregularXAlign: 'right',
    },
  ]

  useEffect(() => {
    const scrollClassName = 'miora-home-scroll-root'

    document.title = 'Miora - Creative Studio'
    document.documentElement.classList.add(scrollClassName)
    document.body.classList.add(scrollClassName)

    return () => {
      document.title = 'Miora - AI Design Agent'
      document.documentElement.classList.remove(scrollClassName)
      document.body.classList.remove(scrollClassName)
    }
  }, [])

  useLayoutEffect(() => {
    const root = rootRef.current

    if (!root || reducedMotion || isMobile) {
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

      const updateStageState = () => {
        let currentActive = 0

        irregularLayers.forEach((layer, index) => {
          const autoAlpha = Number(gsap.getProperty(layer, 'autoAlpha'))
          const yPercent = Number(gsap.getProperty(layer, 'yPercent'))

          if (autoAlpha > 0.5 && yPercent < 56) {
            currentActive = index
          }
        })

        setActiveLayer(currentActive)
        setCanvasHidden(currentActive > 0)
      }

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
          onUpdate: updateStageState,
          onRefresh: updateStageState,
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

      updateStageState()
      ScrollTrigger.refresh()
    }, root)

    return () => {
      ctx.revert()
      setActiveLayer(0)
      setCanvasHidden(false)
    }
  }, [isMobile, reducedMotion])

  const pageClassName = [
    'buffer-page',
    'buffer-page--irregular-only',
    'buffer-page--no-topbar',
    'min-h-screen overflow-x-hidden bg-black',
    reducedMotion || isMobile ? 'buffer-page--reduced' : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <MioraI18nContext.Provider value={{ t: mioraT }}>
      <div className={pageClassName} ref={rootRef}>
        <MioraNavbar activeLayer={activeLayer} />
        <MioraHeroKeyframes />
        <MioraHeroCanvas
          bgRef={parallax.bgRef}
          fgRef={parallax.fgRef}
          vignetteRef={parallax.vignetteRef}
          hidden={canvasHidden}
          loadedAssets={parallax.loadedAssets}
          playedEntrances={parallax.playedEntrances}
          handleAssetLoad={parallax.handleAssetLoad}
          scale={parallax.scale}
          windowSize={parallax.windowSize}
          scaledWidth={parallax.scaledWidth}
        />

        <main style={isMobile ? { position: 'relative' } : { position: 'relative', zIndex: 1 }}>
          <section className="buffer-irregular-section" id="test-page-irregular-stage">
            <div className="buffer-irregular-shell">
              <div className="buffer-irregular-stage" aria-label="Three irregular Miora content panels">
                {testPageLayers.map((layer, index) => (
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
                      zIndex: testPageLayers.length - index,
                    } as CSSProperties}
                  >
                    <div className="buffer-irregular-layer__sheet">
                      {index === 0 ? <TestPageLayerOne parallax={parallax} /> : null}
                      {index === 1 ? <TestPageLayerTwo /> : null}
                      {index === 2 ? <TestPageLayerThree /> : null}
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>
        </main>

        {!isMobile && <MioraFloatingScrollbar />}
      </div>
    </MioraI18nContext.Provider>
  )
}
