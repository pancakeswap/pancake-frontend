import React, { useState } from 'react'
import styled from 'styled-components'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import { Button, Checkbox, Modal, Text } from '@pancakeswap-libs/uikit'
import useI18n from 'hooks/useI18n'
import { Nft } from 'config/constants/types'
import { RABBIT_MINTING_FARM_ADDRESS } from 'config/constants/nfts'
import { useRabbitMintingFarm } from 'hooks/useContract'
import InfoRow from './InfoRow'

interface BurnNftModalProps {
  nft: Nft
  tokenIds: number[]
  onSuccess: () => any
  onDismiss?: () => void
}

const Value = styled(Text)`
  font-weight: 600;
`

const ModalContent = styled.div`
  margin-bottom: 16px;
`

const Actions = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 8px;
`

const BurnNftModal: React.FC<BurnNftModalProps> = ({ nft, tokenIds, onSuccess, onDismiss }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [accepted, setAccepted] = useState(false)
  const TranslateString = useI18n()
  const { account } = useWallet()
  const rabbitMintingContract = useRabbitMintingFarm(RABBIT_MINTING_FARM_ADDRESS)

  const handleConfirm = async () => {
    try {
      const [tokenId] = tokenIds

      await rabbitMintingContract.methods
        .burnNFT(tokenId)
        .send({ from: account })
        .on('sending', () => {
          setIsLoading(true)
        })
        .on('receipt', () => {
          onDismiss()
          onSuccess()
        })
        .on('error', () => {
          console.error(error)
          setError('Unable to burn NFT')
          setIsLoading(false)
        })
    } catch (err) {
      console.error('Unable to burn NFT:', err)
    }
  }

  return (
    <Modal title={TranslateString(999, 'Trade in NFT')} onDismiss={onDismiss}>
      <ModalContent>
        {error && (
          <Text color="failure" mb="8px">
            {error}
          </Text>
        )}
        <InfoRow>
          <Text>{TranslateString(999, 'Trade in')}:</Text>
          <Value>{`1x "${nft.name}" NFT`}</Value>
        </InfoRow>
        <InfoRow>
          <Text>{TranslateString(999, 'You will receive')}:</Text>
          <Value>10 CAKE</Value>
        </InfoRow>
      </ModalContent>
      <ModalContent>
        <Text color="failure">
          {TranslateString(999, 'When you trade in this NFT to receive CAKE, you will lose access to it forever!')}
        </Text>
        <Text color="failure">{TranslateString(999, 'It will be burned and removed from circulation')}</Text>
      </ModalContent>
      <ModalContent style={{ alignItems: 'center', display: 'inline-flex' }}>
        <Checkbox checked={accepted} scale="sm" onChange={() => setAccepted(!accepted)} />
        <Text ml="8px" onClick={() => setAccepted(!accepted)} style={{ cursor: 'pointer' }}>
          {TranslateString(999, 'I understand')}
        </Text>
      </ModalContent>
      <Actions>
        <Button fullWidth variant="secondary" onClick={onDismiss}>
          {TranslateString(462, 'Cancel')}
        </Button>
        <Button fullWidth onClick={handleConfirm} disabled={!account || isLoading || !accepted}>
          {TranslateString(464, 'Confirm')}
        </Button>
      </Actions>
    </Modal>
  )
}

export default BurnNftModal
