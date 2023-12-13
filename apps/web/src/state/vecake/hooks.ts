import { useAtomValue, useSetAtom } from 'jotai'
import { useCallback } from 'react'
import {
  approveAndLockStatusAtom,
  cakeLockAmountAtom,
  cakeLockApprovedAtom,
  cakeLockTxHashAtom,
  cakeLockWeeksAtom,
} from './atoms'

export const useCakeApproveAndLockStatus = () => {
  return useAtomValue(approveAndLockStatusAtom)
}

export const useLockCakeData = () => {
  const cakeLockApproved = useAtomValue(cakeLockApprovedAtom)
  const status = useCakeApproveAndLockStatus()
  const cakeLockAmount = useAtomValue(cakeLockAmountAtom)
  const cakeLockWeeks = useAtomValue(cakeLockWeeksAtom)
  const cakeLockTxHash = useAtomValue(cakeLockTxHashAtom)

  return {
    status,
    cakeLockApproved,
    cakeLockAmount,
    cakeLockWeeks,
    cakeLockTxHash,
  }
}

export const useLockCakeDataResetCallback = () => {
  const setCakeLockAmount = useSetAtom(cakeLockAmountAtom)
  const setCakeLockWeeks = useSetAtom(cakeLockWeeksAtom)

  return useCallback(() => {
    setCakeLockAmount('0')
    setCakeLockWeeks('10')
  }, [setCakeLockAmount, setCakeLockWeeks])
}
