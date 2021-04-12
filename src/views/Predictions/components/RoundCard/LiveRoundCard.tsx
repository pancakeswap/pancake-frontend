import React from 'react'
import styled from 'styled-components'
import { CardBody, Flex, PlayCircleOutlineIcon, Text } from '@pancakeswap-libs/uikit'
import useI18n from 'hooks/useI18n'
import { Round, BetPosition } from 'state/types'
import { useBlock, useGetTotalIntervalBlocks } from 'state/hooks'
import { useBnbUsdtTicker } from 'hooks/ticker'
import { formatRoundPriceDifference, formatUsd, getBubbleGumBackground } from '../../helpers'
import PositionTag from '../PositionTag'
import { RoundResultBox, LockPriceRow, PrizePoolRow } from '../RoundResult'
import MultiplierArrow from './MultiplierArrow'
import Card from './Card'
import CardHeader from './CardHeader'
import LiveRoundProgress from './RoundProgress'
import CanceledRoundCard from './CanceledRoundCard'

interface LiveRoundCardProps {
  round: Round
  hasEnteredUp: boolean
  hasEnteredDown: boolean
  bullMultiplier: number
  bearMultiplier: number
}

const GradientBorder = styled.div`
  background: linear-gradient(180deg, #53dee9 0%, #7645d9 100%);
  border-radius: 16px;
  padding: 1px;
`

const GradientCard = styled(Card)`
  background: ${({ theme }) => getBubbleGumBackground(theme)};
`

const LiveRoundCard: React.FC<LiveRoundCardProps> = ({
  round,
  hasEnteredUp,
  hasEnteredDown,
  bullMultiplier,
  bearMultiplier,
}) => {
  const TranslateString = useI18n()
  const { currentBlock } = useBlock()
  const { lockPrice, lockBlock, totalAmount } = round
  const { stream } = useBnbUsdtTicker()
  const interval = useGetTotalIntervalBlocks()
  const isBull = stream?.lastPrice > lockPrice
  const priceColor = isBull ? 'success' : 'failure'
  const estimatedEndBlock = lockBlock + interval
  const { value } = formatRoundPriceDifference(stream?.lastPrice, lockPrice)
  const isRoundStopped = currentBlock - lockBlock > interval

  if (isRoundStopped) {
    return <CanceledRoundCard round={round} />
  }

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
          <MultiplierArrow multiplier={bullMultiplier} hasEntered={hasEnteredUp} isActive={isBull} />
          <RoundResultBox betPosition={isBull ? BetPosition.BULL : BetPosition.BEAR}>
            <Text color="textSubtle" fontSize="12px" bold textTransform="uppercase" mb="8px">
              {TranslateString(999, 'Last Price')}
            </Text>
            <Flex alignItems="center" justifyContent="space-between" mb="16px" height="36px">
              {stream && (
                <>
                  <Text bold color={priceColor} fontSize="24px" style={{ minHeight: '36px' }}>
                    {formatUsd(stream.lastPrice)}
                  </Text>
                  <PositionTag betPosition={isBull ? BetPosition.BULL : BetPosition.BEAR}>{value}</PositionTag>
                </>
              )}
            </Flex>
            {lockPrice && <LockPriceRow lockPrice={lockPrice} />}
            <PrizePoolRow totalAmount={totalAmount} />
          </RoundResultBox>
          <MultiplierArrow
            multiplier={bearMultiplier}
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
