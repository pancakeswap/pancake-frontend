import { shouldGeoBlock } from '@pancakeswap/utils/geoBlock'
import { NextFetchEvent, NextRequest, NextResponse } from 'next/server'
import { MiddlewareFactory } from './types'

export const withGeoBlock: MiddlewareFactory = () => {
  return async (request: NextRequest, _next: NextFetchEvent) => {
    const res = NextResponse.next()

    if (shouldGeoBlock(request.geo)) {
      return NextResponse.redirect(new URL('/451', request.url))
    }

    return res
  }
}
