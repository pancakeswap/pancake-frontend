import React from 'react'
import styled from 'styled-components'
import { Card, CardBody, Heading, LinkExternal, Progress, Text, Link as UIKitLink } from '@pancakeswap-libs/uikit'
import useI18n from 'hooks/useI18n'

const TimeLeft = styled(Heading)`
  margin-bottom: 16px;
  text-align: center;
`

const Row = styled.div`
  align-items: center;
  display: flex;

  & > div:first-child {
    flex: 1;
  }

  & > div:last-child {
    text-align: right;
  }
`

const Link = styled(UIKitLink)`
  text-decoration: underline;
`

const NftProgress = () => {
  const TranslateString = useI18n()
  const timeLeft = '8h 30m'
  const blocksRemaining = 459595

  return (
    <Card>
      <CardBody>
        <Text mb="16px">
          <Progress step={44} />
        </Text>
        <TimeLeft>{TranslateString(999, `${timeLeft} left to trade in NFTs`)}</TimeLeft>
        <Row>
          <Text>{TranslateString(999, "Total NFT's claimed")}:</Text>
          <Text>
            <strong>400/500</strong>
          </Text>
        </Row>
        <Row>
          <Text>{TranslateString(999, 'Can be traded until')}:</Text>
          <div>
            <Link href="htts://pancakeswap.finance" target="_blank" rel="noreferrer noopener">
              {`Block ${blocksRemaining}`}
              <LinkExternal ml="2px" />
            </Link>
          </div>
        </Row>
      </CardBody>
    </Card>
  )
}

export default NftProgress
