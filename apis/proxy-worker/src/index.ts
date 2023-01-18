import { Router } from 'itty-router'
import { missing, error } from 'itty-router-extras'
import { CORS_ALLOW, handleCors, wrapCorsHeader } from '@pancakeswap/worker-utils'

const _corsMethods = `POST, OPTIONS`
const _corsHeaders = `referer, origin, content-type, x-sf`

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

router.options('*', handleCors(CORS_ALLOW, _corsMethods, _corsHeaders))

router.all('*', () => missing('Not found'))

addEventListener('fetch', (event) =>
  event.respondWith(
    router
      .handle(event.request, event, event.request.headers)
      .then((res) => wrapCorsHeader(event.request, res, { allowedOrigin: CORS_ALLOW })),
  ),
)
