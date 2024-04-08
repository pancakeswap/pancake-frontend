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
  const cakeContract = useMemo(() => (chainId ? getCakeContract(chainId) : undefined), [chainId])

  const { data, refetch } = useReadContract({
    chainId,
    abi: cakeContract?.abi,
    address: cakeContract?.address,
    query: {
      enabled: Boolean(account && spender),
    },
    functionName: 'allowance',
    args: [account!, spender],
  })

  useEffect(() => {
    refetch()
  }, [blockNumber, refetch])

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
