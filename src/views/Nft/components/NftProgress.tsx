import React, { useContext } from 'react'
import styled from 'styled-components'
import { Card, CardBody, Heading, OpenNewIcon, Text, Link as UIKitLink } from '@pancakeswap-libs/uikit'
import { BSC_BLOCK_TIME } from 'config'
import useI18n from 'hooks/useI18n'
import useBlock from 'hooks/useBlock'
import getTimePeriods from 'utils/getTimePeriods'
import formatTimePeriod from 'utils/formatTimePeriod'
import { RabbitMintingContext } from '../contexts/NftProvider'

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

const Message = styled.p`
  color: ${({ theme }) => theme.colors.textSubtle};
  font-size: 14px;
  padding-top: 16px;
  text-align: center;
`

const NftProgress = () => {
  const { isInitialized, currentDistributedSupply, totalSupplyDistributed, endBlockNumber } = useContext(
    RabbitMintingContext,
  )
  const TranslateString = useI18n()
  const currentBlock = useBlock()

  // TODO - use "endBlockNumer"
  const secondsRemaining = (endBlockNumber - currentBlock) * BSC_BLOCK_TIME
  const timeLeft = formatTimePeriod(getTimePeriods(secondsRemaining), ['seconds'])

  return (
    <Card>
      <CardBody>
        <TimeLeft>
          {timeLeft ? TranslateString(999, `${timeLeft} left to trade in NFTs`) : TranslateString(999, 'Finished!')}
        </TimeLeft>
        <Row>
          <Text>{TranslateString(999, "Total NFT's claimed")}:</Text>
          <Text>
            <strong>{!isInitialized ? '...' : `${currentDistributedSupply}/${totalSupplyDistributed}`}</strong>
          </Text>
        </Row>
        <Row>
          <Text>{TranslateString(999, 'Can be traded until')}:</Text>
          <div>
            {!isInitialized ? (
              '...'
            ) : (
              <Link href={`https://bscscan.com/block/${endBlockNumber}`} target="_blank" rel="noreferrer noopener">
                {`Block ${endBlockNumber}`}
                <OpenNewIcon color="primary" ml="2px" />
              </Link>
            )}{' '}
          </div>
        </Row>
        <Message>{TranslateString(999, 'NFTs can be traded in for CAKE until the above block height')}</Message>
      </CardBody>
    </Card>
  )
}

export default NftProgress
