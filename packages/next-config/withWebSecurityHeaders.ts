import type { NextConfig } from 'next'

type Headers = Awaited<ReturnType<NonNullable<NextConfig['headers']>>>

// function createCSP() {
//   const IFRAME_WHITE_LIST = ['https://*.safe.global']
//
//   const rules = [`frame-ancestors 'self' ${IFRAME_WHITE_LIST.join(' ')}`, 'report-uri /api/_report/csp']
//
//   return {
//     key: 'Content-Security-Policy',
//     value: rules.join('; '),
//   }
// }

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
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          // createCSP(),
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
