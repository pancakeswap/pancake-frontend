import React, { useEffect } from 'react'
import styled from 'styled-components'
import confetti from 'canvas-confetti'
import { Modal, Text, Button, Flex, InjectedModalProps } from '@pancakeswap/uikit'
import history from 'routerHistory'
import { delay } from 'lodash'
import { useTranslation } from 'contexts/Localization'
import { Nft } from 'config/constants/nfts/types'

const NftImage = styled.img`
  border-radius: 50%;
  height: 128px;
  margin-bottom: 24px;
  margin-right: 8px;
  width: 128px;
`

const showConfetti = () => {
  confetti({
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

interface NftGiveawayModalProps extends InjectedModalProps {
  nfts: Nft[]
}

const NftGiveawayModal: React.FC<NftGiveawayModalProps> = ({ onDismiss, nfts }) => {
  const { t } = useTranslation()

  // This is required because the modal exists outside the Router
  const handleClick = () => {
    onDismiss()
    history.push('/collectibles')
  }

  useEffect(() => {
    delay(showConfetti, 100)
  }, [])

  const getImages = () => {
    return nfts.map((nft) => <NftImage key={nft.id} src={`/images/nfts/${nft.images.md}`} />)
  }

  return (
    <Modal title={t('Congratulations!')} onDismiss={onDismiss}>
      <Flex flexDirection="column" alignItems="center" justifyContent="center">
        <Flex flexWrap="wrap" alignItems="center" justifyContent="center">
          {getImages()}
        </Flex>
        <Text textAlign="center" bold color="secondary" fontSize="24px" mb="24px">
          {nfts.length > 1 ? t('You won multiple collectibles!') : t('You won a collectible!')}
        </Text>
        <Button onClick={handleClick}>{t('Claim now')}</Button>
      </Flex>
    </Modal>
  )
}

export default NftGiveawayModal
