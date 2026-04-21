import { NextRequest, NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';
import { sessionOptions, type AppSession } from '@/lib/session';
import crypto from 'crypto';

export async function GET(req: NextRequest) {
  const state = crypto.randomBytes(20).toString('hex');

  const params = new URLSearchParams({
    response_type: 'code',
    client_id: process.env.OAUTH_CLIENT_ID!,
    redirect_uri: process.env.OAUTH_REDIRECT_URI!,
    scope: 'web',
    state
  });

  const authorizeUrl = `${process.env.OAUTH_HOST}/oauth/authorize?${params}`;
  const res = NextResponse.redirect(authorizeUrl);

  const session = await getIronSession<AppSession>(req, res, sessionOptions);
  session.oauthState = state;
  await session.save();

  return res;
}
