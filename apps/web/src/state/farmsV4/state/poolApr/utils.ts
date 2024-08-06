import type { Address } from 'viem/accounts'
import type { PoolApr } from './atom'

export const getCombinedApr = (aprMap: PoolApr, chainId: number, address: Address) => {
  const apr = aprMap[`${chainId}:${address}`] ?? { lpApr: '0', cakeApr: { value: '0' }, merklApr: '0' }
  return Number(apr.lpApr ?? 0) + Number(apr.cakeApr?.value ?? 0) + Number(apr.merklApr ?? 0)
}
