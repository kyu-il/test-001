import { NextRequest, NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';
import { sessionOptions, type AppSession } from '@/lib/session';

export async function GET(req: NextRequest) {
  const res = NextResponse.redirect(new URL('/login', req.url));
  const session = await getIronSession<AppSession>(req, res, sessionOptions);
  session.destroy();
  return res;
}
