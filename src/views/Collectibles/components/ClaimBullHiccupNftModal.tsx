import React, { useEffect } from 'react'
import styled from 'styled-components'
import { Modal, Text, Button, Flex, InjectedModalProps } from '@pancakeswap-libs/uikit'
import history from 'routerHistory'
import { delay } from 'lodash'
import useI18n from 'hooks/useI18n'
import confetti from 'canvas-confetti'
import nftList from 'config/constants/nfts'
import { BULL_NFT, HICCUP_NFT } from '../hooks/useGetBullHiccupClaimableStatus'

interface ClaimBullHiccupNftModalProps extends InjectedModalProps {
  isBullClaimable: boolean
  isHiccupClaimable: boolean
}

const bullNft = nftList.find((nft) => nft.bunnyId === BULL_NFT)
const hiccupNft = nftList.find((nft) => nft.bunnyId === HICCUP_NFT)

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

const renderNftPreview = (isBullClaimable: boolean, isHiccupClaimable: boolean) => {
  if (isBullClaimable && isHiccupClaimable) {
    return <img src="/images/bull-hiccup.png" height="128px" width="128px" alt="nft" style={{ marginBottom: '24px' }} />
  }

  if (isBullClaimable) {
    return <NftImage src={`/images/nfts/${bullNft.images.md}`} height="128px" width="128px" alt="nft" />
  }

  return <NftImage src={`/images/nfts/${hiccupNft.images.md}`} height="128px" width="128px" alt="nft" />
}

const ClaimBullHiccupNftModal: React.FC<ClaimBullHiccupNftModalProps> = ({
  isBullClaimable,
  isHiccupClaimable,
  onDismiss,
}) => {
  const TranslateString = useI18n()
  const collectibleMessage =
    isBullClaimable && isHiccupClaimable
      ? TranslateString(999, 'You won two Collectibles!')
      : TranslateString(999, 'You won a collectible!')

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
        {renderNftPreview(isBullClaimable, isHiccupClaimable)}
        <Text bold color="secondary" fontSize="24px" mb="24px">
          {collectibleMessage}
        </Text>
        <Button onClick={handleClick}>{TranslateString(999, 'Claim now')}</Button>
      </Flex>
    </Modal>
  )
}

export default ClaimBullHiccupNftModal
