// middleware.ts
import { withABTesting } from 'middlewares/ab-test-middleware'
import { withGeoBlock } from 'middlewares/geo-block-middleware'
import { withUserIp } from 'middlewares/ip-address-middleware'
import { stackMiddlewares } from 'middlewares/stack-middleware'

export default stackMiddlewares([withGeoBlock, withUserIp, withABTesting])

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
