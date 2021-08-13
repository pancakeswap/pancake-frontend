import React, { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useWeb3React } from '@web3-react/core'
import { useModal } from '@pancakeswap/uikit'
import { Nft } from 'config/constants/types'
import nfts from 'config/constants/nfts'
import { useProfile } from 'state/profile/hooks'
import { useEasterNftContract } from 'hooks/useContract'
import NftGiveawayModal from './NftGiveawayModal'
import useBunnySpecialLottery from '../hooks/useBunnySpecialLottery'

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
  const [isClaimable, setIsClaimable] = useState(false)
  const [claimableNft, setClaimableNft] = useState<Nft>(null)
  const [onPresentGiftModal] = useModal(<NftGiveawayModal nft={claimableNft} />)
  const { account } = useWeb3React()
  const { pathname } = useLocation()
  const { canClaimBaller, canClaimLottie, canClaimLucky } = useBunnySpecialLottery()

  // Check claim status
  useEffect(() => {
    const fetchClaimStatus = async () => {
      const lotteryNftIdentifiers = ['baller', 'lucky', 'lottie']

      const canClaimMap = {
        lottie: canClaimBaller,
        lucky: canClaimLottie,
        baller: canClaimLucky,
      }

      const { canClaim: isBallerClaimable } = await canClaimBaller()
      const { canClaim: isLottieClaimable } = await canClaimLottie()
      const { canClaim: isLuckyClaimable } = await canClaimLucky()

      setIsClaimable(true)
    }

    if (account) {
      fetchClaimStatus()
    }
  }, [account, canClaimBaller, canClaimLottie, canClaimLucky, setIsClaimable])

  // Check if we need to display the modal
  useEffect(() => {
    const matchesSomeLocations = excludeLocations.some((location) => pathname.includes(location))

    if (isClaimable && !matchesSomeLocations && !hasDisplayedModal.current) {
      onPresentGiftModal()
      hasDisplayedModal.current = true
    }
  }, [pathname, isClaimable, excludeLocations, hasDisplayedModal, onPresentGiftModal])

  // Reset the check flag when account changes
  useEffect(() => {
    hasDisplayedModal.current = false
  }, [account, hasDisplayedModal])

  return null
}

export default GlobalCheckClaimStatus
