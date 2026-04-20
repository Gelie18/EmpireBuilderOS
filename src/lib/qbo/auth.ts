import OAuthClient from 'intuit-oauth';

let oauthClient: OAuthClient | null = null;

export function getOAuthClient(): OAuthClient {
  if (oauthClient) return oauthClient;

  const environment = process.env.QBO_ENVIRONMENT === 'production' ? 'production' : 'sandbox';

  oauthClient = new OAuthClient({
    clientId: process.env.QBO_CLIENT_ID || '',
    clientSecret: process.env.QBO_CLIENT_SECRET || '',
    environment,
    redirectUri: process.env.QBO_REDIRECT_URI || 'http://localhost:3000/api/auth/qbo/callback',
  });

  return oauthClient;
}

// In-memory token store (single-tenant; replace with DB for multi-tenant)
let storedTokens: {
  accessToken: string;
  refreshToken: string;
  realmId: string;
  expiresAt: number;
} | null = null;

export function getStoredTokens() {
  return storedTokens;
}

export function storeTokens(tokens: {
  accessToken: string;
  refreshToken: string;
  realmId: string;
  expiresAt: number;
}) {
  storedTokens = tokens;
}

export function clearTokens() {
  storedTokens = null;
}

export function isAuthenticated(): boolean {
  if (!storedTokens) return false;
  return Date.now() < storedTokens.expiresAt;
}

export async function ensureFreshTokens(): Promise<typeof storedTokens> {
  if (!storedTokens) throw new Error('Not authenticated with QuickBooks');

  // Refresh if within 5 minutes of expiry
  if (Date.now() > storedTokens.expiresAt - 5 * 60 * 1000) {
    const client = getOAuthClient();
    client.setToken({
      access_token: storedTokens.accessToken,
      refresh_token: storedTokens.refreshToken,
      token_type: 'bearer',
      expires_in: 3600,
    });

    const response = await client.refresh();
    const token = response.getJson();

    storedTokens = {
      accessToken: token.access_token,
      refreshToken: token.refresh_token,
      realmId: storedTokens.realmId,
      expiresAt: Date.now() + token.expires_in * 1000,
    };
  }

  return storedTokens;
}
