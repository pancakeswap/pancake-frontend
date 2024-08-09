import { ChainId } from '@pancakeswap/sdk'
import { BIG_ZERO } from '@pancakeswap/utils/bigNumber'
import { useReadContract } from '@pancakeswap/wagmi'
import BigNumber from 'bignumber.js'
import { getQuestRewardAddress } from 'utils/addressHelpers'
import { Address, erc20Abi } from 'viem'
import { useAccount } from 'wagmi'

export const useQuestRewardApprovalStatus = (tokenAddress: Address, chainId: ChainId) => {
  const { address: account } = useAccount()
  const spender = getQuestRewardAddress(chainId)

  const { data, refetch } = useReadContract({
    chainId,
    abi: erc20Abi,
    address: chainId ? tokenAddress : undefined,
    functionName: 'allowance',
    query: {
      enabled: !!account && !!spender,
    },
    args: [account!, spender],
  })

  return {
    isApproved: data ? data > 0 : false,
    allowance: data ? new BigNumber(data?.toString()) : BIG_ZERO,
    setLastUpdated: refetch,
  }
}
