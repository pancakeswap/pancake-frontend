import { Router } from 'itty-router'
import { missing, error } from 'itty-router-extras'

const ALLOW = /[^\w](?:pancake\.run|localhost:3000|pancakeswap\.finance|pancakeswap\.com)$/

function isString(s: any): s is string {
  return typeof s === 'string' || s instanceof String
}

export function isOriginAllowed(origin: string | null, allowedOrigin: any) {
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
const _corsMethods = `POST, OPTIONS`
const _corsHeaders = `referer, origin, content-type, x-sf`
export const handleCors = (allowedOrigin: any) => (request: Request) => {
  const reqOrigin = request.headers.get('origin')
  const isAllowed = isOriginAllowed(reqOrigin, allowedOrigin)
  if (isAllowed && reqOrigin) {
    const corsHeaders = {
      'Access-Control-Allow-Origin': reqOrigin,
      'Access-Control-Allow-Methods': _corsMethods,
      'Access-Control-Allow-Headers': _corsHeaders,
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
      Allow: _corsMethods,
    },
  })
}

export const wrapCorsHeader = (request: Request, response: Response, options: any = {}) => {
  const { allowedOrigin = '*' } = options
  const reqOrigin = request.headers.get('origin')
  const isAllowed = isOriginAllowed(reqOrigin, allowedOrigin)
  const newResponse = new Response(response.body, response)

  newResponse.headers.set('Access-Control-Allow-Origin', isAllowed ? reqOrigin || '' : '')

  return newResponse
}

const router = Router()

router.post('/bsc-exchange', async (request, _, headers: Headers) => {
  const ip = headers.get('X-Forwarded-For') || headers.get('Cf-Connecting-Ip') || ''
  const isLocalHost = headers.get('origin') === 'http://localhost:3000'
  const body = (await request.text?.()) as any

  if (!body) return error(400, 'Missing body')

  const response = await fetch(NODE_REAL_DATA_ENDPOINT, {
    headers: {
      'X-Forwarded-For': ip,
      origin: isLocalHost ? 'https://pancakeswap.finance' : headers.get('origin') || '',
    },
    body,
    method: 'POST',
  })

  return response
})

router.options('*', handleCors(ALLOW))

router.all('*', () => missing('Not found'))

addEventListener('fetch', (event) =>
  event.respondWith(
    router
      .handle(event.request, event, event.request.headers)
      .then((res) => wrapCorsHeader(event.request, res, { allowedOrigin: ALLOW })),
  ),
)
