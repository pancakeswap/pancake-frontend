import React from 'react'
import styled from 'styled-components'
import { Card, CardBody, Heading, Text, Tag } from '@pancakeswap-libs/uikit'
import useI18n from 'hooks/useI18n'
import { Nft } from 'sushi/lib/constants/types'
import InfoRow from '../InfoRow'
import Image from '../Image'

interface NftCardProps {
  nft: Nft
}

const Header = styled(InfoRow)`
  margin-bottom: 24px;
`

const Value = styled(Text)`
  font-weight: 600;
`

const NftCard: React.FC<NftCardProps> = ({ nft }) => {
  const TranslateString = useI18n()

  return (
    <Card>
      <Image src={`/images/nfts/${nft.previewImage}`} alt={nft.name} />
      <CardBody>
        <Header>
          <Heading>{nft.name}</Heading>
          <Tag outline variant="pink">
            {TranslateString(526, 'Available')}
          </Tag>
        </Header>
        <InfoRow>
          <Text>{TranslateString(999, 'Value if traded in')}:</Text>
          <Value>100 CAKE</Value>
        </InfoRow>
        <InfoRow>
          <Text>{TranslateString(999, 'Number minted')}:</Text>
          <Value>300</Value>
        </InfoRow>
      </CardBody>
    </Card>
  )
}

export default NftCard
