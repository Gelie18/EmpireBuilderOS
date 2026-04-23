import { NextResponse } from 'next/server';
import { getOAuthClient } from '@/lib/qbo/auth';

export async function GET() {
  try {
    const oauthClient = getOAuthClient();

    const authUri = oauthClient.authorizeUri({
      scope: [OAuthClient.scopes.Accounting],
      state: 'bases-loaded-auth',
    });

    return NextResponse.redirect(authUri);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to initiate QBO connection' },
      { status: 500 }
    );
  }
}

// Need to import for scope reference
import OAuthClient from 'intuit-oauth';
