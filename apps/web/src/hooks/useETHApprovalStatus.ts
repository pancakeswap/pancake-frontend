import { useMemo } from 'react'
import { useAccount } from 'wagmi'
import { useTokenContract } from 'hooks/useContract'
import { useSWRContract, UseSWRContractKey } from 'hooks/useSWRContract'
import BigNumber from 'bignumber.js'
import { WETH9 } from '@pancakeswap/sdk'
import { useActiveChainId } from './useActiveChainId'

export const useETHApprovalStatus = (spender: string) => {
  const { address: account } = useAccount()
  const { chainId } = useActiveChainId()

  const ethContract = useTokenContract(WETH9[chainId]?.address)

  const key = useMemo<UseSWRContractKey>(
    () =>
      account && spender
        ? {
            contract: ethContract,
            methodName: 'allowance',
            params: [account, spender],
          }
        : null,
    [account, spender, ethContract],
  )

  const { data, mutate } = useSWRContract(key)

  return {
    isApproved: data ? data.gt(0) : false,
    allowance: new BigNumber(data?.toString()),
    setLastUpdated: mutate,
  }
}

export default useETHApprovalStatus
