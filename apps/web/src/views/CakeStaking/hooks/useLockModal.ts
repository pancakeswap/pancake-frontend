import { getDecimalAmount } from '@pancakeswap/utils/formatBalance'
import BN from 'bignumber.js'
import { useSetAtom } from 'jotai'
import { useCallback, useEffect, useState } from 'react'
import { ApproveAndLockStatus, approveAndLockStatusAtom, cakeLockApprovedAtom } from 'state/vecake/atoms'
import { useLockCakeData } from 'state/vecake/hooks'
import { useLockApproveCallback } from './useLockAllowance'

const useModal = () => {
  const [isOpen, setIsOpen] = useState(false)
  const setStatus = useSetAtom(approveAndLockStatusAtom)

  const onDismiss = useCallback(() => {
    setStatus(ApproveAndLockStatus.IDLE)
    setIsOpen(false)
  }, [setStatus])
  const onOpen = useCallback(() => setIsOpen(true), [])

  return {
    onDismiss,
    onOpen,
    isOpen,
    setIsOpen,
  }
}

export const useLockModal = () => {
  const modal = useModal()

  const lockCakeData = useLockCakeData()
  const { status, cakeLockApproved, cakeLockAmount } = lockCakeData
  const setStatus = useSetAtom(approveAndLockStatusAtom)
  const setCakeLockApproved = useSetAtom(cakeLockApprovedAtom)

  const { currentAllowance } = useLockApproveCallback(cakeLockAmount)

  // when IDLE status, close modal
  useEffect(() => {
    if (modal.isOpen && status === ApproveAndLockStatus.IDLE) {
      modal.onDismiss()
    }
  }, [modal, modal.isOpen, setStatus, status])

  // on status change from IDLE, open modal
  useEffect(() => {
    if (!modal.isOpen && status !== ApproveAndLockStatus.IDLE) {
      modal.onOpen()
    }
  }, [modal, status])

  // when current allowance < lock amount, set approved to false
  useEffect(() => {
    if (!modal.isOpen) {
      const cakeLockAmountBN = getDecimalAmount(new BN(cakeLockAmount || 0)).toString()

      if (currentAllowance?.lessThan(cakeLockAmountBN)) {
        setCakeLockApproved(false)
      } else {
        setCakeLockApproved(true)
      }
    }
  }, [cakeLockApproved, cakeLockAmount, setCakeLockApproved, modal.isOpen, currentAllowance])

  return {
    modal,
    modalData: lockCakeData,
  }
}
