import type { NextConfig } from 'next'

type Headers = Awaited<ReturnType<NonNullable<NextConfig['headers']>>>

type Header = Headers[0]

type HeaderArray = Headers[0]['headers']

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
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin',
          },
          // createCSP(),
        ],
      },
    ]

    if (typeof originalHeaders !== 'function') {
      return mergeHeaders(headers, originalHeaders)
    }
    const customHeaders = await originalHeaders()
    return mergeHeaders(headers, customHeaders)
  }
  return config
}

function mergeHeaders(a: Headers, b: Headers): Headers {
  const headerMap = new Map<string, Header>()

  a.forEach((header) => {
    headerMap.set(header.source, { ...header })
  })

  b.forEach((header) => {
    const existingHeader = headerMap.get(header.source)

    if (existingHeader) {
      const mergedHeaders = mergeHeadersArray(existingHeader.headers, header.headers)
      headerMap.set(header.source, {
        ...existingHeader,
        ...header,
        headers: mergedHeaders,
      })
    } else {
      headerMap.set(header.source, { ...header })
    }
  })

  return Array.from(headerMap.values())
}

function mergeHeadersArray(aHeaders: HeaderArray, bHeaders: HeaderArray): HeaderArray {
  const headerMap = new Map<string, string>()

  aHeaders.forEach((header) => {
    headerMap.set(header.key, header.value)
  })

  bHeaders.forEach((header) => {
    headerMap.set(header.key, header.value)
  })

  return Array.from(headerMap.entries()).map(([key, value]) => ({ key, value }))
}
