import { useEffect } from 'react'

let sfInitialized = false

function AgentforceChat() {
  useEffect(() => {
    if (sfInitialized) return
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

    return () => {
      // Remove bootstrap script
      const existingScript = document.getElementById('agentforce-bootstrap')
      if (existingScript) existingScript.remove()

      // Remove the chat button web component Salesforce injects
      const chatButton = document.querySelector('embeddedservice-chat-button')
      if (chatButton) chatButton.remove()

      // Remove any Salesforce sidebar/modal the widget adds
      document.querySelectorAll(
        '.embeddedServiceSidebar, .embeddedServiceHelpButton, [id^="esw"]'
      ).forEach(el => el.remove())

      // Clean up globals so it can reinitialize on next login
      delete window.initEmbeddedMessaging
      delete window.embeddedservice_bootstrap
      sfInitialized = false
    }
  }, [])

  return null
}

export default AgentforceChat
