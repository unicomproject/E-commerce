const devBackendHost = globalThis.location?.hostname || 'localhost';

export const environment = {
  production: false,
  apiUrl: `http://${devBackendHost}:5150/api/v1`,
  defaultTenantSlug: 'arenasports',
  googleClientId: '458690530104-t47c90k6piid95cf232lsn2gpo2avuat.apps.googleusercontent.com'
};
