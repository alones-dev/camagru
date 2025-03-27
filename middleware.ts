import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
    const token = await getToken({ req: request });

    if (token) {
        if (request.nextUrl.pathname === '/' || request.nextUrl.pathname === '/register') {
            return NextResponse.redirect(new URL('/home', request.url));
        }
    }
    else {
        if (
            request.nextUrl.pathname.startsWith('/home') ||
            request.nextUrl.pathname.startsWith('/settings')
        ) {
            return NextResponse.redirect(new URL('/', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/", "/home", "/register", "/settings", "/settings/changePassword"],
};