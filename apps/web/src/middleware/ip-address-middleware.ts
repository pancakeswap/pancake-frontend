import { NextFetchEvent, NextMiddleware, NextRequest, NextResponse } from 'next/server'
import { shouldGeoBlock } from '@pancakeswap/utils/geoBlock'
import { MiddlewareFactory } from './types'

export const withUserIpHeaders: MiddlewareFactory = (next: NextMiddleware) => {
  return async (request: NextRequest, _next: NextFetchEvent) => {
    let ip = request.ip ?? request.headers.get('x-real-ip')
    const forwardedFor = request.headers.get('x-forwarded-for')

    if (!ip && forwardedFor) ip = forwardedFor.split(',').at(0) ?? 'Unknown'
    if (!ip) return NextResponse.next()

    request.headers.set('user-ip', ip)
    const res = await next(request, _next)
    return res
  }
}
