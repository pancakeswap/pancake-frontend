import React, { useState } from 'react'
import styled from 'styled-components'
import { PromiEvent } from 'web3-core'
import { Contract } from 'web3-eth-contract'
import { useWeb3React } from '@web3-react/core'
import { Button, InjectedModalProps, Modal, Text, Flex, AutoRenewIcon } from '@pancakeswap-libs/uikit'
import { Nft } from 'config/constants/types'
import { useTranslation } from 'contexts/Localization'
import useToast from 'hooks/useToast'

interface ClaimNftModalProps extends InjectedModalProps {
  nft: Nft
  onSuccess: () => void
  onClaim: () => PromiEvent<Contract>
}

const ModalContent = styled.div`
  margin-bottom: 16px;
`

const Actions = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 8px;
`

const ClaimNftModal: React.FC<ClaimNftModalProps> = ({ nft, onSuccess, onClaim, onDismiss }) => {
  const [isConfirming, setIsConfirming] = useState(false)
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const { toastError, toastSuccess } = useToast()

  const handleConfirm = async () => {
    onClaim()
      .once('sending', () => {
        setIsConfirming(true)
      })
      .once('receipt', () => {
        toastSuccess('Successfully claimed!')
        onDismiss()
        onSuccess()
      })
      .once('error', (error) => {
        console.error('Unable to claim NFT', error)
        toastError('Error', 'Unable to claim NFT, please try again.')
        setIsConfirming(false)
      })
  }

  return (
    <Modal title={t('Claim Collectible')} onDismiss={onDismiss}>
      <ModalContent>
        <Flex alignItems="center" mb="8px" justifyContent="space-between">
          <Text>{t('You will receive')}:</Text>
          <Text bold>{`1x "${nft.name}" Collectible`}</Text>
        </Flex>
      </ModalContent>
      <Actions>
        <Button width="100%" variant="secondary" onClick={onDismiss}>
          {t('Cancel')}
        </Button>
        <Button
          width="100%"
          onClick={handleConfirm}
          disabled={!account}
          isLoading={isConfirming}
          endIcon={isConfirming ? <AutoRenewIcon color="currentColor" spin /> : null}
        >
          {t('Confirm')}
        </Button>
      </Actions>
    </Modal>
  )
}

export default ClaimNftModal
