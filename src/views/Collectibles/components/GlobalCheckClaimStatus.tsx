import React, { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useWeb3React } from '@web3-react/core'
import { useModal } from '@pancakeswap/uikit'
import { Nft } from 'config/constants/types'
import nfts from 'config/constants/nfts'
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
  const [claimableNfts, setClaimableNfts] = useState<Nft[]>([])
  const [onPresentGiftModal] = useModal(<NftGiveawayModal nfts={claimableNfts} />)
  const { account } = useWeb3React()
  const { pathname } = useLocation()
  const { canClaimBaller, canClaimLottie, canClaimLucky } = useBunnySpecialLottery()

  // Check claim status
  useEffect(() => {
    const fetchClaimStatus = async () => {
      const claimable: Nft[] = []

      const nftConfigMap = {
        lottie: nfts.find((nft) => nft.identifier === 'lottie'),
        lucky: nfts.find((nft) => nft.identifier === 'lucky'),
        baller: nfts.find((nft) => nft.identifier === 'baller'),
      }

      const { canClaim: isBallerClaimable } = await canClaimBaller()
      const { canClaim: isLottieClaimable } = await canClaimLottie()
      const { canClaim: isLuckyClaimable } = await canClaimLucky()

      if (isBallerClaimable) {
        claimable.push(nftConfigMap.baller)
      }

      if (isLottieClaimable) {
        claimable.push(nftConfigMap.lottie)
      }

      if (isLuckyClaimable) {
        claimable.push(nftConfigMap.lucky)
      }

      setClaimableNfts(claimable)
    }

    if (account) {
      fetchClaimStatus()
    }
  }, [account, canClaimBaller, canClaimLottie, canClaimLucky])

  // Check if we need to display the modal
  useEffect(() => {
    const matchesSomeLocations = excludeLocations.some((location) => pathname.includes(location))

    if (claimableNfts.length > 0 && !matchesSomeLocations && !hasDisplayedModal.current) {
      onPresentGiftModal()
      hasDisplayedModal.current = true
    }
  }, [pathname, excludeLocations, hasDisplayedModal, onPresentGiftModal, claimableNfts])

  // Reset the check flag when account changes
  useEffect(() => {
    hasDisplayedModal.current = false
  }, [account, hasDisplayedModal])

  return null
}

export default GlobalCheckClaimStatus
