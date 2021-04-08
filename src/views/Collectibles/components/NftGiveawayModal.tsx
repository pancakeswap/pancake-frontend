import React, { useEffect } from 'react'
import styled from 'styled-components'
import confetti from 'canvas-confetti'
import { Modal, Text, Button, Flex, InjectedModalProps } from '@pancakeswap-libs/uikit'
import history from 'routerHistory'
import { delay } from 'lodash'
import useI18n from 'hooks/useI18n'
import nftList from 'config/constants/nfts'
import { Nft } from 'config/constants/types'
import { useProfile } from 'state/hooks'
import { Profile } from 'state/types'
import { teamNftMap } from './NftCard/EasterNftCard'

const NftImage = styled.img`
  border-radius: 50%;
  height: 128px;
  margin-bottom: 24px;
  width: 128px;
`

const showConfetti = () => {
  confetti({
    resize: true,
    particleCount: 200,
    startVelocity: 30,
    gravity: 0.5,
    spread: 350,
    origin: {
      x: 0.5,
      y: 0.3,
    },
  })
}

const getClaimableNft = (profile: Profile): Nft => {
  if (!profile) {
    return null
  }

  if (!profile.team) {
    return null
  }

  const bunnyId = Object.keys(teamNftMap).find((mapBunnyId) => teamNftMap[mapBunnyId] === profile.team.id)
  return nftList.find((nft) => nft.bunnyId === Number(bunnyId))
}

const NftGiveawayModal: React.FC<InjectedModalProps> = ({ onDismiss }) => {
  const TranslateString = useI18n()
  const { profile } = useProfile()
  const nft = getClaimableNft(profile)

  // This is required because the modal exists outside the Router
  const handleClick = () => {
    onDismiss()
    history.push('/collectibles')
  }

  useEffect(() => {
    delay(showConfetti, 100)
  }, [])

  return (
    <Modal title={TranslateString(999, 'Congratulations!')} onDismiss={onDismiss}>
      <Flex flexDirection="column" alignItems="center" justifyContent="center">
        {nft && <NftImage src={`/images/nfts/${nft.images.md}`} />}
        <Text bold color="secondary" fontSize="24px" mb="24px">
          {TranslateString(999, 'You won a collectible!')}
        </Text>
        <Button onClick={handleClick}>{TranslateString(999, 'Claim now')}</Button>
      </Flex>
    </Modal>
  )
}

export default NftGiveawayModal
