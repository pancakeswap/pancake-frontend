import { useQuery } from '@tanstack/react-query'
import { v2BCakeWrapperABI } from 'config/abi/v2BCakeWrapper'
import { publicClient } from 'utils/viem'
import { Address } from 'viem'

export const getBCakeWrapperInfo = async (chainId: number, bCakeWrapperAddress: Address) => {
  const [rewardPerSecond] = await publicClient({ chainId }).multicall({
    contracts: [
      {
        address: bCakeWrapperAddress,
        functionName: 'rewardPerSecond',
        abi: v2BCakeWrapperABI,
      },
    ],
    allowFailure: false,
  })

  return { rewardPerSecond }
}

export const useBCakeWrapperRewardPerSecond = (chainId?: number, bCakeWrapperAddress?: Address) => {
  return useQuery({
    queryKey: ['bCakeWrapperRewardPerSecond', chainId, bCakeWrapperAddress],
    queryFn: () => getBCakeWrapperInfo(chainId!, bCakeWrapperAddress!),
    enabled: !!chainId && !!bCakeWrapperAddress,
    select(data) {
      return data.rewardPerSecond
    },
  })
}
