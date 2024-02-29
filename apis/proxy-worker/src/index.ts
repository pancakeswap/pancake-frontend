import { CORS_ALLOW, handleCors, wrapCorsHeader } from '@pancakeswap/worker-utils'
import { Router } from 'itty-router'
import { error, missing } from 'itty-router-extras'

const _corsMethods = `POST, OPTIONS`
const _corsHeaders = `referer, origin, content-type, x-sf`

const router = Router()

function createEndpoint(url: string) {
  return async (request: Request, _: any, headers: Headers) => {
    const ip = headers.get('X-Forwarded-For') || headers.get('Cf-Connecting-Ip') || ''
    const isLocalHost = headers.get('origin') === 'http://localhost:3000'
    const body = (await request.text?.()) as any

    if (!body) return error(400, 'Missing body')

    const response = await fetch(url, {
      headers: {
        'X-Forwarded-For': ip,
        origin: isLocalHost ? 'https://pancakeswap.finance' : headers.get('origin') || '',
      },
      body,
      method: 'POST',
    })

    return response
  }
}

router.post('/bsc-exchange', createEndpoint(NODE_REAL_DATA_ENDPOINT))

router.post('/opbnb-exchange-v3', createEndpoint(OPBNB_ENDPOINT))

router.options('*', handleCors(CORS_ALLOW, _corsMethods, _corsHeaders))

router.all('*', () => missing('Not found'))

addEventListener('fetch', (event) =>
  event.respondWith(
    router
      .handle(event.request, event, event.request.headers)
      .then((res) => wrapCorsHeader(event.request, res, { allowedOrigin: CORS_ALLOW })),
  ),
)
