import { NextFetchEvent, NextRequest, NextResponse } from 'next/server'
import { geolocation } from '@vercel/functions'
import { shouldGeoBlock } from '@pancakeswap/utils/geoBlock'
import { MiddlewareFactory, NextMiddleware } from './types'

export const withGeoBlock: MiddlewareFactory = (next: NextMiddleware) => {
  return async (request: NextRequest, _next: NextFetchEvent) => {
    if (shouldGeoBlock(geolocation(request))) {
      return NextResponse.redirect(new URL('/451', request.url))
    }
    return next(request, _next)
  }
}
