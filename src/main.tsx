import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import BufferLayersPage from './pages/BufferLayersPage.tsx'
import IrregularBufferLayersPage from './pages/IrregularBufferLayersPage.tsx'
import GenieSplashPage from './pages/GenieSplashPage.tsx'
import GenieCinematicPage from './pages/GenieCinematicPage.tsx'
import GenieGlitchPage from './pages/GenieGlitchPage.tsx'
import GenieBreathePage from './pages/GenieBreathePage.tsx'
import GenieLiquidPage from './pages/GenieLiquidPage.tsx'
import GenieTerminalPage from './pages/GenieTerminalPage.tsx'
import Genie3DFlipPage from './pages/Genie3DFlipPage.tsx'
import GenieMorphPage from './pages/GenieMorphPage.tsx'
import GenieRadarPage from './pages/GenieRadarPage.tsx'
import GenieTypefacePage from './pages/GenieTypefacePage.tsx'
import GenieNeonPage from './pages/GenieNeonPage.tsx'
import GenieGravityPage from './pages/GenieGravityPage.tsx'

const normalizedPathname = window.location.pathname.replace(/\/+$/, '') || '/'

const routes: Record<string, React.ReactElement> = {
  '/buffer-layers': <BufferLayersPage />,
  '/buffer-layers-irregular': <IrregularBufferLayersPage />,
  '/genie-splash': <GenieSplashPage />,
  '/genie-cinematic': <GenieCinematicPage />,
  '/genie-glitch': <GenieGlitchPage />,
  '/genie-breathe': <GenieBreathePage />,
  '/genie-liquid': <GenieLiquidPage />,
  '/genie-terminal': <GenieTerminalPage />,
  '/genie-3d-flip': <Genie3DFlipPage />,
  '/genie-morph': <GenieMorphPage />,
  '/genie-radar': <GenieRadarPage />,
  '/genie-typeface': <GenieTypefacePage />,
  '/genie-neon': <GenieNeonPage />,
  '/genie-gravity': <GenieGravityPage />,
}

const currentPageElement = routes[normalizedPathname] ?? <App />

createRoot(document.getElementById('root')!).render(
  <StrictMode>{currentPageElement}</StrictMode>,
)
