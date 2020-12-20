import React, { useEffect, useRef } from 'react'
import styled from 'styled-components'
import { Button, Heading, Modal, useModal } from '@pancakeswap-libs/uikit'
import useI18n from 'hooks/useI18n'
import { useWallet } from 'use-wallet'
import { getRabbitMintingContract } from '../utils/contracts'

interface NftYouWonModalProps {
  onDismiss?: () => void
}

const ModalContent = styled.div`
  padding: 24px;
  text-align: center;
`

const Actions = styled.div`
  text-align: center;
`

const NftYouWonModal: React.FC<NftYouWonModalProps> = ({ onDismiss }) => {
  const TranslateString = useI18n()
  return (
    <Modal title={TranslateString(999, 'Congratulations!')} onDismiss={onDismiss}>
      <ModalContent>
        <img src="/images/present.svg" alt="You won present" style={{ height: '64px', marginBottom: '24px' }} />
        <Heading size="lg" color="secondary">
          {TranslateString(999, 'You won an NFT!')}
        </Heading>
      </ModalContent>
      <Actions>
        <Button as="a" href="/nft">
          {TranslateString(999, 'Go to claim NFT')}
        </Button>
      </Actions>
    </Modal>
  )
}

const NftGlobalNotification = () => {
  const { account } = useWallet()
  const [onPresentBurnModal] = useModal(<NftYouWonModal />)
  const showModal = useRef(() => onPresentBurnModal())

  useEffect(() => {
    const checkNftStatus = async () => {
      const { methods } = getRabbitMintingContract()
      const canClaim = await methods.canClaim(account).call()
      const hasClaimed = await methods.hasClaimed(account).call()

      if (canClaim && !hasClaimed) {
        showModal.current()
      }
    }

    if (account && !document.location.href.includes('/nft')) {
      checkNftStatus()
    }
  }, [account, showModal])

  return <div />
}

export default NftGlobalNotification
