import React from 'react'
import styled from 'styled-components'
import { Button, Card, CardBody, Heading, Text, Tag } from '@pancakeswap-libs/uikit'
import useI18n from 'hooks/useI18n'

const NftImage = styled.div`
  overflow: hidden;
`

const Info = styled.div`
  align-items: center;
  display: flex;

  *:first-child {
    flex: 1;
  }

  *:last-child {
    text-align: right;
  }
`

const Header = styled(Info)`
  margin-bottom: 24px;
`

const Link = styled.a`
  color: ${({ theme }) => theme.colors.primary};
  text-decoration: underline;
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
        <Info>
          <Text>{TranslateString(999, 'Value')}:</Text>
          <Text>100 CAKE</Text>
        </Info>
        <Info>
          <Text>{TranslateString(999, 'Time left to trade in')}:</Text>
          <Link href="https://pancakeswap.info">100 Blocks</Link>
        </Info>
        <Button fullWidth my="24px">
          {TranslateString(999, 'Claim this NFT')}
        </Button>
        <Info>
          <Text>{TranslateString(999, 'Series')}</Text>
          <Text>1</Text>
        </Info>
        <Info>
          <Text>{TranslateString(999, 'Number already minted')}:</Text>
          <Text>300</Text>
        </Info>
      </CardBody>
    </Card>
  )
}

export default NftCard
