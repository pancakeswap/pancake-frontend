import { WETH9 } from '@pancakeswap/sdk'
import { BIG_ZERO } from '@pancakeswap/utils/bigNumber'
import BigNumber from 'bignumber.js'
import { Address, erc20ABI, useAccount, useContractRead } from 'wagmi'
import { useActiveChainId } from './useActiveChainId'

export const useETHApprovalStatus = (spender: Address) => {
  const { address: account } = useAccount()
  const { chainId } = useActiveChainId()

  const { data, refetch } = useContractRead({
    chainId,
    abi: erc20ABI,
    address: chainId ? WETH9[chainId]?.address : undefined,
    functionName: 'allowance',
    enabled: !!account && !!spender,
    args: [account!, spender],
  })

  return {
    isApproved: data ? data > 0 : false,
    allowance: data ? new BigNumber(data?.toString()) : BIG_ZERO,
    setLastUpdated: refetch,
  }
}

export default useETHApprovalStatus
