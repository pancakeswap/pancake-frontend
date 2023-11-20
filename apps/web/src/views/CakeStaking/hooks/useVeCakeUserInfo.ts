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
  })

  const userInfo = useMemo(() => {
    if (!data) return undefined

    const [amount, end, cakePoolProxy, cakeAmount, lockEndTime, migrationTime, cakePoolType, withdrawFlag] = data
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
  }, [data])

  return {
    data: userInfo,
    refetch,
  }
}

export const useCakeLockStatus = (): {
  status: CakeLockStatus
  shouldMigrate: boolean
  cakeLockedAmount: bigint
  noCakeLocked: boolean
  cakeLockExpired: boolean
  cakePoolLocked: boolean
  cakePoolLockExpired: boolean
  cakeUnlockTime: number
  cakePoolUnlockTime?: number
} => {
  const { data: userInfo } = useVeCakeUserInfo()
  // if user locked at cakePool before, should migrate
  const shouldMigrate = useCakePoolLocked()
  const noCakeLocked = useMemo(() => !userInfo || !userInfo.amount, [userInfo])
  const cakeUnlockTime = useMemo(() => {
    if (!userInfo) return 0
    return Number(userInfo.end)
  }, [userInfo])
  const cakeLockExpired = useMemo(() => {
    if (noCakeLocked) return false
    return dayjs.unix(cakeUnlockTime).isBefore(dayjs())
  }, [noCakeLocked, cakeUnlockTime])
  const cakePoolLocked = useMemo(
    () => Boolean(userInfo?.cakeAmount) && userInfo?.withdrawFlag !== CakePoolLockStatus.WITHDRAW,
    [userInfo],
  )
  const cakePoolLockExpired = useMemo(() => {
    if (!cakePoolLocked) return false
    return userInfo!.lockEndTime > dayjs().unix()
  }, [userInfo, cakePoolLocked])

  const cakeLockedAmountDirectly = useMemo(() => {
    if (!userInfo) return BigInt(0)
    return userInfo.amount ?? 0n
  }, [userInfo])
  const cakeLockedAmountCakePool = useMemo(() => {
    if (!cakePoolLocked) return 0n

    return userInfo!.cakeAmount ?? 0n
  }, [userInfo, cakePoolLocked])

  const cakeLockedAmount = useMemo(() => {
    return cakeLockedAmountDirectly + cakeLockedAmountCakePool
  }, [cakeLockedAmountDirectly, cakeLockedAmountCakePool])

  const cakePoolUnlockTime = useMemo(() => {
    if (!cakePoolLocked) return 0
    return Number(userInfo!.lockEndTime)
  }, [userInfo, cakePoolLocked])

  const status = useMemo(() => {
    if ((!userInfo || !userInfo.amount) && !shouldMigrate) return CakeLockStatus.NotLocked
    if (userInfo?.amount && userInfo.end) return CakeLockStatus.Locking
    if (cakeLockExpired) return CakeLockStatus.Expired
    if (shouldMigrate) return CakeLockStatus.Migrate
    return CakeLockStatus.NotLocked
  }, [userInfo, shouldMigrate, cakeLockExpired])

  return {
    status,
    shouldMigrate,
    cakeLockedAmount,
    noCakeLocked,
    cakeLockExpired,
    cakePoolLocked,
    cakePoolLockExpired,
    cakeUnlockTime,
    cakePoolUnlockTime,
  }
}
