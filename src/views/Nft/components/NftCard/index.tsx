import React from 'react'
import styled from 'styled-components'
import { Button, Card, CardBody, Heading, Text, Tag } from '@pancakeswap-libs/uikit'
import useI18n from 'hooks/useI18n'
import InfoRow from '../InfoRow'
import NftLink from '../NftLink'

const NftImage = styled.div`
  overflow: hidden;
`

const Header = styled(InfoRow)`
  margin-bottom: 24px;
`

const NftCard = () => {
  const TranslateString = useI18n()

  return (
    <Card>
      <NftImage>
        <img src="/nft-temp.svg" alt="nft temp" />
      </NftImage>
      <CardBody>
        <Header>
          <Heading>Swapsies</Heading>
          <Tag outline variant="pink">
            {TranslateString(526, 'Available')}
          </Tag>
        </Header>
        <InfoRow>
          <Text>{TranslateString(999, 'Value')}:</Text>
          <Text>100 CAKE</Text>
        </InfoRow>
        <InfoRow>
          <Text>{TranslateString(999, 'Time left to trade in')}:</Text>
          <NftLink href="https://pancakeswap.info">100 Blocks</NftLink>
        </InfoRow>
        <Button fullWidth my="24px">
          {TranslateString(999, 'Claim this NFT')}
        </Button>
        <InfoRow>
          <Text>{TranslateString(999, 'Series')}</Text>
          <Text>1</Text>
        </InfoRow>
        <InfoRow>
          <Text>{TranslateString(999, 'Number already minted')}:</Text>
          <Text>300</Text>
        </InfoRow>
      </CardBody>
    </Card>
  )
}

export default NftCard
