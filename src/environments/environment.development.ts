const devBackendHost = globalThis.location?.hostname || 'localhost';

export const environment = {
  production: false,
  apiUrl: `http://${devBackendHost}:5150/api/v1`,
  defaultTenantSlug: 'arenasports'
};
