import { Card, CardBody, Flex, PlayCircleOutlineIcon, Text, useTooltip } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { NodeRound, NodeLedger, BetPosition } from 'state/types'
import { useGetBufferSeconds } from 'state/predictions/hooks'
import usePollOraclePrice from 'views/Predictions/hooks/usePollOraclePrice'
import RoundProgress from 'components/RoundProgress'
import { formatUsdv2, getHasRoundFailed, getPriceDifference } from '../../helpers'
import PositionTag from '../PositionTag'
import { RoundResultBox, LockPriceRow, PrizePoolRow } from '../RoundResult'
import MultiplierArrow from './MultiplierArrow'
import CardHeader from './CardHeader'
import CanceledRoundCard from './CanceledRoundCard'
import CalculatingCard from './CalculatingCard'
import LiveRoundPrice from './LiveRoundPrice'

interface LiveRoundCardProps {
  round: NodeRound
  betAmount?: NodeLedger['amount']
  hasEnteredUp: boolean
  hasEnteredDown: boolean
  bullMultiplier: string
  bearMultiplier: string
}

const LiveRoundCard: React.FC<LiveRoundCardProps> = ({
  round,
  betAmount,
  hasEnteredUp,
  hasEnteredDown,
  bullMultiplier,
  bearMultiplier,
}) => {
  const { t } = useTranslation()
  const { lockPrice, totalAmount, lockTimestamp, closeTimestamp } = round
  const price = usePollOraclePrice()
  const bufferSeconds = useGetBufferSeconds()

  const isBull = lockPrice && price.gt(lockPrice)

  const priceDifference = getPriceDifference(price, lockPrice)
  const hasRoundFailed = getHasRoundFailed(round, bufferSeconds)

  const { targetRef, tooltip, tooltipVisible } = useTooltip(t('Last price from Chainlink Oracle'), {
    placement: 'bottom',
  })

  if (hasRoundFailed) {
    return <CanceledRoundCard round={round} />
  }

  if (Date.now() > closeTimestamp * 1000) {
    return <CalculatingCard round={round} hasEnteredDown={hasEnteredDown} hasEnteredUp={hasEnteredUp} />
  }

  return (
    <Card isActive>
      <CardHeader
        status="live"
        icon={<PlayCircleOutlineIcon mr="4px" width="24px" color="secondary" />}
        title={t('Live')}
        epoch={round.epoch}
      />
      <RoundProgress variant="flat" scale="sm" lockTimestamp={lockTimestamp} closeTimestamp={closeTimestamp} />
      <CardBody p="16px">
        <MultiplierArrow
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
            <div ref={targetRef}>
              <LiveRoundPrice isBull={isBull} />
            </div>
            <PositionTag betPosition={isBull ? BetPosition.BULL : BetPosition.BEAR}>
              {formatUsdv2(priceDifference)}
            </PositionTag>
          </Flex>
          {lockPrice && <LockPriceRow lockPrice={lockPrice} />}
          <PrizePoolRow totalAmount={totalAmount} />
        </RoundResultBox>
        <MultiplierArrow
          betAmount={betAmount}
          multiplier={bearMultiplier}
          betPosition={BetPosition.BEAR}
          hasEntered={hasEnteredDown}
          isActive={!isBull}
        />
      </CardBody>
      {tooltipVisible && tooltip}
    </Card>
  )
}

export default LiveRoundCard
