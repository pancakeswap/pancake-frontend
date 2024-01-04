import { shouldGeoBlock } from '@pancakeswap/utils/geoBlock'
import { NextRequest, NextResponse } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const isNeedBlockUsIp = req.nextUrl.pathname.startsWith('/farms') && req?.geo?.country === 'US'

  if (shouldGeoBlock(req.geo) || isNeedBlockUsIp) {
    return NextResponse.redirect(new URL('/451', req.url))
  }

  return res
}

export const config = {
  matcher: ['/', '/swap', '/liquidity', '/pools', '/farms', '/add', '/ifo', '/remove'],
}
