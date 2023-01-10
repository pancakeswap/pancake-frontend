import { Router } from 'itty-router'
import { v4 as uuid } from 'uuid'
import { z } from 'zod'
import { missing, error } from 'itty-router-extras'
import { CORS_ALLOW, handleCors, wrapCorsHeader } from '@pancakeswap/worker-utils'

const _corsMethods = `GET, OPTIONS`
const _corsHeaders = `referer, origin, content-type`

const appId = '13cc90dc5ffa4032acb3'
const appSecret = AD_APP_SECRET
const host = 'https://avengerdao.org'
const url = '/api/v1/address-security'
const endpoint = host + url

function bytes2hex(bytes: ArrayBuffer) {
  return [...new Uint8Array(bytes)].map((b) => b.toString(16).padStart(2, '0')).join('')
}

const hmacSha256ToHex = async (key: string, message: string) => {
  const getUtf8Bytes = (str: string) =>
    new Uint8Array([...unescape(encodeURIComponent(str))].map((c) => c.charCodeAt(0)))

  const keyBytes = getUtf8Bytes(key)
  const messageBytes = getUtf8Bytes(message)

  const cryptoKey = await crypto.subtle.importKey('raw', keyBytes, { name: 'HMAC', hash: 'SHA-256' }, true, ['sign'])
  const sig = await crypto.subtle.sign('HMAC', cryptoKey, messageBytes)

  return bytes2hex(sig)
}

const router = Router()

const zChainId = z.enum(['56'])

const zAddress = z.string().regex(/^0x[a-fA-F0-9]{40}$/)

const zParams = z.object({
  chainId: zChainId,
  address: zAddress,
})

router.get('/:chainId/:address', async (request, _) => {
  const parsed = zParams.safeParse(request.params)
  if (!parsed.success) return error(400, parsed.error.message)
  const { chainId, address } = parsed.data
  const timeStamp = Date.now().toString()
  const nonce = uuid().replace('-', '')
  const method = 'POST'
  const body = JSON.stringify({
    address,
    chainId,
  })
  const key = [appId, timeStamp, nonce, method, url, body].join(';')
  const signature = await hmacSha256ToHex(key, appSecret)

  const response = await fetch(endpoint, {
    headers: {
      'X-Signature-appid': appId,
      'X-Signature-timestamp': timeStamp,
      'X-Signature-nonce': nonce,
      'X-Signature-signature': signature,
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
