import { NextRequest, NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';
import { createClient } from '@supabase/supabase-js';
import { sessionOptions, type AppSession } from '@/lib/session';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const error = searchParams.get('error');

  const loginUrl = new URL('/login', req.url);

  if (error || !code || !state) {
    loginUrl.searchParams.set('error', 'auth_denied');
    return NextResponse.redirect(loginUrl);
  }

  // Read stored oauthState from session cookie
  const tempRes = new NextResponse();
  const session = await getIronSession<AppSession>(req, tempRes, sessionOptions);

  if (state !== session.oauthState) {
    loginUrl.searchParams.set('error', 'invalid_state');
    return NextResponse.redirect(loginUrl);
  }

  try {
    // Step 4: Exchange code for access token
    const tokenRes = await fetch(`${process.env.OAUTH_HOST}/oauth/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: process.env.OAUTH_CLIENT_ID!,
        client_secret: process.env.OAUTH_CLIENT_SECRET!,
        code,
        grant_type: 'authorization_code',
        redirect_uri: process.env.OAUTH_REDIRECT_URI!
      })
    });

    if (!tokenRes.ok) throw new Error(`token_exchange: ${tokenRes.status}`);
    const { access_token } = await tokenRes.json();

    // Step 5: Fetch user info
    const userRes = await fetch(`${process.env.OAUTH_HOST}/api/user`, {
      headers: { Authorization: `Bearer ${access_token}` }
    });
    if (!userRes.ok) throw new Error(`user_fetch: ${userRes.status}`);
    const oauthUser = await userRes.json();

    // Step 6: Upsert user in Supabase
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data: dbUser, error: dbError } = await supabase
      .from('users')
      .upsert(
        {
          oauth_id: oauthUser.id,
          group_id: oauthUser.group_id,
          account: oauthUser.account,
          name: oauthUser.name,
          email: oauthUser.email,
          profile_photo_url: oauthUser.profile_photo_url,
          updated_at: new Date().toISOString()
        },
        { onConflict: 'oauth_id' }
      )
      .select()
      .single();

    if (dbError) throw dbError;

    // Write session to redirect response
    const finalRes = NextResponse.redirect(new URL('/', req.url));
    const newSession = await getIronSession<AppSession>(req, finalRes, sessionOptions);
    newSession.user = {
      id: dbUser.id,
      oauthId: oauthUser.id,
      account: oauthUser.account,
      name: oauthUser.name,
      email: oauthUser.email,
      profilePhotoUrl: oauthUser.profile_photo_url
    };
    newSession.accessToken = access_token;
    delete newSession.oauthState;
    await newSession.save();

    return finalRes;
  } catch (err) {
    console.error('OAuth callback error:', err);
    loginUrl.searchParams.set('error', 'server_error');
    return NextResponse.redirect(loginUrl);
  }
}
