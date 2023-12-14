import { NextFetchEvent } from 'next/server'
import { ExtendedNextReq, MiddlewareFactory, NextMiddleware } from './types'

export const withUserIp: MiddlewareFactory = (next: NextMiddleware) => {
  return async (request: ExtendedNextReq, _next: NextFetchEvent) => {
    let ip = request.ip ?? request.headers.get('x-real-ip')
    const forwardedFor = request.headers.get('x-forwarded-for')
    if (!ip && forwardedFor) ip = forwardedFor.split(',').at(0) ?? ip

    // eslint-disable-next-line no-param-reassign
    request.p_user_ip = ip
    return next(request, _next)
  }
}
