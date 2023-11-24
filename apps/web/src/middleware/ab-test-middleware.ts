// middlewares/withHeaders.ts
import { NextFetchEvent, NextMiddleware, NextRequest, NextResponse } from 'next/server'
import { MiddlewareFactory } from './types'

export const generateUserDeterministicValue = async (
  userIp: string | null,
): Promise<{ userABtestDeterministicResult: number }> => {
  // if ip fails for some reason default to not show user
  if (!userIp) return { userABtestDeterministicResult: 0 }
  const msgBuffer = new TextEncoder().encode(userIp)
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer)

  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')

  const lastByteValue = parseInt(hashHex.slice(-2), 16) / 255
  return { userABtestDeterministicResult: lastByteValue }
}

export const withABHeaders: MiddlewareFactory = () => {
  return async (request: NextRequest, _next: NextFetchEvent) => {
    let ip = request.ip ?? request.headers.get('x-real-ip')
    const forwardedFor = request.headers.get('x-forwarded-for')

    if (!ip && forwardedFor) {
      ip = forwardedFor.split(',').at(0) ?? 'Unknown'
    }
    const userABResultKey = 'ctx-user-ab-test-deterministic-result'
    const { userABtestDeterministicResult } = await generateUserDeterministicValue(ip)

    if (request.headers.get(userABResultKey)) {
      throw new Error(`Key ${userABResultKey.substring(4)} is being spoofed. Blocking this request.`)
    }

    const requestHeaders = new Headers(request.headers)
    requestHeaders.set(userABResultKey, userABtestDeterministicResult.toString())

    const response = NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    })

    return response
  }
}
