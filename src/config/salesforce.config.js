const salesforceConfig = {
  LOGIN_URL: import.meta.env.VITE_SF_LOGIN_URL || 'https://login.salesforce.com',
  CLIENT_ID: import.meta.env.VITE_SF_CLIENT_ID || '',
  CLIENT_SECRET: import.meta.env.VITE_SF_CLIENT_SECRET || '',
  USERNAME: import.meta.env.VITE_SF_USERNAME || '',
  PASSWORD: import.meta.env.VITE_SF_PASSWORD || '',
  API_VERSION: import.meta.env.VITE_SF_API_VERSION || 'v59.0',
  USE_MOCK_DATA: import.meta.env.VITE_USE_MOCK_DATA !== 'false',

  // OAuth endpoints
  TOKEN_URL: `${import.meta.env.VITE_SF_LOGIN_URL || 'https://login.salesforce.com'}/services/oauth2/token`,

  // API paths (appended to instance_url after auth)
  API_BASE_PATH: `/services/data/${import.meta.env.VITE_SF_API_VERSION || 'v59.0'}`,
  SOBJECT_PATH: `/services/data/${import.meta.env.VITE_SF_API_VERSION || 'v59.0'}/sobjects`,
  QUERY_PATH: `/services/data/${import.meta.env.VITE_SF_API_VERSION || 'v59.0'}/query`,
}

export default salesforceConfig
