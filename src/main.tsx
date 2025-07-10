import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import logseq from '@logseq/libs'

const main = async () => {
  logseq.App.onMacroRendererSlotted(
    async ({ slot, payload: { uuid, arguments: args } }) => {
      const [type] = args
      if (!type || !type.startsWith(':odyssey_')) { return }

      const odysseyId = `odyssey_${uuid}_${slot}`

      logseq.provideUI({
        key: odysseyId,
        slot,
        reset: true,
        template: `<div id=${odysseyId}></div>`,
      })

      setTimeout(() => {
        createRoot(parent.document.querySelector(`#${odysseyId}`)!).render(
          <StrictMode>
            <App />
          </StrictMode>,
        )
      }, 0)
    })
}

logseq.ready(main).catch(console.error)
