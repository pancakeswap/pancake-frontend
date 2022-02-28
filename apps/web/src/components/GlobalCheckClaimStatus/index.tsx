import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/router'
import { useModal } from '@pancakeswap/uikit'
import { useWeb3React } from '@web3-react/core'
import dynamic from 'next/dynamic'
import { getAnniversaryAchievementContract } from 'utils/contractHelpers'

const AnniversaryAchievementModal = dynamic(() => import('./AnniversaryAchievementModal'), { ssr: false })

interface GlobalCheckClaimStatusProps {
  excludeLocations: string[]
}

// change it to true if we have events to check claim status
const enable = false

const GlobalCheckClaimStatus: React.FC<GlobalCheckClaimStatusProps> = (props) => {
  if (!enable) {
    return null
  }
  return <GlobalCheckClaim {...props} />
}

/**
 * This is represented as a component rather than a hook because we need to keep it
 * inside the Router.
 *
 * TODO: Put global checks in redux or make a generic area to house global checks
 */
const GlobalCheckClaim: React.FC<GlobalCheckClaimStatusProps> = ({ excludeLocations }) => {
  const hasDisplayedModal = useRef(false)
  const [canClaimAnniversaryPoints, setCanClaimAnniversaryPoints] = useState(false)
  const { account } = useWeb3React()
  const { pathname } = useRouter()
  const [onPresentAnniversaryModal] = useModal(<AnniversaryAchievementModal />)

  // Check claim status
  useEffect(() => {
    const fetchClaimAnniversaryStatus = async () => {
      const { canClaim } = getAnniversaryAchievementContract()
      const canClaimAnniversary = await canClaim(account)
      setCanClaimAnniversaryPoints(canClaimAnniversary)
    }

    if (account) {
      fetchClaimAnniversaryStatus()
    }
  }, [account])

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
