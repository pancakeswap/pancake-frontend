import { BIG_ZERO } from '@pancakeswap/utils/bigNumber'
import BigNumber from 'bignumber.js'
import { useEffect, useMemo } from 'react'
import { getCakeContract } from 'utils/contractHelpers'
import { useAccount, useBlockNumber, useReadContract } from 'wagmi'
import { useActiveChainId } from './useActiveChainId'

export const useCakeApprovalStatus = (spender) => {
  const { address: account } = useAccount()
  const { chainId } = useActiveChainId()
  const { data: blockNumber } = useBlockNumber({ watch: true })

  const { data, refetch } = useReadContract({
    chainId,
    ...getCakeContract(chainId),
    query: {
      enabled: Boolean(account && spender),
    },
    functionName: 'allowance',
    args: [account!, spender],
  })

  useEffect(() => {
    refetch()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blockNumber])

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
