// middleware.ts
import { withABHeaders } from 'middlewares/ab-test-middleware'
import { withGeoBlock } from 'middlewares/geo-block-middleware'
import { withUserIpHeaders } from 'middlewares/ip-address-middleware'
import { stackMiddlewares } from 'middlewares/stack-middleware'

const middlewares = [withGeoBlock, withUserIpHeaders, withABHeaders]
export default stackMiddlewares(middlewares)

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
