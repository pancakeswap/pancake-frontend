import { BIG_ZERO } from '@pancakeswap/utils/bigNumber'
import BigNumber from 'bignumber.js'
import { useMemo } from 'react'
import { getCakeContract } from 'utils/contractHelpers'
import { useAccount, useContractRead } from 'wagmi'
import { useActiveChainId } from './useActiveChainId'

export const useCakeApprovalStatus = (spender) => {
  const { address: account } = useAccount()
  const { chainId } = useActiveChainId()

  const { data, refetch } = useContractRead({
    chainId,
    ...getCakeContract(chainId),
    enabled: Boolean(account && spender),
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
