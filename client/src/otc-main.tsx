import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import OTCApp from './otc-app.tsx'
import './index.css'

createRoot(document.getElementById('otc-root')!).render(
  <StrictMode>
    <OTCApp />
  </StrictMode>,
)