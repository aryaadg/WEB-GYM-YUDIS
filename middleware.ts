import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Cek session dari cookie JWT langsung (tanpa network call ke Supabase)
// Ini jauh lebih cepat dan mencegah timeout di Vercel
function hasSession(req: NextRequest): boolean {
  // Supabase menyimpan session di cookie dengan prefix 'sb-'
  const cookies = req.cookies.getAll()
  return cookies.some(c =>
    c.name.startsWith('sb-') && c.name.endsWith('-auth-token')
  )
}

export function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname
  const session = hasSession(req)

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
    const url = req.nextUrl.clone()
    url.pathname = '/member/dashboard'
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/member/:path*'],
}
