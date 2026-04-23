import { ensureFreshTokens } from './auth';

const SANDBOX_BASE = 'https://sandbox-quickbooks.api.intuit.com';
const PRODUCTION_BASE = 'https://quickbooks.api.intuit.com';

function getBaseUrl(): string {
  return process.env.QBO_ENVIRONMENT === 'production' ? PRODUCTION_BASE : SANDBOX_BASE;
}

export async function qboFetch(endpoint: string, params?: Record<string, string>): Promise<unknown> {
  const tokens = await ensureFreshTokens();
  if (!tokens) throw new Error('Not authenticated');

  const baseUrl = getBaseUrl();
  const url = new URL(`/v3/company/${tokens.realmId}${endpoint}`, baseUrl);

  if (params) {
    Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  }

  const res = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${tokens.accessToken}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`QBO API error ${res.status}: ${body}`);
  }

  return res.json();
}
