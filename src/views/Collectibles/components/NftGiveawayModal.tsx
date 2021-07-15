import React, { useEffect } from 'react'
import styled from 'styled-components'
import confetti from 'canvas-confetti'
import { Modal, Text, Button, Flex, InjectedModalProps } from '@pancakeswap/uikit'
import history from 'routerHistory'
import { delay } from 'lodash'
import { useTranslation } from 'contexts/Localization'
import nftList from 'config/constants/nfts'
import { Nft } from 'config/constants/types'
import { useProfile } from 'state/profile/hooks'
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

  const identifier = Object.keys(teamNftMap).find(
    (mapNftIdentifier) => teamNftMap[mapNftIdentifier] === profile.team.id,
  )
  return nftList.find((nft) => nft.identifier === identifier)
}

const NftGiveawayModal: React.FC<InjectedModalProps> = ({ onDismiss }) => {
  const { t } = useTranslation()
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
    <Modal title={t('Congratulations!')} onDismiss={onDismiss}>
      <Flex flexDirection="column" alignItems="center" justifyContent="center">
        {nft && <NftImage src={`/images/nfts/${nft.images.md}`} />}
        <Text bold color="secondary" fontSize="24px" mb="24px">
          {t('You won a collectible!')}
        </Text>
        <Button onClick={handleClick}>{t('Claim now')}</Button>
      </Flex>
    </Modal>
  )
}

export default NftGiveawayModal
