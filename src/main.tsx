import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './app'
import 'sanitize.css'
import './index.css'
import env from './config/env'

async function enableMocking() {
  if (env.ENABLE_API_MOCKING) {
    const { worker } = await import('./mocks/browser')
    return worker.start()
  }
}

enableMocking().then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
})
