import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import BufferLayersPage from './pages/BufferLayersPage.tsx'

const normalizedPathname = window.location.pathname.replace(/\/+$/, '') || '/'
const currentPageElement =
  normalizedPathname === '/buffer-layers' ? <BufferLayersPage /> : <App />

createRoot(document.getElementById('root')!).render(
  <StrictMode>{currentPageElement}</StrictMode>,
)
