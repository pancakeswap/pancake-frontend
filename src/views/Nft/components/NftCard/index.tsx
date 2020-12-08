import React, { useContext, useEffect, useState } from 'react'
import styled from 'styled-components'
import { Card, CardBody, Heading, Text, Tag, Button, useModal } from '@pancakeswap-libs/uikit'
import { useWallet } from 'use-wallet'
import useI18n from 'hooks/useI18n'
import { Nft } from 'sushi/lib/constants/types'
import InfoRow from '../InfoRow'
import { getPancakeRabbitContract } from '../../utils/contracts'
import Image from '../Image'
import { NftProviderContext } from '../../contexts/NftProvider'
import ClaimNftModal from '../ClaimNftModal'
import BurnNftModal from '../BurnNftModal'

interface NftCardProps {
  nft: Nft
}

const Header = styled(InfoRow)`
  margin-bottom: 24px;
  min-height: 28px;
`

const InfoBlock = styled.div`
  margin-bottom: 16px;
`

const Value = styled(Text)`
  font-weight: 600;
`

const NftCard: React.FC<NftCardProps> = ({ nft }) => {
  const [state, setState] = useState({ isLoading: true, bunnyCount: 0 })
  const { account } = useWallet()
  const TranslateString = useI18n()
  const { isInitialized, canClaim, hasClaimed, balanceOf, canBurnNft, getTokenIds, reInitialize } = useContext(
    NftProviderContext,
  )
  const { bunnyId } = nft
  const walletCanClaim = canClaim && !hasClaimed
  const tokenIds = getTokenIds(nft.bunnyId)

  const [onPresentClaimModal] = useModal(<ClaimNftModal nft={nft} onSuccess={reInitialize} />)
  const [onPresentBurnModal] = useModal(<BurnNftModal nft={nft} tokenIds={tokenIds} onSuccess={reInitialize} />)

  const isActive = isInitialized && canBurnNft && tokenIds && tokenIds.length > 0

  useEffect(() => {
    const fetchRabbitInfo = async () => {
      const { methods } = getPancakeRabbitContract({ from: account })
      const bunnyCount = await methods.bunnyCount(bunnyId).call()

      setState({ isLoading: false, bunnyCount })
    }

    if (account) {
      fetchRabbitInfo()
    }
  }, [balanceOf, account, bunnyId, setState])

  return (
    <Card isActive={isActive}>
      <Image src={`/images/nfts/${nft.previewImage}`} alt={nft.name} />
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
        <InfoBlock>
          <InfoRow>
            <Text>{TranslateString(999, 'Value if traded in')}:</Text>
            <Value>10 CAKE</Value>
          </InfoRow>
          <InfoRow>
            <Text>{TranslateString(999, 'Number minted')}:</Text>
            <Value>{state.isLoading ? '...' : state.bunnyCount}</Value>
          </InfoRow>
        </InfoBlock>
        {isInitialized && walletCanClaim && (
          <Button fullWidth onClick={onPresentClaimModal}>
            {TranslateString(999, 'Claim this NFT')}
          </Button>
        )}
        {isActive && (
          <Button variant="secondary" fullWidth onClick={onPresentBurnModal}>
            {TranslateString(999, 'Trade in for CAKE')}
          </Button>
        )}
      </CardBody>
    </Card>
  )
}

export default NftCard
