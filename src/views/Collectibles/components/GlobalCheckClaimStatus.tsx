import React, { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useModal } from '@pancakeswap/uikit'
import { useWeb3React } from '@web3-react/core'
import { useAnniversaryAchievementContract } from 'hooks/useContract'
import AnniversaryAchievementModal from './AnniversaryAchievementModal'

interface GlobalCheckClaimStatusProps {
  excludeLocations: string[]
}

/**
 * This is represented as a component rather than a hook because we need to keep it
 * inside the Router.
 *
 * TODO: Put global checks in redux or make a generic area to house global checks
 */
const GlobalCheckClaimStatus: React.FC<GlobalCheckClaimStatusProps> = ({ excludeLocations }) => {
  const hasDisplayedModal = useRef(false)
  const [canClaimAnniversaryPoints, setCanClaimAnniversaryPoints] = useState(false)
  const { account } = useWeb3React()
  const { pathname } = useLocation()
  const { canClaim, claimAnniversaryPoints } = useAnniversaryAchievementContract()
  const [onPresentAnniversaryModal] = useModal(<AnniversaryAchievementModal onClick={claimAnniversaryPoints} />)

  // Check claim status
  useEffect(() => {
    const fetchClaimAnniversaryStatus = async () => {
      const canClaimAnniversary = await canClaim(account)
      setCanClaimAnniversaryPoints(canClaimAnniversary)
    }

    if (account) {
      fetchClaimAnniversaryStatus()
    }
  }, [account, canClaim])

  // Check if we need to display the modal
  useEffect(() => {
    const matchesSomeLocations = excludeLocations.some((location) => pathname.includes(location))

    if (canClaimAnniversaryPoints && !matchesSomeLocations && !hasDisplayedModal.current) {
      onPresentAnniversaryModal()
      hasDisplayedModal.current = true
    }
  }, [pathname, excludeLocations, hasDisplayedModal, onPresentAnniversaryModal, canClaimAnniversaryPoints])

  // Reset the check flag when account changes
  useEffect(() => {
    hasDisplayedModal.current = false
  }, [account, hasDisplayedModal])

  return null
}

export default GlobalCheckClaimStatus
