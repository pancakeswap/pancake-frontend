import React, { useEffect } from 'react'
import styled from 'styled-components'
import { delay } from 'lodash'
import { Modal, Text, InjectedModalProps, Button, Flex } from '@pancakeswap-libs/uikit'
import useI18n from 'hooks/useI18n'
import confetti from 'canvas-confetti'
import nftList from 'config/constants/nfts'

interface ClaimGiftProps extends InjectedModalProps {
  bunnyId: number
}

const NftImage = styled.img`
  border-radius: 50%;
  margin-bottom: 24px;
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

const ClaimGift: React.FC<ClaimGiftProps> = ({ bunnyId, onDismiss }) => {
  const TranslateString = useI18n()
  const nft = nftList.find((nftItem) => nftItem.bunnyId === bunnyId)

  useEffect(() => {
    delay(showConfetti, 100)
  }, [])

  return (
    <Modal title={TranslateString(999, 'Congratulations!')} onDismiss={onDismiss}>
      <Flex flexDirection="column" alignItems="center" justifyContent="center">
        <NftImage src={`/images/nfts/${nft.images.md}`} height="128px" width="128px" alt="nft image" />
        <Text bold color="secondary" fontSize="24px" mb="24px">
          {TranslateString(999, 'You won a collectible!')}
        </Text>
        <Button as="a" href="/collectibles">
          {TranslateString(999, 'Claim now')}
        </Button>
      </Flex>
    </Modal>
  )
}

export default ClaimGift
