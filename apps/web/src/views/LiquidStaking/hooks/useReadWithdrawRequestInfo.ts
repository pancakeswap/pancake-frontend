import { BIG_ZERO } from '@pancakeswap/utils/bigNumber'
import BigNumber from 'bignumber.js'
import { unwrappedEth } from 'config/abi/unwrappedEth'
import { UNWRAPPED_ETH_ADDRESS } from 'config/constants/liquidStaking'
import dayjs from 'dayjs'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useEffect, useMemo } from 'react'
import { Address } from 'viem'
import { useBlockNumber, useReadContract } from 'wagmi'
import { useQueryClient } from '@tanstack/react-query'

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
  const { account, chainId } = useActiveWeb3React()
  const { data: blockNumber } = useBlockNumber({ watch: true })
  const queryClient = useQueryClient()

  const { data, queryKey } = useReadContract({
    chainId,
    abi: unwrappedEth,
    address: UNWRAPPED_ETH_ADDRESS,
    functionName: 'getUserWithdrawRequests',
    args: [account || '0x'],
    query: {
      enabled: !!account,
    },
  })

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey }, { cancelRefetch: false })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blockNumber, queryClient])

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
