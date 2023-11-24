import { NextResponse, NextRequest, NextFetchEvent } from 'next/server'

const ctxKey = (key: string): string => `ctx-${key.toLowerCase()}`

export const getContext = (req: NextRequest, rawKey: string): string | null => {
  const key = ctxKey(rawKey)

  let headerValue = req.headers.get(key)

  // Necessary for node in development environment
  if (!headerValue) {
    headerValue = (req as unknown as any).socket?._httpMessage?.getHeader(key)
  }

  if (headerValue) {
    return headerValue
  }

  // need to Use a dummy url because some environments only return
  // a path, not the full url
  const reqURL = new URL(req.url, 'http://dummy.url')

  return reqURL.searchParams.get(key)
}

export const withContext = (
  key: string,
  middleware: (
    setContext: (rawKey: string, value: string) => void,
    req: NextRequest,
    evt: NextFetchEvent,
  ) => NextResponse | void,
) => {
  // Normalize allowed keys
  // eslint-disable-next-line no-param-reassign
  key = ctxKey(key)

  return (req: NextRequest, evt: NextFetchEvent): NextResponse | void => {
    const reqURL = new URL(req.url)

    // First, make sure key isn't being spoofed.
    if (req.headers.get(key) || reqURL.searchParams.get(key)) {
      throw new Error(`Key ${key.substring(4)} is being spoofed. Blocking this request.`)
    }

    const data: Record<string, string> = {}

    const setContext = (rawKey: string, value: string): void => {
      const ctxkey = ctxKey(rawKey)
      if (key !== ctxkey) {
        throw new Error(`Key ${rawKey} is not allowed. Add it to withContext's first argument.`)
      }
      if (typeof value !== 'string') {
        throw new Error(`Value for ${rawKey} must be a string, received ${typeof value}`)
      }
      data[ctxkey] = value
    }

    const res = middleware(setContext, req, evt) || NextResponse.next()

    if (Object.keys(data).length === 0) return res

    // Don't modify redirects
    if (res.headers.get('Location')) return res

    const rewriteURL = new URL(res.headers.get('x-middleware-rewrite') || req.url)
    if (reqURL.origin !== rewriteURL.origin) return res

    // eslint-disable-next-line guard-for-in
    for (const ipkey in data) {
      res.headers.set(ipkey, data[ipkey])
      rewriteURL.searchParams.set(ipkey, data[ipkey])
    }

    // set the updated rewrite url
    res.headers.set('x-middleware-rewrite', rewriteURL.href)

    return res
  }
}
