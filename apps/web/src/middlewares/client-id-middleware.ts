import { NextFetchEvent, NextResponse } from 'next/server'
import { v4 } from 'uuid'
import { ExtendedNextReq, MiddlewareFactory, NextMiddleware } from './types'

export const withClientId: MiddlewareFactory = (next: NextMiddleware) => {
  return async (request: ExtendedNextReq, _next: NextFetchEvent) => {
    const response = (await next(request, _next)) || NextResponse.next()

    const clientIdCookie = request.cookies.get('client-id')
    if (clientIdCookie) {
      response.cookies.set('client-id', clientIdCookie.value)
      return response
    }

    const randomId = v4()
    response.cookies.set('client-id', randomId)
    return response
  }
}
