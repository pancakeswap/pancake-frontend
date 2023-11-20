import dayjs from 'dayjs'
import useAccountActiveChain from 'hooks/useAccountActiveChain'
import { useVeCakeContract } from 'hooks/useContract'
import { useMemo } from 'react'
import { Address } from 'viem'
import { useContractRead } from 'wagmi'
import { CakeLockStatus } from '../types'
import { useCakePoolLocked } from './useCakePoolLocked'

export enum CakePoolLockStatus {
  LOCKING = 0,
  WITHDRAW = 1,
}

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
  withdrawFlag: CakePoolLockStatus
}

export const useVeCakeUserInfo = (): {
  data?: VeCakeUserInfo
  refetch: () => void
} => {
  const veCakeContract = useVeCakeContract()
  const { account } = useAccountActiveChain()

  const { data, refetch } = useContractRead({
    chainId: veCakeContract?.chain?.id,
    ...veCakeContract,
    functionName: 'getUserInfo',
    enabled: Boolean(veCakeContract?.address && account),
    args: [account!],
    watch: true,
    select: (d) => {
      if (!d) return undefined

      const [amount, end, cakePoolProxy, cakeAmount, lockEndTime, migrationTime, cakePoolType, withdrawFlag] = d
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
  })
  return {
    data,
    refetch,
  }
}

export const useCakeLockStatus = (): {
  status: CakeLockStatus
  shouldMigrate: boolean
  cakeLockedAmount: bigint
  nativeCakeLockedAmount: bigint
  proxyCakeLockedAmount: bigint
  cakeLocked: boolean
  cakeLockExpired: boolean
  cakePoolLocked: boolean
  cakePoolLockExpired: boolean
  cakeUnlockTime: number
  cakePoolUnlockTime: number
} => {
  const { data: userInfo } = useVeCakeUserInfo()
  // if user locked at cakePool before, should migrate
  const proxyLocked = useCakePoolLocked()
  const shouldMigrate = useMemo(() => {
    return proxyLocked && userInfo?.cakePoolType !== 1
  }, [proxyLocked, userInfo?.cakePoolType])

  const cakeLocked = useMemo(() => userInfo && userInfo.amount > 0n, [userInfo])
  const cakeUnlockTime = useMemo(() => {
    if (!userInfo) return 0
    return Number(userInfo.end)
  }, [userInfo])
  const cakeLockExpired = useMemo(() => {
    if (!cakeLocked) return false
    return dayjs.unix(cakeUnlockTime).isBefore(dayjs())
  }, [cakeLocked, cakeUnlockTime])
  const cakePoolLocked = useMemo(
    () => Boolean(userInfo?.cakeAmount) && userInfo?.withdrawFlag !== CakePoolLockStatus.WITHDRAW,
    [userInfo],
  )
  const cakePoolLockExpired = useMemo(() => {
    if (!cakePoolLocked) return false
    return userInfo!.lockEndTime > dayjs().unix()
  }, [userInfo, cakePoolLocked])

  const nativeCakeLockedAmount = useMemo(() => {
    if (!userInfo) return BigInt(0)
    return userInfo.amount ?? 0n
  }, [userInfo])
  const proxyCakeLockedAmount = useMemo(() => {
    if (!cakePoolLocked) return 0n

    return userInfo!.cakeAmount ?? 0n
  }, [userInfo, cakePoolLocked])

  const cakeLockedAmount = useMemo(() => {
    return nativeCakeLockedAmount + proxyCakeLockedAmount
  }, [nativeCakeLockedAmount, proxyCakeLockedAmount])

  const cakePoolUnlockTime = useMemo(() => {
    if (!cakePoolLocked) return 0
    return Number(userInfo!.lockEndTime)
  }, [userInfo, cakePoolLocked])

  const status = useMemo(() => {
    if ((!userInfo || !userInfo.amount) && !cakePoolLocked && !shouldMigrate) return CakeLockStatus.NotLocked
    if ((userInfo?.amount && userInfo.end) || cakePoolLocked) return CakeLockStatus.Locking
    if (cakeLockExpired) return CakeLockStatus.Expired
    if (shouldMigrate) return CakeLockStatus.Migrate
    return CakeLockStatus.NotLocked
  }, [userInfo, shouldMigrate, cakePoolLocked, cakeLockExpired])

  return {
    status,
    shouldMigrate,
    cakeLockedAmount,
    nativeCakeLockedAmount,
    proxyCakeLockedAmount,
    cakeLocked,
    cakeLockExpired,
    cakePoolLocked,
    cakePoolLockExpired,
    cakeUnlockTime,
    cakePoolUnlockTime,
  }
}
