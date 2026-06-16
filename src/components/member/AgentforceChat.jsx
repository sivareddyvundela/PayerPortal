import { useEffect } from 'react'

let sfInitialized = false

const THEME_STYLE_ID = 'agentforce-hb-theme'

const themeCSS = `
  embeddedservice-chat-button,
  .embeddedServiceHelpButton {
    z-index: 99999 !important;
  }
  .embeddedServiceSidebar,
  .embeddedServiceSidebarMinimizedDefaultUI {
    z-index: 99999 !important;
  }

  .embeddedServiceHelpButton .helpButton .uiButton {
    background: linear-gradient(135deg, #1e40af 0%, #0d9488 100%) !important;
    border: none !important;
    border-radius: 50px !important;
    box-shadow: 0 4px 20px rgba(13, 148, 136, 0.45) !important;
    font-family: 'Inter', system-ui, sans-serif !important;
    font-weight: 600 !important;
    transition: box-shadow 0.2s ease, transform 0.15s ease !important;
  }
  .embeddedServiceHelpButton .helpButton .uiButton:hover {
    box-shadow: 0 6px 28px rgba(13, 148, 136, 0.6) !important;
    transform: translateY(-1px) !important;
  }
  .embeddedServiceHelpButton .helpButton .uiButton:focus {
    outline: 2px solid #1e40af !important;
    outline-offset: 3px !important;
  }
  .embeddedServiceHelpButton .helpButton .uiButton .helpButtonLabel .message {
    color: #ffffff !important;
    font-size: 0 !important;
  }
  .embeddedServiceHelpButton .helpButton .uiButton .helpButtonLabel .message::after {
    content: 'Payer Agent';
    font-size: 14px !important;
    color: #ffffff !important;
  }

  .embeddedServiceSidebarMinimizedDefaultUI.newDesign,
  .embeddedServiceSidebarMinimizedDefaultUI {
    background: linear-gradient(135deg, #1e40af 0%, #0d9488 100%) !important;
    border-radius: 12px !important;
    box-shadow: 0 4px 20px rgba(30, 64, 175, 0.4) !important;
  }

  .embeddedServiceSidebar .dockableContainer .sidebarHeader {
    background: linear-gradient(135deg, #1e40af 0%, #0d9488 100%) !important;
  }
`

function AgentforceChat() {
  useEffect(() => {
    if (!document.getElementById(THEME_STYLE_ID)) {
      const el = document.createElement('style')
      el.id = THEME_STYLE_ID
      el.textContent = themeCSS
      document.head.appendChild(el)
    }

    if (sfInitialized) return
    sfInitialized = true

    window.initEmbeddedMessaging = function () {
      try {
        embeddedservice_bootstrap.settings.language = 'en_US'
        embeddedservice_bootstrap.init(
          '00Dfj00000Q85ss',
          'Messaging_for_Agent',
          'https://wi1779717974753.my.site.com/ESWMessagingforAgent1780106185553',
          { scrt2URL: 'https://wi1779717974753.my.salesforce-scrt.com' }
        )
      } catch (err) {
        console.error('Agentforce: init error —', err)
        sfInitialized = false
      }
    }

    const script = document.createElement('script')
    script.id = 'agentforce-bootstrap'
    script.type = 'text/javascript'
    script.src =
      'https://wi1779717974753.my.site.com/ESWMessagingforAgent1780106185553/assets/js/bootstrap.min.js'
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
