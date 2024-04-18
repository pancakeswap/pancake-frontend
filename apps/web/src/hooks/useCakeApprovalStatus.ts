import { BIG_ZERO } from '@pancakeswap/utils/bigNumber'
import BigNumber from 'bignumber.js'
import { useMemo } from 'react'
import { Address, erc20Abi } from 'viem'
import { useAccount } from 'wagmi'

import { getCakeContract } from 'utils/contractHelpers'

import { useReadContract } from '@pancakeswap/wagmi'
import { useActiveChainId } from './useActiveChainId'

export const useCakeApprovalStatus = (spender: any) => {
  const { address: account } = useAccount()
  const { chainId } = useActiveChainId()
  const cakeContract = useMemo(() => (chainId ? getCakeContract(chainId) : undefined), [chainId])

  const { data, refetch } = useReadContract<typeof erc20Abi, 'allowance', [Address, any]>({
    chainId,
    abi: cakeContract?.abi,
    address: cakeContract?.address,
    query: {
      enabled: Boolean(account && spender),
    },
    functionName: 'allowance',
    args: [account!, spender],
    watch: true,
  })

  return useMemo(
    () => ({
      isVaultApproved: data && data > 0,
      allowance: data ? new BigNumber(data?.toString()) : BIG_ZERO,
      setLastUpdated: refetch,
    }),
    [data, refetch],
  )
}

export default useCakeApprovalStatus
