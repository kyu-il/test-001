import { NextRequest, NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';
import { sessionOptions, type AppSession } from '@/lib/session';

export async function GET(req: NextRequest) {
  const res = new NextResponse();
  const session = await getIronSession<AppSession>(req, res, sessionOptions);

  if (!session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  return NextResponse.json(session.user);
}
