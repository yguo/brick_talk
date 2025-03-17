/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost', 'images.unsplash.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: '*.pages.dev',
      }
    ],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack']
    });
    return config;
  },
  // 配置静态资源前缀
  basePath: '',
  assetPrefix: process.env.NEXT_PUBLIC_BASE_PATH || '',
  // 配置公共目录
  publicRuntimeConfig: {
    staticFolder: '/public',
  },
  // 添加重写规则，将 /avatars/* 重定向到正确的路径
  async rewrites() {
    return [
      {
        source: '/avatars/:path*',
        destination: '/public/avatars/:path*',
      },
    ];
  },
  // Cloudflare Pages specific configuration
  output: 'standalone',
  // Cloudflare Pages optimizations
  experimental: {
    isrMemoryCacheSize: 0,
  },
  // 优化构建输出
  poweredByHeader: false,
  generateEtags: true,
  compress: true,
  productionBrowserSourceMaps: false,
}

module.exports = nextConfig 