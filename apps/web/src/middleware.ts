import { NextResponse } from 'next/server'
import { shouldGeoBlock } from '@pancakeswap/utils/geoBlock'
import { withContext } from './context'

export default withContext('userIp', (setContext, req) => {
  let ip = req.ip ?? req.headers.get('x-real-ip')
  const forwardedFor = req.headers.get('x-forwarded-for')
  if (!ip && forwardedFor) {
    ip = forwardedFor.split(',').at(0) ?? 'Unknown'
  }
  setContext('userIp', ip ?? 'test')
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
  runtime: 'experimental-edge',
}
