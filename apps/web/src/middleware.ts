// middleware.ts
import { withABHeaders } from 'middleware/ab-test-middleware'
import { withGeoBlock } from 'middleware/geo-block-middleware'
import { withUserIpHeaders } from 'middleware/ip-address-middleware'
import { stackMiddlewares } from 'middleware/stack-middleware'

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
