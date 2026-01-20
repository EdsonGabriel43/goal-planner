import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
    const res = NextResponse.next()

    // Create a Supabase client configured to use cookies
    const supabase = createMiddlewareClient({ req, res })

    // Refresh session if expired - required for Server Components
    const {
        data: { session },
    } = await supabase.auth.getSession()

    const path = req.nextUrl.pathname

    // If user is not signed in and tries to access the planner (root), redirect to login
    if (!session && path === '/') {
        return NextResponse.redirect(new URL('/login', req.url))
    }

    // If user IS signed in and tries to access login, redirect to planner
    if (session && path === '/login') {
        return NextResponse.redirect(new URL('/', req.url))
    }

    return res
}

export const config = {
    matcher: ['/', '/login'],
}
