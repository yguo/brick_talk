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

// 更新 matcher 配置，确保不会拦截 API 请求
export const config = {
  matcher: [
    // 只匹配根路径
    '/'
  ],
} 