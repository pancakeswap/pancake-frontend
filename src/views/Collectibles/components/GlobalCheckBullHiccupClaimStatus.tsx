import React, { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import { useModal } from '@pancakeswap-libs/uikit'
import useGetBullHiccupClaimableStatus from '../hooks/useGetBullHiccupClaimableStatus'
import ClaimBullHiccupNftModal from './ClaimBullHiccupNftModal'

/**
 * This is represented as a component rather than a hook because we need to keep it
 * inside the Router.
 *
 * TODO: Put global checks in redux or make a generic area to house global checks
 */
const GlobalCheckBullHiccupClaimStatus = () => {
  const hasDisplayedModal = useRef(false)
  const { isSomeClaimable, isBullClaimable, isHiccupClaimable } = useGetBullHiccupClaimableStatus()
  const [onPresentGiftModal] = useModal(
    <ClaimBullHiccupNftModal isBullClaimable={isBullClaimable} isHiccupClaimable={isHiccupClaimable} />,
  )
  const { account } = useWallet()
  const { pathname } = useLocation()

  useEffect(() => {
    if (!pathname.includes('/collectibles') && isSomeClaimable && !hasDisplayedModal.current) {
      onPresentGiftModal()
      hasDisplayedModal.current = true
    }
  }, [pathname, isSomeClaimable, hasDisplayedModal, onPresentGiftModal])

  // Reset the check flag when account changes
  useEffect(() => {
    hasDisplayedModal.current = false
  }, [account, hasDisplayedModal])

  return null
}

export default GlobalCheckBullHiccupClaimStatus
