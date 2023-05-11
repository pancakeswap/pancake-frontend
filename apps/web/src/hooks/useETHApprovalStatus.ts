import { WETH9 } from '@pancakeswap/sdk'
import BigNumber from 'bignumber.js'
import { Address, erc20ABI, useAccount, useContractRead } from 'wagmi'
import { useActiveChainId } from './useActiveChainId'

export const useETHApprovalStatus = (spender: Address) => {
  const { address: account } = useAccount()
  const { chainId } = useActiveChainId()

  const { data, refetch } = useContractRead({
    chainId,
    abi: erc20ABI,
    address: WETH9[chainId]?.address,
    functionName: 'allowance',
    args: [account, spender],
    enabled: !!account && !!spender,
  })

  return {
    isApproved: data ? data > 0 : false,
    allowance: new BigNumber(data?.toString()),
    setLastUpdated: refetch,
  }
}

export default useETHApprovalStatus
