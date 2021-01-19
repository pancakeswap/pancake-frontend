import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import { Button, Modal, Text } from '@pancakeswap-libs/uikit'
import { getBalanceNumber } from 'utils/formatBalance'
import { RABBIT_MINTING_FARM_ADDRESS } from 'config/constants/nfts'
import { getCakeAddress } from 'utils/addressHelpers'
import { Nft } from 'config/constants/types'
import useTokenBalance from 'hooks/useTokenBalance'
import useI18n from 'hooks/useI18n'
import { useRabbitMintingFarm } from 'hooks/useContract'
import InfoRow from './InfoRow'

interface ClaimNftModalProps {
  nft: Nft
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

const ClaimNftModal: React.FC<ClaimNftModalProps> = ({ nft, onSuccess, onDismiss }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const TranslateString = useI18n()
  const { account } = useWallet()
  const rabbitMintingContract = useRabbitMintingFarm(RABBIT_MINTING_FARM_ADDRESS)
  const cakeBalance = useTokenBalance(getCakeAddress())
  const cakeInWallet = getBalanceNumber(cakeBalance)

  const handleConfirm = async () => {
    try {
      await rabbitMintingContract.methods
        .mintNFT(nft.bunnyId)
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
          setError('Unable to claim NFT')
          setIsLoading(false)
        })
    } catch (err) {
      console.error('Unable to mint NFT:', err)
    }
  }

  useEffect(() => {
    if (cakeInWallet === 0) {
      setError('You must have a CAKE balance greater than zero to claim NFT')
    }
  }, [cakeInWallet, setError])

  return (
    <Modal title={TranslateString(999, 'Claim NFT')} onDismiss={onDismiss}>
      <ModalContent>
        {error && (
          <Text color="failure" mb="8px">
            {error}
          </Text>
        )}
        <InfoRow>
          <Text>{TranslateString(999, 'You will receive')}:</Text>
          <Value>{`1x "${nft.name}" NFT`}</Value>
        </InfoRow>
      </ModalContent>
      <Actions>
        <Button fullWidth variant="secondary" onClick={onDismiss}>
          {TranslateString(462, 'Cancel')}
        </Button>
        <Button fullWidth onClick={handleConfirm} disabled={!account || isLoading || cakeInWallet <= 0}>
          {TranslateString(464, 'Confirm')}
        </Button>
      </Actions>
    </Modal>
  )
}

export default ClaimNftModal
