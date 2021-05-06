import React from 'react'
import styled from 'styled-components'
import { Box, CardBody, Flex, LinkExternal, PlayCircleOutlineIcon, Text, useTooltip } from '@pancakeswap-libs/uikit'
import { useTranslation } from 'contexts/Localization'
import { Round, BetPosition } from 'state/types'
import { useBlock, useGetIntervalBlocks } from 'state/hooks'
import { useBnbUsdtTicker } from 'hooks/ticker'
import BlockProgress from 'components/BlockProgress'
import { formatUsd, getBubbleGumBackground } from '../../helpers'
import PositionTag from '../PositionTag'
import { RoundResultBox, LockPriceRow, PrizePoolRow } from '../RoundResult'
import MultiplierArrow from './MultiplierArrow'
import Card from './Card'
import CardHeader from './CardHeader'
import CanceledRoundCard from './CanceledRoundCard'
import CalculatingCard from './CalculatingCard'

interface LiveRoundCardProps {
  round: Round
  betAmount?: number
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
  betAmount,
  hasEnteredUp,
  hasEnteredDown,
  bullMultiplier,
  bearMultiplier,
}) => {
  const { t } = useTranslation()
  const { lockPrice, lockBlock, totalAmount } = round
  const { stream } = useBnbUsdtTicker()
  const { currentBlock } = useBlock()
  const totalInterval = useGetIntervalBlocks()
  const isBull = stream?.lastPrice > lockPrice
  const priceColor = isBull ? 'success' : 'failure'
  const estimatedEndBlock = lockBlock + totalInterval
  const priceDifference = stream?.lastPrice - lockPrice

  const tooltipContent = (
    <Box width="256px">
      {t('The final price at the end of a round may be different from the price shown on the live feed.')}
      <LinkExternal href="https://docs.pancakeswap.finance/products/prediction" mt="8px">
        {t('Learn More')}
      </LinkExternal>
    </Box>
  )
  const { targetRef, tooltip, tooltipVisible } = useTooltip(tooltipContent, { placement: 'bottom' })

  if (round.failed) {
    return <CanceledRoundCard round={round} />
  }

  if (currentBlock > estimatedEndBlock) {
    return <CalculatingCard round={round} />
  }

  return (
    <GradientBorder>
      <GradientCard>
        <CardHeader
          status="live"
          icon={<PlayCircleOutlineIcon mr="4px" width="24px" color="secondary" />}
          title={t('Live')}
          epoch={round.epoch}
          blockNumber={estimatedEndBlock}
        />
        <BlockProgress variant="flat" scale="sm" startBlock={lockBlock} endBlock={estimatedEndBlock} />
        <CardBody p="16px">
          <MultiplierArrow
            totalAmount={round.bullAmount}
            betAmount={betAmount}
            multiplier={bullMultiplier}
            hasEntered={hasEnteredUp}
            isActive={isBull}
          />
          <RoundResultBox betPosition={isBull ? BetPosition.BULL : BetPosition.BEAR}>
            <Text color="textSubtle" fontSize="12px" bold textTransform="uppercase" mb="8px">
              {t('Last Price')}
            </Text>
            <Flex alignItems="center" justifyContent="space-between" mb="16px" height="36px">
              {stream && (
                <>
                  <div ref={targetRef}>
                    <Text bold color={priceColor} fontSize="24px" style={{ minHeight: '36px' }}>
                      {formatUsd(stream.lastPrice)}
                    </Text>
                  </div>
                  <PositionTag betPosition={isBull ? BetPosition.BULL : BetPosition.BEAR}>
                    {formatUsd(priceDifference)}
                  </PositionTag>
                </>
              )}
            </Flex>
            {lockPrice && <LockPriceRow lockPrice={lockPrice} />}
            <PrizePoolRow totalAmount={totalAmount} />
          </RoundResultBox>
          <MultiplierArrow
            totalAmount={round.bearAmount}
            betAmount={betAmount}
            multiplier={bearMultiplier}
            betPosition={BetPosition.BEAR}
            hasEntered={hasEnteredDown}
            isActive={!isBull}
          />
        </CardBody>
      </GradientCard>
      {tooltipVisible && tooltip}
    </GradientBorder>
  )
}

export default LiveRoundCard
