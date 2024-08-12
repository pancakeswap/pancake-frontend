import { BCakeWrapperFarmConfig } from '@pancakeswap/farms'
import { useQuery } from '@tanstack/react-query'
import { Address } from 'viem'
import { getAccountV2FarmingBCakeWrapperEarning } from '../fetcher'

export const useAccountV2PendingCakeReward = (
  account: Address | undefined,
  bCakeWrapperConfig: Partial<BCakeWrapperFarmConfig>,
) => {
  return useQuery({
    queryKey: [
      'accountV2PendingCakeReward',
      account,
      bCakeWrapperConfig.chainId,
      bCakeWrapperConfig.bCakeWrapperAddress,
    ],
    queryFn: () =>
      getAccountV2FarmingBCakeWrapperEarning(bCakeWrapperConfig.chainId!, account!, [
        bCakeWrapperConfig as BCakeWrapperFarmConfig,
      ]),
    enabled: Boolean(account && bCakeWrapperConfig.chainId && bCakeWrapperConfig.bCakeWrapperAddress),
    select: (data) => data?.[0],
  })
}
