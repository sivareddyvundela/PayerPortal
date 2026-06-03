import axios from 'axios'
import salesforceConfig from '../config/salesforce.config.js'

/**
 * Salesforce OAuth Authentication Service
 *
 * NOTE ON CORS:
 * Direct browser-to-Salesforce OAuth calls are blocked by CORS in production.
 * To use real Salesforce credentials, you must:
 *   1. Set up a Node.js/Express proxy server that forwards OAuth requests
 *   2. Use Salesforce Experience Cloud / Sites as your backend
 *   3. Use Salesforce Connected App with proper CORS whitelist settings
 *   4. Or implement a backend-for-frontend (BFF) pattern
 *
 * For local development, you can use a CORS proxy or Vite's proxy config.
 */

let cachedToken = null
let tokenExpiry = null

/**
 * Obtain a Salesforce access token using the Username-Password OAuth flow.
 * Returns { access_token, instance_url, token_type, issued_at }
 */
export async function getAccessToken() {
  // Return cached token if still valid (with 5-minute buffer)
  if (cachedToken && tokenExpiry && Date.now() < tokenExpiry - 5 * 60 * 1000) {
    return cachedToken
  }

  const params = new URLSearchParams()
  params.append('grant_type', 'password')
  params.append('client_id', salesforceConfig.CLIENT_ID)
  params.append('client_secret', salesforceConfig.CLIENT_SECRET)
  params.append('username', salesforceConfig.USERNAME)
  params.append('password', salesforceConfig.PASSWORD)

  try {
    const response = await axios.post(salesforceConfig.TOKEN_URL, params, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    })

    cachedToken = {
      access_token: response.data.access_token,
      instance_url: response.data.instance_url,
      token_type: response.data.token_type,
      issued_at: response.data.issued_at,
    }

    // Salesforce tokens are valid for ~2 hours (7200 seconds)
    tokenExpiry = Date.now() + 7200 * 1000

    return cachedToken
  } catch (error) {
    const message = error.response?.data?.error_description || error.message
    throw new Error(`Salesforce authentication failed: ${message}`)
  }
}

/**
 * Clear cached token (call on logout or when token becomes invalid)
 */
export function clearToken() {
  cachedToken = null
  tokenExpiry = null
}

/**
 * Build Authorization header for Salesforce API calls
 */
export async function getAuthHeaders() {
  const { access_token, token_type } = await getAccessToken()
  return {
    Authorization: `${token_type} ${access_token}`,
    'Content-Type': 'application/json',
  }
}
