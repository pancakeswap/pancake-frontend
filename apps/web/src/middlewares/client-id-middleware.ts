/* eslint-disable no-param-reassign */
import { NextFetchEvent, NextResponse } from 'next/server'
import { v4 } from 'uuid'
import { ONE_YEAR_MILLISECONDS } from './constants'
import { ExtendedNextReq, MiddlewareFactory, NextMiddleware } from './types'

const clientCookieOptions = { httpOnly: true, secure: true, maxAge: ONE_YEAR_MILLISECONDS }

export const withClientId: MiddlewareFactory = (next: NextMiddleware) => {
  return async (request: ExtendedNextReq, _next: NextFetchEvent) => {
    const randomId = v4()

    const clientIdCookie = request.cookies.get('p_client_id')
    const clientId = clientIdCookie ? clientIdCookie.value : randomId

    request.p_client_id = clientId

    const response = (await next(request, _next)) || NextResponse.next()
    response.cookies.set('p_client_id', clientId, clientCookieOptions)

    return response
  }
}
