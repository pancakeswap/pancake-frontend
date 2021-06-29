import React, { useState } from 'react'
import styled from 'styled-components'
import { ethers } from 'ethers'
import {
  Card,
  CardBody,
  Heading,
  Tag,
  Button,
  ChevronUpIcon,
  ChevronDownIcon,
  Text,
  CardFooter,
  useModal,
} from '@pancakeswap/uikit'
import { useProfile } from 'state/hooks'
import { useTranslation } from 'contexts/Localization'
import { Nft } from 'config/constants/types'
import InfoRow from '../InfoRow'
import TransferNftModal from '../TransferNftModal'
import ClaimNftModal from '../ClaimNftModal'
import Preview from './Preview'

export interface NftCardProps {
  nft: Nft
  canClaim?: boolean
  tokenIds?: number[]
  onClaim?: () => Promise<ethers.providers.TransactionResponse>
  refresh: () => void
}

const Header = styled(InfoRow)`
  min-height: 28px;
`

const DetailsButton = styled(Button).attrs({ variant: 'text' })`
  height: auto;
  padding: 16px 24px;

  &:hover:not(:disabled):not(:active) {
    background-color: transparent;
  }

  &:focus:not(:active) {
    box-shadow: none;
  }
`

const InfoBlock = styled.div`
  padding: 24px;
`

const NftCard: React.FC<NftCardProps> = ({ nft, canClaim = false, tokenIds = [], onClaim, refresh }) => {
  const [isOpen, setIsOpen] = useState(false)
  const { t } = useTranslation()
  const { profile } = useProfile()
  const { identifier, name, description } = nft
  const walletOwnsNft = tokenIds.length > 0
  const Icon = isOpen ? ChevronUpIcon : ChevronDownIcon

  const handleClick = async () => {
    setIsOpen(!isOpen)
  }

  const handleSuccess = () => {
    refresh()
  }

  const [onPresentTransferModal] = useModal(
    <TransferNftModal nft={nft} tokenIds={tokenIds} onSuccess={handleSuccess} />,
  )
  const [onPresentClaimModal] = useModal(<ClaimNftModal nft={nft} onSuccess={handleSuccess} onClaim={onClaim} />)

  return (
    <Card isActive={walletOwnsNft}>
      <Preview nft={nft} isOwned={walletOwnsNft} />
      <CardBody>
        <Header>
          <Heading>{name}</Heading>
          {walletOwnsNft && (
            <Tag outline variant="secondary">
              {t('In Wallet')}
            </Tag>
          )}
          {profile?.nft?.identifier === identifier && (
            <Tag outline variant="success">
              {t('Profile Pic')}
            </Tag>
          )}
        </Header>
        {canClaim && (
          <Button width="100%" mt="24px" onClick={onPresentClaimModal}>
            {t('Claim this NFT')}
          </Button>
        )}
        {walletOwnsNft && (
          <Button width="100%" variant="secondary" mt="24px" onClick={onPresentTransferModal}>
            {t('Transfer')}
          </Button>
        )}
      </CardBody>
      <CardFooter p="0">
        <DetailsButton width="100%" endIcon={<Icon width="24px" color="primary" />} onClick={handleClick}>
          {t('Details')}
        </DetailsButton>
        {isOpen && (
          <InfoBlock>
            <Text as="p" color="textSubtle" style={{ textAlign: 'center' }}>
              {t(description)}
            </Text>
          </InfoBlock>
        )}
      </CardFooter>
    </Card>
  )
}

export default NftCard
