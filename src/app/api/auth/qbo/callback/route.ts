import { NextRequest, NextResponse } from 'next/server';
import { getOAuthClient, storeTokens } from '@/lib/qbo/auth';

export async function GET(req: NextRequest) {
  try {
    const url = req.url;
    const oauthClient = getOAuthClient();

    const response = await oauthClient.createToken(url);
    const token = response.getJson();

    // Extract realmId from the callback URL
    const callbackUrl = new URL(url);
    const realmId = callbackUrl.searchParams.get('realmId') || '';

    storeTokens({
      accessToken: token.access_token,
      refreshToken: token.refresh_token,
      realmId,
      expiresAt: Date.now() + token.expires_in * 1000,
    });

    // Redirect back to the dashboard
    return NextResponse.redirect(new URL('/dashboard', req.url));
  } catch (error) {
    console.error('QBO OAuth callback error:', error);
    return NextResponse.redirect(
      new URL('/dashboard?error=qbo_auth_failed', req.url)
    );
  }
}
