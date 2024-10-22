import { shouldGeoBlock } from '@pancakeswap/utils/geoBlock'
import { geolocation } from '@vercel/functions'
import { NextRequest, NextResponse } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()

  if (shouldGeoBlock(geolocation(req))) {
    return NextResponse.redirect(new URL('/451', req.url))
  }

  return res
}

export const config = {
  matcher: ['/', '/swap', '/liquidity', '/pools', '/farms', '/add', '/ifo', '/remove'],
}
