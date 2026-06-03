import { useEffect, useState } from 'react'

// Module-level singleton — prevents re-injection across member page navigations
let sfInitialized = false

const THEME_STYLE_ID = 'agentforce-hb-theme'

// Apply HealthBridge branding to SF's native button and chat panel.
// We do NOT hide SF's button — it handles its own open/close interactions.
const themeCSS = `
  /* =========================================================
     Z-index: float above all portal elements
     ========================================================= */
  embeddedservice-chat-button,
  .embeddedServiceHelpButton {
    z-index: 99999 !important;
  }
  .embeddedServiceSidebar,
  .embeddedServiceSidebarMinimizedDefaultUI {
    z-index: 99999 !important;
  }

  /* =========================================================
     HealthBridge blue→teal theme on SF's native FAB
     ========================================================= */
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
  }

  /* Minimized chat bar */
  .embeddedServiceSidebarMinimizedDefaultUI.newDesign,
  .embeddedServiceSidebarMinimizedDefaultUI {
    background: linear-gradient(135deg, #1e40af 0%, #0d9488 100%) !important;
    border-radius: 12px !important;
    box-shadow: 0 4px 20px rgba(30, 64, 175, 0.4) !important;
  }

  /* Chat panel header */
  .embeddedServiceSidebar .dockableContainer .sidebarHeader {
    background: linear-gradient(135deg, #1e40af 0%, #0d9488 100%) !important;
  }
`

function AgentforceChat() {
  // Show our pulsing React FAB only while SF hasn't rendered its own button yet.
  // Once SF's button appears in the DOM, we step aside and return null.
  const [sfReady, setSfReady] = useState(sfInitialized)

  useEffect(() => {
    // Inject theme CSS (idempotent)
    if (!document.getElementById(THEME_STYLE_ID)) {
      const el = document.createElement('style')
      el.id = THEME_STYLE_ID
      el.textContent = themeCSS
      document.head.appendChild(el)
    }

    // Watch for SF injecting its button into the DOM.
    // Once found, hide our loading FAB so SF's button is the sole control.
    const observer = new MutationObserver(() => {
      const sfEl =
        document.querySelector('embeddedservice-chat-button') ||
        document.querySelector('.embeddedServiceHelpButton')
      if (sfEl) {
        setSfReady(true)
        observer.disconnect()
      }
    })
    observer.observe(document.body, { childList: true, subtree: true })

    if (sfInitialized) return () => observer.disconnect()
    sfInitialized = true

    // Assign to window — SF bootstrap calls this via its onload attribute
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
      setSfReady(false)
    }
    document.body.appendChild(script)

    return () => observer.disconnect()
  }, [])

  // SF has rendered its own button — step aside completely
  if (sfReady) return null

  // Loading placeholder: visible only until SF's button appears
  return (
    <div
      style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 99998 }}
      title="Connecting to HealthBridge Agent…"
      aria-label="Loading chat agent"
    >
      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-700 to-teal-600 flex items-center justify-center shadow-lg animate-pulse cursor-wait">
        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z" />
        </svg>
      </div>
    </div>
  )
}

export default AgentforceChat
