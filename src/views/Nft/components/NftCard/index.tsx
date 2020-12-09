import React, { useContext } from 'react'
import styled from 'styled-components'
import { Card, CardBody, Heading, Tag, Button, useModal } from '@pancakeswap-libs/uikit'
import useI18n from 'hooks/useI18n'
import { Nft } from 'sushi/lib/constants/types'
import InfoRow from '../InfoRow'
import Image from '../Image'
import { NftProviderContext } from '../../contexts/NftProvider'
import ClaimNftModal from '../ClaimNftModal'
import BurnNftModal from '../BurnNftModal'
import Footer from './Footer'

interface NftCardProps {
  nft: Nft
}

const Header = styled(InfoRow)`
  min-height: 28px;
`

const NftCard: React.FC<NftCardProps> = ({ nft }) => {
  const TranslateString = useI18n()
  const { isInitialized, canClaim, hasClaimed, canBurnNft, getTokenIds, reInitialize } = useContext(NftProviderContext)
  const walletCanClaim = canClaim && !hasClaimed
  const tokenIds = getTokenIds(nft.bunnyId)

  const [onPresentClaimModal] = useModal(<ClaimNftModal nft={nft} onSuccess={reInitialize} />)
  const [onPresentBurnModal] = useModal(<BurnNftModal nft={nft} tokenIds={tokenIds} onSuccess={reInitialize} />)

  const walletOwnsNft = tokenIds && tokenIds.length > 0

  return (
    <Card isActive={walletOwnsNft}>
      <Image
        src={`/images/nfts/${nft.previewImage}`}
        alt={nft.name}
        originalLink={walletOwnsNft ? nft.originalImage : null}
      />
      <CardBody>
        <Header>
          <Heading>{nft.name}</Heading>
          {isInitialized && walletCanClaim && (
            <Tag outline variant="success">
              {TranslateString(526, 'Available')}
            </Tag>
          )}
          {isInitialized && tokenIds && (
            <Tag outline variant="secondary">
              {TranslateString(999, 'In Wallet')}
            </Tag>
          )}
        </Header>
        {isInitialized && walletCanClaim && (
          <Button fullWidth onClick={onPresentClaimModal} mt="16px">
            {TranslateString(999, 'Claim this NFT')}
          </Button>
        )}
        {isInitialized && canBurnNft && walletOwnsNft && (
          <Button variant="secondary" fullWidth onClick={onPresentBurnModal} mt="16px">
            {TranslateString(999, 'Trade in for CAKE')}
          </Button>
        )}
      </CardBody>
      <Footer bunnyId={nft.bunnyId} description={nft.description} />
    </Card>
  )
}

export default NftCard
