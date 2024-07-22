import { BIG_ZERO } from '@pancakeswap/utils/bigNumber'
import BigNumber from 'bignumber.js'
import { unwrappedEth } from 'config/abi/unwrappedEth'
import { UNWRAPPED_ETH_ADDRESS } from 'config/constants/liquidStaking'
import dayjs from 'dayjs'
import { useReadContract } from '@pancakeswap/wagmi'
import { useMemo } from 'react'
import { Address } from 'viem'
import useAccountActiveChain from 'hooks/useAccountActiveChain'

interface UserWithdrawRequest {
  allocated: boolean
  claimTime: BigNumber
  ethAmount: BigNumber
  recipient: Address
  triggerTime: BigNumber
  wbethAmount: BigNumber
}

interface ClaimableIndex {
  index: number
  amount: BigNumber
}

export function useReadWithdrawRequestInfo():
  | {
      latestTriggerTime: BigNumber
      totalEthAmountPending: BigNumber
      totalEthAmountClaimable: BigNumber
      totalRequest: number
      claimableIndexes: ClaimableIndex[]
    }
  | undefined {
  const { account, chainId } = useAccountActiveChain()

  const { data } = useReadContract({
    chainId,
    abi: unwrappedEth,
    address: UNWRAPPED_ETH_ADDRESS,
    functionName: 'getUserWithdrawRequests',
    args: [account || '0x'],
    query: {
      enabled: !!account,
    },
    watch: true,
  })

  const currentTime = dayjs().unix()

  return useMemo(
    () =>
      !Array.isArray(data)
        ? undefined
        : {
            ...(data as UserWithdrawRequest[])
              .filter((d) => d.allocated)
              .reduce(
                (last, d, currentIndex) => {
                  const triggerTime = new BigNumber(d.triggerTime)

                  const claimable = currentTime > dayjs.unix(triggerTime.toNumber()).add(7, 'day').unix()

                  const latestTriggerTime = last.latestTriggerTime.eq(0)
                    ? triggerTime
                    : last.latestTriggerTime > triggerTime
                    ? last.latestTriggerTime
                    : triggerTime

                  return claimable
                    ? {
                        ...last,
                        latestTriggerTime,
                        totalEthAmountClaimable: last.totalEthAmountClaimable.plus(d.ethAmount),
                        claimableIndexes: [
                          ...last.claimableIndexes,
                          {
                            index: currentIndex,
                            amount: d.ethAmount,
                          },
                        ],
                      }
                    : {
                        ...last,
                        latestTriggerTime,
                        totalEthAmountPending: last.totalEthAmountPending.plus(d.ethAmount),
                      }
                },
                {
                  latestTriggerTime: BIG_ZERO,
                  totalEthAmountPending: BIG_ZERO,
                  totalEthAmountClaimable: BIG_ZERO,
                  claimableIndexes: [] as ClaimableIndex[],
                },
              ),
            totalRequest: data.filter((d) => d.allocated).length,
          },
    [currentTime, data],
  )
}
