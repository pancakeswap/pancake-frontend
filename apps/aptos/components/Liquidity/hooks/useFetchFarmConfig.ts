import { getFarmConfig } from '@pancakeswap/farms/constants'
import { deserializeToken } from '@pancakeswap/token-lists'
import useSWRImmutable from 'swr/immutable'

import { Token } from '@pancakeswap/sdk'

export default function useFetchFarmConfig(chainId) {
  return useSWRImmutable(chainId ? ['track-farms-pairs', chainId] : null, async () => {
    const farms = await getFarmConfig(chainId)
    const fFarms: [Token, Token][] = farms
      .filter((farm) => farm.pid !== 0)
      .map((farm) => [deserializeToken(farm.token), deserializeToken(farm.quoteToken)])
    return fFarms
  })
}
