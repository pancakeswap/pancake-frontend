import React, { useContext, useEffect, useState } from 'react'
import styled from 'styled-components'
import { Card, CardBody, Heading, Text, Tag, Button, useModal } from '@pancakeswap-libs/uikit'
import { useWallet } from 'use-wallet'
import useI18n from 'hooks/useI18n'
import { Nft } from 'sushi/lib/constants/types'
import { PANCAKE_RABBITS_ADDRESS } from 'sushi/lib/constants/nfts'
import { usePancakeRabbits } from 'hooks/rework/useContract'
import InfoRow from '../InfoRow'
import Image from '../Image'
import { NftProviderContext } from '../../contexts/NftProvider'
import ClaimNftModal from '../ClaimNftModal'

interface NftCardProps {
  nft: Nft
}

const Header = styled(InfoRow)`
  margin-bottom: 24px;
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
  const { isInitialized, canClaim, hasClaimed } = useContext(NftProviderContext)
  const pancakeRabbitContract = usePancakeRabbits(PANCAKE_RABBITS_ADDRESS)
  const [onPresentClaimModal] = useModal(<ClaimNftModal nft={nft} />)
  const { serialNumber } = nft
  const walletCanClaim = canClaim && !hasClaimed

  useEffect(() => {
    const fetchRabbitInfo = async () => {
      const { methods } = pancakeRabbitContract
      const bunnyCount = await methods.bunnyCount(serialNumber).call()
      setState({ isLoading: false, bunnyCount })
    }

    if (account) {
      fetchRabbitInfo()
    }
  }, [pancakeRabbitContract, account, serialNumber, setState])

  return (
    <Card>
      <Image src={`/images/nfts/${nft.previewImage}`} alt={nft.name} />
      <CardBody>
        <Header>
          <Heading>{nft.name}</Heading>
          {isInitialized && walletCanClaim && (
            <Tag outline variant="success">
              {TranslateString(526, 'Available')}
            </Tag>
          )}
        </Header>
        <InfoBlock>
          <InfoRow>
            <Text>{TranslateString(999, 'Value if traded in')}:</Text>
            <Value>100 CAKE</Value>
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
      </CardBody>
    </Card>
  )
}

export default NftCard
