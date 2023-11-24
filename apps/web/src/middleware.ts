import { NextResponse } from 'next/server'
import { shouldGeoBlock } from '@pancakeswap/utils/geoBlock'
import { withContext } from './context'

export default withContext('userIp', (setContext, req) => {
  // const userIp = ip.address()
  setContext('userIp', req.ip ?? 'test')
  if (shouldGeoBlock(req.geo)) {
    return NextResponse.redirect(new URL('/451', req.url))
  }
  return NextResponse.next()
})

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
  runtime: 'nodejs',
}
