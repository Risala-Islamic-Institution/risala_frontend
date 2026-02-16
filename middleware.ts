import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    const token = request.cookies.get('risala_token')?.value

    // Protected Routes
    const isDashboard = request.nextUrl.pathname.startsWith('/dashboard')
    const isAuthPage = request.nextUrl.pathname.startsWith('/login') || request.nextUrl.pathname.startsWith('/register')

    // Redirect to login if accessing dashboard without token
    if (isDashboard && !token) {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    // Redirect to dashboard if accessing auth pages with token
    // Use a generic dashboard redirect, the client-side AuthGuard will handle role-based routing
    if (isAuthPage && token) {
        return NextResponse.redirect(new URL('/dashboard/student', request.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/dashboard/:path*', '/login', '/register'],
}
