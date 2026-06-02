import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  let res = NextResponse.next({
    request: {
      headers: req.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return req.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          req.cookies.set({ name, value, ...options })
          res = NextResponse.next({ request: { headers: req.headers } })
          res.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          req.cookies.set({ name, value: '', ...options })
          res = NextResponse.next({ request: { headers: req.headers } })
          res.cookies.set({ name, value: '', ...options })
        },
      },
    }
  )

  const { data: { session } } = await supabase.auth.getSession()

  const pathname = req.nextUrl.pathname

  // ============================================================
  // Protect ADMIN routes
  // ============================================================
  const isAdminPath = pathname.startsWith('/admin')
  const isAdminLoginPage = pathname === '/admin/login'

  if (isAdminPath && !isAdminLoginPage && !session) {
    const url = req.nextUrl.clone()
    url.pathname = '/admin/login'
    return NextResponse.redirect(url)
  }

  if (isAdminLoginPage && session) {
    const url = req.nextUrl.clone()
    url.pathname = '/admin/dashboard'
    return NextResponse.redirect(url)
  }

  // ============================================================
  // Protect MEMBER routes
  // ============================================================
  const isMemberDashboard = pathname.startsWith('/member/dashboard')
  const isMemberLoginPage = pathname === '/member/login'

  if (isMemberDashboard && !session) {
    const url = req.nextUrl.clone()
    url.pathname = '/member/login'
    return NextResponse.redirect(url)
  }

  if (isMemberLoginPage && session) {
    // Jika sudah login, cek apakah admin atau member
    const url = req.nextUrl.clone()
    url.pathname = '/member/dashboard'
    return NextResponse.redirect(url)
  }

  return res
}

export const config = {
  matcher: ['/admin/:path*', '/member/:path*'],
}
