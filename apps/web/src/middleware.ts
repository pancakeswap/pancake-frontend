import { shouldGeoBlock } from '@pancakeswap/utils/geoBlock'
import { NextRequest, NextResponse } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()

  if (shouldGeoBlock(req.geo)) {
    return NextResponse.redirect(new URL('/451', req.url))
  }

  if (req.url.includes('/gauges-voting')) {
    return NextResponse.redirect(new URL('/404', req.url))
  }

  return res
}

export const config = {
  matcher: [
    '/',
    '/swap',
    '/liquidity',
    '/pools',
    '/cake-staking',
    '/gauges-voting',
    '/farms',
    '/add',
    '/ifo',
    '/remove',
    '/prediction',
    '/find',
    '/limit-orders',
    '/lottery',
    '/nfts',
    '/info/:path*',
  ],
}
