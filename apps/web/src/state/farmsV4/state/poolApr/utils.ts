import { sumApr } from 'views/universalFarms/utils/sumApr'
import type { Address } from 'viem/accounts'
import type { PoolApr } from './atom'

export const getCombinedApr = (aprMap: PoolApr, chainId: number, address: Address) => {
  const apr = aprMap[`${chainId}:${address}`] ?? { lpApr: '0', cakeApr: { value: '0', boost: '0' }, merklApr: '0' }
  return sumApr(apr.lpApr, apr.cakeApr?.boost ?? apr.cakeApr?.value, apr.merklApr)
}
