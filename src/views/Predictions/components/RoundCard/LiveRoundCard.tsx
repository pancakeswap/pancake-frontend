import React from 'react'
import styled from 'styled-components'
import { CardBody, Flex, PlayCircleOutlineIcon, Text } from '@pancakeswap-libs/uikit'
import useI18n from 'hooks/useI18n'
import { Round, BetPosition } from 'state/types'
import { useGetTotalIntervalBlocks } from 'state/hooks'
import { useBnbUsdtTicker } from 'hooks/ticker'
import { formatRoundPriceDifference, formatUsd, getBubbleGumBackground } from '../../helpers'
import MultiplierArrow from './MultiplierArrow'
import Card from './Card'
import RoundInfoBox from './RoundInfoBox'
import CardHeader from './CardHeader'
import RoundInfo from './RoundInfo'
import LiveRoundProgress from './RoundProgress'
import { PositionTag } from './Tag'

interface LiveRoundCardProps {
  round: Round
  hasEnteredUp: boolean
  hasEnteredDown: boolean
}

const GradientBorder = styled.div`
  background: linear-gradient(180deg, #53dee9 0%, #7645d9 100%);
  border-radius: 16px;
  padding: 1px;
`

const GradientCard = styled(Card)`
  background: ${({ theme }) => getBubbleGumBackground(theme)};
`

const LiveRoundCard: React.FC<LiveRoundCardProps> = ({ round, hasEnteredUp, hasEnteredDown }) => {
  const TranslateString = useI18n()
  const { lockPrice, lockBlock, totalAmount } = round
  const { stream } = useBnbUsdtTicker()
  const interval = useGetTotalIntervalBlocks()
  const isBull = stream?.lastPrice > lockPrice
  const priceColor = isBull ? 'success' : 'failure'
  const estimatedEndBlock = lockBlock + interval

  return (
    <GradientBorder>
      <GradientCard>
        <CardHeader
          status="live"
          icon={<PlayCircleOutlineIcon mr="4px" width="24px" color="secondary" />}
          title={TranslateString(1198, 'Live')}
          epoch={round.epoch}
          blockNumber={estimatedEndBlock}
        />
        <LiveRoundProgress startBlock={lockBlock} endBlock={estimatedEndBlock} />
        <CardBody p="16px">
          <MultiplierArrow multiplier={10.3} hasEntered={hasEnteredUp} isActive={isBull} />
          <RoundInfoBox betPosition={isBull ? BetPosition.BULL : BetPosition.BEAR}>
            <Text color="textSubtle" fontSize="12px" bold textTransform="uppercase" mb="8px">
              {TranslateString(999, 'Last Price')}
            </Text>
            <Flex alignItems="center" justifyContent="space-between" mb="16px">
              {stream && (
                <>
                  <Text bold color={priceColor} fontSize="24px" style={{ minHeight: '36px' }}>
                    {formatUsd(stream.lastPrice)}
                  </Text>
                  <PositionTag betPosition={isBull ? BetPosition.BULL : BetPosition.BEAR}>
                    {formatRoundPriceDifference(lockPrice, stream.lastPrice)}
                  </PositionTag>
                </>
              )}
            </Flex>
            <RoundInfo lockPrice={lockPrice} totalAmount={totalAmount} />
          </RoundInfoBox>
          <MultiplierArrow
            multiplier={1}
            betPosition={BetPosition.BEAR}
            hasEntered={hasEnteredDown}
            isActive={!isBull}
          />
        </CardBody>
      </GradientCard>
    </GradientBorder>
  )
}

export default LiveRoundCard
