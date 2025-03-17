import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // 获取请求的路径
  const path = request.nextUrl.pathname

  // 如果是根路径，重定向到 Homepage
  if (path === '/') {
    return NextResponse.redirect(new URL('/Homepage', request.url))
  }

  // 继续处理其他请求
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
} 