// middleware.ts
import { withABHeaders } from 'middleware/ab-test-middleware'
import { withGeoBlock } from 'middleware/geo-block-middleware'
import { NextResponse } from 'next/server'

export function defaultMiddleware() {
  return NextResponse.next()
}
export default withGeoBlock(withABHeaders(defaultMiddleware))

export const config = {
  matcher: [
    '/',
    '/swap',
    '/liquidity',
    '/pools',
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
