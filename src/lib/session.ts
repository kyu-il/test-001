import type { SessionOptions } from 'iron-session';

export interface SessionUser {
  id: string;
  oauthId: number;
  account: string;
  name: string;
  email: string;
  profilePhotoUrl: string;
}

export interface AppSession {
  user?: SessionUser;
  accessToken?: string;
  oauthState?: string;
}

export const sessionOptions: SessionOptions = {
  password: process.env.SESSION_SECRET!,
  cookieName: 'app-session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7
  }
};
