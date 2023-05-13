import type { NextConfig } from 'next'

type Headers = Awaited<ReturnType<NonNullable<NextConfig['headers']>>>

export function withWebSecurityHeaders(config: NextConfig): NextConfig {
  const originalHeaders = config.headers || []
  // eslint-disable-next-line no-param-reassign
  config.headers = async () => {
    const headers: Headers = [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ]

    if (typeof originalHeaders !== 'function') {
      return [...headers, ...originalHeaders]
    }
    const customHeaders = await originalHeaders()
    return [...headers, ...customHeaders]
  }
  return config
}
