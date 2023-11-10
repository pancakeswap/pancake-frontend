import { atom } from 'jotai'
import { Hex } from 'viem'

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
  CONFIRMED,
  // any user rejection
  REJECT,
}

export const approveAndLockStatusAtom = atom<ApproveAndLockStatus>(ApproveAndLockStatus.IDLE)
export const cakeLockAmountAtom = atom<string>('0')
export const cakeLockWeeksAtom = atom<string>('10')
export const cakeLockTxHashAtom = atom<Hex | undefined>(undefined)
export const cakeLockApprovedAtom = atom<boolean>(false)
