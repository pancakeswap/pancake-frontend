import BigNumber from 'bignumber.js'
import { unwrappedEth } from 'config/abi/unwrappedEth'
import { UNWRAPPED_ETH_ADDRESS } from 'config/constants/liquidStaking'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { Address, useContractRead } from 'wagmi'

interface UserWithdrawRequest {
  allocated: boolean
  claimTime: BigNumber
  ethAmount: BigNumber
  recipient: Address
  triggerTime: BigNumber
  wbethAmount: BigNumber
}

export function useReadWithdrawRequestInfo():
  | {
      latestTriggerTime: BigNumber
      totalWbethAmount: BigNumber
    }
  | undefined {
  const { account, chainId } = useActiveWeb3React()

  const { data } = useContractRead({
    chainId,
    abi: unwrappedEth,
    address: UNWRAPPED_ETH_ADDRESS,
    functionName: 'getUserWithdrawRequests',
    args: [account || '0x'],
    enabled: !!account,
    watch: true,
  })

  if (!Array.isArray(data)) return undefined

  return (data as UserWithdrawRequest[]).reduce(
    (last, d) => ({
      latestTriggerTime: new BigNumber(d.triggerTime),
      totalWbethAmount: last.totalWbethAmount.plus(d.wbethAmount),
    }),
    {
      latestTriggerTime: new BigNumber(0),
      totalWbethAmount: new BigNumber(0),
    },
  )
}
