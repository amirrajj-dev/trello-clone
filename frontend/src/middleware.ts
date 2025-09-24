import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import { ENV } from './utils/env';
import { deleteCookie } from './helpers/delete-cookie';

interface JwtPayload {
  email: string;
  name: string;
  sub: string;
  iat: number;
  exp: number;
}

const secret = new TextEncoder().encode(ENV.JWT_SECRET);

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('trello-token')?.value;
  const pathname = request.nextUrl.pathname;

  // No token: Redirect from protected routes
  if (!token) {
    if (pathname === '/') {
      return NextResponse.redirect(new URL('/signin', request.url));
    }
    return NextResponse.next();
  }

  try {
    const { payload } = await jwtVerify<JwtPayload>(token, secret);
    // Expired token
    if (payload.exp < Math.floor(Date.now() / 1000)) {
      const response = NextResponse.redirect(new URL('/signin', request.url));
      await deleteCookie(); // Await it
      return response;
    }
    // Redirect logged-in users from auth pages
    if (pathname.startsWith('/signin') || pathname.startsWith('/signup')) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  } catch (error) {
    // Invalid token: Redirect to signin and clear cookie
    const response = NextResponse.redirect(new URL('/signin', request.url));
    await deleteCookie();
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/signin', '/signup', '/projects/:path*'],
};