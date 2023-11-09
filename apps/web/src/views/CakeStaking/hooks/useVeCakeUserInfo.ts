import { useQuery } from '@tanstack/react-query'
import { SLOW_INTERVAL } from 'config/constants'
import useAccountActiveChain from 'hooks/useAccountActiveChain'
import { useVeCakeContract } from 'hooks/useContract'
import { useEffect, useState } from 'react'
import { Address } from 'viem'
import { CakeLockStatus } from '../types'

export type VeCakeUserInfo = {
  // cake amount locked by user
  amount: bigint
  // end time of user lock
  end: bigint
  // lock through cake pool proxy
  // will zeroAddress if not locked through cake pool proxy
  cakePoolProxy: Address
  // cake amount locked by cake pool proxy
  cakeAmount: bigint
  // lock end time of cake pool proxy
  lockEndTime: number
  // migration time of cake pool proxy
  migrationTime: number
  // cake pool type of cake pool proxy
  // 1: Migration
  // 2: Delegation
  cakePoolType: number
  // withdraw flag of cake pool proxy
  // 0: not withdraw
  // 1: already withdraw
  withdrawFlag: 0 | 1
}

export const useVeCakeUserInfo = (): VeCakeUserInfo | undefined => {
  const veCakeContract = useVeCakeContract()
  const { account } = useAccountActiveChain()

  const { data } = useQuery(
    ['veCakeUserInfo', veCakeContract?.address, account],
    async () => {
      if (!account) return undefined

      const [amount, end, cakePoolProxy, cakeAmount, lockEndTime, migrationTime, cakePoolType, withdrawFlag] =
        await veCakeContract.read.getUserInfo([account])
      return {
        amount,
        end,
        cakePoolProxy,
        cakeAmount,
        lockEndTime,
        migrationTime,
        cakePoolType,
        withdrawFlag,
      } as VeCakeUserInfo
    },
    {
      enabled: Boolean(veCakeContract?.address && account),
      refetchInterval: SLOW_INTERVAL,
      keepPreviousData: true,
    },
  )

  return data
}

export const useCakeLockStatus = (): CakeLockStatus => {
  const userStakingInfo = useVeCakeUserInfo()
  const [status, setStatus] = useState<CakeLockStatus>(CakeLockStatus.NotLocked)

  useEffect(() => {
    if (!userStakingInfo || !userStakingInfo.amount) setStatus(CakeLockStatus.NotLocked)
    if (userStakingInfo?.amount && userStakingInfo.end) setStatus(CakeLockStatus.Locking)
  }, [userStakingInfo])

  return status
}
