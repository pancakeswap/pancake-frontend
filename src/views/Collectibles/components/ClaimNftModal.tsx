import React, { useState } from 'react'
import styled from 'styled-components'
import { ethers } from 'ethers'
import { useWeb3React } from '@web3-react/core'
import { Button, InjectedModalProps, Modal, Text, Flex, AutoRenewIcon } from '@pancakeswap/uikit'
import { Nft } from 'config/constants/nfts/types'
import { useTranslation } from 'contexts/Localization'
import useToast from 'hooks/useToast'
import { ToastDescriptionWithTx } from 'components/Toast'

interface ClaimNftModalProps extends InjectedModalProps {
  nft: Nft
  onSuccess: () => void
  onClaim: () => Promise<ethers.providers.TransactionResponse>
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
    setIsConfirming(true)
    try {
      const tx = await onClaim()
      const receipt = await tx.wait()
      if (receipt.status) {
        toastSuccess(t('Successfully claimed!'), <ToastDescriptionWithTx txHash={receipt.transactionHash} />)
        onDismiss()
        onSuccess()
      }
    } catch {
      toastError(t('Error'), t('Please try again. Confirm the transaction and make sure you are paying enough gas!'))
      setIsConfirming(false)
    }
  }

  return (
    <Modal title={t('Claim Collectible')} onDismiss={onDismiss}>
      <ModalContent>
        <Flex alignItems="center" mb="8px" justifyContent="space-between">
          <Text>{t('You will receive')}:</Text>
          <Text bold>{t('1x %nftName% Collectible', { nftName: nft.name })}</Text>
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
