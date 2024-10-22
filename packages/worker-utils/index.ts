export const CORS_ALLOW = [
  /\.pancake\.run$/,
  /\.pancakeswap\.finance$/,
  /\.pancakeswap\.games$/,
  /\.pancakeswap\.com$/,
  'https://pancakeswap.finance',
  'https://pancakeswap.games',
  'https://pancakeswap.com',
  'https://tgqa.noahlabs.tech',
  'https://tgqa2.noahlabs.tech',
  'https://tg-bot.pancakeswap.ai',
  /^http:\/\/localhost(:\d+)?$/,
]

function isString(s: any): s is string {
  return typeof s === 'string' || s instanceof String
}

export function isOriginAllowed(origin: string | null, allowedOrigin: any) {
  if (allowedOrigin === '*') return true
  if (Array.isArray(allowedOrigin)) {
    for (let i = 0; i < allowedOrigin.length; ++i) {
      if (isOriginAllowed(origin, allowedOrigin[i])) {
        return true
      }
    }
    return false
  }
  if (isString(allowedOrigin)) {
    return origin === allowedOrigin
  }
  if (origin && allowedOrigin instanceof RegExp) {
    return allowedOrigin.test(origin)
  }
  return !!allowedOrigin
}

export const wrapCorsHeader = (request: Request, response: Response, options: any = {}) => {
  const { allowedOrigin = '*' } = options
  const reqOrigin = request.headers.get('origin')
  const isAllowed = isOriginAllowed(reqOrigin, allowedOrigin)
  const newResponse = new Response(response.body, response)

  newResponse.headers.set('Access-Control-Allow-Origin', isAllowed ? reqOrigin || '' : '')

  return newResponse
}

export const handleCors = (allowedOrigin: any, methods: string, headers: string) => (request: Request) => {
  const reqOrigin = request.headers.get('origin')
  const isAllowed = isOriginAllowed(reqOrigin, allowedOrigin)
  if (isAllowed && reqOrigin) {
    const corsHeaders = {
      'Access-Control-Allow-Origin': reqOrigin,
      'Access-Control-Allow-Methods': methods,
      'Access-Control-Allow-Headers': headers,
    }
    // Handle CORS pre-flight request.
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    })
  }
  console.info('Origin not allowed on handleCors', reqOrigin)
  // Handle standard OPTIONS request.
  return new Response(null, {
    headers: {
      Allow: methods,
    },
  })
}
