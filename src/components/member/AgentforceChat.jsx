import { useEffect } from 'react'

let sfInitialized = false

const THEME_STYLE_ID = 'agentforce-hb-theme'

const themeCSS = `
  /* ── HealthBridge brand tokens for the new Messaging widget ── */
  :root {
    --lwc-color-brand: #1d4ed8;
    --lwc-color-brand-dark: #1e3a8a;
    --lwc-color-brand-darker-05: #1e40af;
    --lwc-color-action-accessible: #0d9488;
    --lwc-brandAccessible: #1d4ed8;
    --lwc-colorBackgroundButtonBrand: #1d4ed8;
    --lwc-colorBackgroundButtonBrandActive: #1e3a8a;
    --lwc-colorBackgroundButtonBrandHover: #1e40af;
    --lwc-colorBorderButtonBrand: #1d4ed8;
    --lwc-colorBorderButtonBrandActive: #1e3a8a;
    --lwc-colorBorderButtonBrandHover: #1e40af;
    --lwc-colorTextButtonBrand: #ffffff;
  }

  /* ── z-index stacking ── */
  embeddedservice-chat-button,
  .embeddedServiceHelpButton {
    z-index: 99999 !important;
  }
  .embeddedServiceSidebar,
  .embeddedServiceSidebarMinimizedDefaultUI {
    z-index: 99999 !important;
  }

  /* ── Floating launch button (new Messaging for Web) ── */
  embeddedservice-chat-button .fab-content,
  embeddedservice-chat-button button {
    background: linear-gradient(135deg, #1d4ed8 0%, #0d9488 100%) !important;
    border: none !important;
    border-radius: 50px !important;
    box-shadow: 0 4px 18px rgba(13, 148, 136, 0.45) !important;
    color: #ffffff !important;
    font-family: 'Inter', Arial, system-ui, sans-serif !important;
    font-size: 14px !important;
    font-weight: 600 !important;
    transition: box-shadow 0.2s ease, transform 0.15s ease !important;
  }
  embeddedservice-chat-button button:hover {
    box-shadow: 0 6px 26px rgba(13, 148, 136, 0.62) !important;
    transform: translateY(-1px) !important;
  }

  /* ── Legacy Embedded Service launch button ── */
  .embeddedServiceHelpButton .helpButton .uiButton {
    background: linear-gradient(135deg, #1d4ed8 0%, #0d9488 100%) !important;
    border: none !important;
    border-radius: 50px !important;
    box-shadow: 0 4px 18px rgba(13, 148, 136, 0.45) !important;
    font-family: 'Inter', Arial, system-ui, sans-serif !important;
    font-weight: 600 !important;
    transition: box-shadow 0.2s ease, transform 0.15s ease !important;
  }
  .embeddedServiceHelpButton .helpButton .uiButton:hover {
    box-shadow: 0 6px 26px rgba(13, 148, 136, 0.62) !important;
    transform: translateY(-1px) !important;
  }
  .embeddedServiceHelpButton .helpButton .uiButton:focus {
    outline: 2px solid #1d4ed8 !important;
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

  /* ── Minimized chat tab ── */
  .embeddedServiceSidebarMinimizedDefaultUI,
  .embeddedServiceSidebarMinimizedDefaultUI.newDesign {
    background: linear-gradient(135deg, #1d4ed8 0%, #0d9488 100%) !important;
    border-radius: 12px 12px 0 0 !important;
    box-shadow: 0 -2px 16px rgba(30, 64, 175, 0.3) !important;
    font-family: 'Inter', Arial, system-ui, sans-serif !important;
  }

  /* ── Chat panel header ── */
  .embeddedServiceSidebar .dockableContainer .sidebarHeader,
  .embeddedServiceSidebar .dockableContainer .sidebarHeader .headerText {
    background: linear-gradient(135deg, #1d4ed8 0%, #0d9488 100%) !important;
    color: #ffffff !important;
    font-family: 'Inter', Arial, system-ui, sans-serif !important;
    font-weight: 600 !important;
  }

  /* ── Chat body ── */
  .embeddedServiceSidebar .dockableContainer,
  .embeddedServiceSidebar .embeddedServiceSidebarForm {
    font-family: 'Inter', Arial, system-ui, sans-serif !important;
    background: #ffffff !important;
  }

  /* ── End-user message bubbles ── */
  .embeddedServiceLiveAgentStateChatItem.chatMessage:not(.agent) .chatContent {
    background: #1e40af !important;
    color: #ffffff !important;
    border-radius: 16px 16px 2px 16px !important;
  }

  /* ── Agent / bot message bubbles ── */
  .embeddedServiceLiveAgentStateChatItem.chatMessage.agent .chatContent {
    background: #f0f9ff !important;
    color: #1e3a8a !important;
    border-radius: 16px 16px 16px 2px !important;
    border: 1px solid #bfdbfe !important;
  }

  /* ── Send button & primary action buttons ── */
  .embeddedServiceSidebar .uiButton--brand,
  .embeddedServiceSidebar .embeddedServiceSidebarButton {
    background: linear-gradient(135deg, #1d4ed8 0%, #0d9488 100%) !important;
    border: none !important;
    border-radius: 8px !important;
    color: #ffffff !important;
    font-family: 'Inter', Arial, system-ui, sans-serif !important;
    font-weight: 600 !important;
  }

  /* ── Input field focus ring ── */
  .embeddedServiceSidebar .embeddedServiceSidebarForm input:focus,
  .embeddedServiceSidebar .embeddedServiceSidebarForm textarea:focus {
    border-color: #0d9488 !important;
    box-shadow: 0 0 0 2px rgba(13, 148, 136, 0.25) !important;
    outline: none !important;
  }

  /* ── Links ── */
  .embeddedServiceSidebar a,
  .embeddedServiceSidebar .embeddedServiceSidebarForm a {
    color: #1d4ed8 !important;
  }
  .embeddedServiceSidebar a:hover {
    color: #1e3a8a !important;
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
        console.error('Error loading Embedded Messaging: ', err)
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
