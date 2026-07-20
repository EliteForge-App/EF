import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'

const webRoot = path.dirname(fileURLToPath(import.meta.url))
const monorepoRoot = path.join(webRoot, '../..')
const tracingRoot = fs.existsSync(path.join(monorepoRoot, 'package.json'))
  ? monorepoRoot
  : webRoot

const isProd = process.env.NODE_ENV === 'production'

/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    root: tracingRoot,
  },
  outputFileTracingRoot: tracingRoot,
  images: {
    unoptimized: true,
  },
  env: {
    NEXT_PUBLIC_BUILD_ID: process.env.NEXT_PUBLIC_BUILD_ID || new Date().toISOString(),
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.API_GATEWAY_URL ?? 'http://localhost:3000'}/api/:path*`,
      },
    ]
  },
  async headers() {
    const headers = [
      {
        source:
          '/((?!_next/static|_next/image|favicon.ico|icon.svg|hero-player.svg).*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, no-cache, must-revalidate, proxy-revalidate',
          },
          { key: 'Pragma', value: 'no-cache' },
        ],
      },
    ]

    // Solo en prod. En dev, Next gestiona /_next/static; si forzamos
    // immutable + nombres de chunk estables de Turbopack, el browser
    // conserva JS viejo (p. ej. sidebar sin Analíticas).
    if (isProd) {
      headers.push({
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      })
    }

    return headers
  },
}

export default nextConfig
