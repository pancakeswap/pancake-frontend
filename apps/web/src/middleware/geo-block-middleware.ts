import { NextFetchEvent, NextMiddleware, NextRequest, NextResponse } from 'next/server'
import { shouldGeoBlock } from '@pancakeswap/utils/geoBlock'
import { MiddlewareFactory } from './types'

export const withGeoBlock: MiddlewareFactory = (next: NextMiddleware) => {
  return async (request: NextRequest, _next: NextFetchEvent) => {
    const res = await next(request, _next)

    if (shouldGeoBlock(request.geo)) {
      return NextResponse.redirect(new URL('/451', request.url))
    }

    return res
  }
}
