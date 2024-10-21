import { NextFetchEvent } from 'next/server'
import { ipAddress } from '@vercel/functions'
import { ExtendedNextReq, MiddlewareFactory, NextMiddleware } from './types'

export const withUserIp: MiddlewareFactory = (next: NextMiddleware) => {
  return async (request: ExtendedNextReq, _next: NextFetchEvent) => {
    let ip = ipAddress(request) ?? request.headers.get('x-real-ip')
    const forwardedFor = request.headers.get('x-forwarded-for')
    if (!ip && forwardedFor) ip = forwardedFor.split(',').at(0) ?? ip

    // eslint-disable-next-line no-param-reassign
    request.userIp = ip
    return next(request, _next)
  }
}
