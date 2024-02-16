import { atom } from 'jotai'

export enum ApproveAndLockStatus {
  // no modal
  IDLE,
  // approve token, send tx
  APPROVING_TOKEN,
  // send lock tx
  LOCK_CAKE,
  // lock pending, wait for lock confirmation
  LOCK_CAKE_PENDING,
  // lock confirmed, wait for migrate confirmation
  INCREASE_AMOUNT,
  INCREASE_AMOUNT_PENDING,
  INCREASE_WEEKS,
  INCREASE_WEEKS_PENDING,
  UNLOCK_CAKE,
  UNLOCK_CAKE_PENDING,
  MIGRATE,
  MIGRATE_PENDING,
  CONFIRMED,
  ERROR,
  // any user rejection
  REJECT,
}

export const approveAndLockStatusAtom = atom<ApproveAndLockStatus>(ApproveAndLockStatus.IDLE)
export const cakeLockAmountAtom = atom<string>('0')
export const cakeLockWeeksAtom = atom<string>('26')
export const cakeLockTxHashAtom = atom<`0x${string}` | ''>('')
export const cakeLockApprovedAtom = atom<boolean>(false)
