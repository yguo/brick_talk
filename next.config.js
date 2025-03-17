/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost', 'images.unsplash.com'],
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
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
  assetPrefix: '',
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
  // Enable static exports for Cloudflare Pages
  experimental: {
    isrMemoryCacheSize: 0,
  },
}

module.exports = nextConfig 