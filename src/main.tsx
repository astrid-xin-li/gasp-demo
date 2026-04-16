import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import BufferLayersPage from './pages/BufferLayersPage.tsx'
import IrregularBufferLayersPage from './pages/IrregularBufferLayersPage.tsx'

const normalizedPathname = window.location.pathname.replace(/\/+$/, '') || '/'
const currentPageElement =
  normalizedPathname === '/buffer-layers'
    ? <BufferLayersPage />
    : normalizedPathname === '/buffer-layers-irregular'
      ? <IrregularBufferLayersPage />
      : <App />

createRoot(document.getElementById('root')!).render(
  <StrictMode>{currentPageElement}</StrictMode>,
)
