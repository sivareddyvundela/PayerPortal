import { useEffect } from 'react'

let sfInitialized = false

function AgentforceChat() {
  useEffect(() => {
    // Guard against React StrictMode double-invoke and re-renders
    if (sfInitialized) return
    // Also skip if the script tag is already in the DOM
    if (document.getElementById('agentforce-bootstrap')) return

    sfInitialized = true

    window.initEmbeddedMessaging = function () {
      try {
        embeddedservice_bootstrap.settings.language = 'en_US'
        embeddedservice_bootstrap.init(
          '00Dfj00000Q85ss',
          'HealthBridge',
          'https://wi1779717974753.my.site.com/ESWHealthBridge1781523439752',
          { scrt2URL: 'https://wi1779717974753.my.salesforce-scrt.com' }
        )
      } catch (err) {
        console.error('Error loading Embedded Messaging: ', err)
        sfInitialized = false
      }
    }

    const script = document.createElement('script')
    script.id = 'agentforce-bootstrap'
    script.type = 'text/javascript'
    script.src =
      'https://wi1779717974753.my.site.com/ESWHealthBridge1781523439752/assets/js/bootstrap.min.js'
    script.onload = () => {
      if (typeof window.initEmbeddedMessaging === 'function') {
        window.initEmbeddedMessaging()
      }
    }
    script.onerror = () => {
      console.error('Agentforce: bootstrap.min.js failed to load.')
      sfInitialized = false
    }
    document.body.appendChild(script)
  }, [])

  return null
}

export default AgentforceChat
