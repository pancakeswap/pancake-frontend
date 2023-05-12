import { useEffect, useState, useMemo } from 'react'
import { Card, CardBody, Flex, PlayCircleOutlineIcon, Text, useTooltip } from '@pancakeswap/uikit'
import { getNow } from 'utils/getNow'
import { useTranslation } from '@pancakeswap/localization'
import { NodeRound, NodeLedger, BetPosition } from 'state/types'
import { useGetBufferSeconds } from 'state/predictions/hooks'
import { getHasRoundFailed } from 'state/predictions/helpers'
import usePollOraclePrice from 'views/Predictions/hooks/usePollOraclePrice'
import RoundProgress from 'components/RoundProgress'
import { formatUsdv2, getPriceDifference } from '../../helpers'
import PositionTag from '../PositionTag'
import { RoundResultBox, LockPriceRow, PrizePoolRow } from '../RoundResult'
import MultiplierArrow from './MultiplierArrow'
import CardHeader from './CardHeader'
import CanceledRoundCard from './CanceledRoundCard'
import CalculatingCard from './CalculatingCard'
import LiveRoundPrice from './LiveRoundPrice'
import { useConfig } from '../../context/ConfigProvider'

interface LiveRoundCardProps {
  round: NodeRound
  betAmount?: NodeLedger['amount']
  hasEnteredUp: boolean
  hasEnteredDown: boolean
  bullMultiplier: string
  bearMultiplier: string
}

const REFRESH_PRICE_BEFORE_SECONDS_TO_CLOSE = 2

const SHOW_HOUSE_BEFORE_SECONDS_TO_CLOSE = 20

const LiveRoundCard: React.FC<React.PropsWithChildren<LiveRoundCardProps>> = ({
  round,
  betAmount,
  hasEnteredUp,
  hasEnteredDown,
  bullMultiplier,
  bearMultiplier,
}) => {
  const { t } = useTranslation()
  const { lockPrice, totalAmount, lockTimestamp, closeTimestamp } = round
  const { price, refresh } = usePollOraclePrice()
  const bufferSeconds = useGetBufferSeconds()
  const { displayedDecimals } = useConfig()

  const [isCalculatingPhase, setIsCalculatingPhase] = useState(false)

  const isHouse = useMemo(() => {
    const secondsToClose = closeTimestamp ? closeTimestamp - getNow() : 0
    return lockPrice && price === lockPrice && secondsToClose <= SHOW_HOUSE_BEFORE_SECONDS_TO_CLOSE
  }, [closeTimestamp, lockPrice, price])

  const isBull = lockPrice && price > lockPrice

  const betPosition = isHouse ? BetPosition.HOUSE : isBull ? BetPosition.BULL : BetPosition.BEAR

  const priceDifference = getPriceDifference(price, lockPrice)
  const hasRoundFailed = getHasRoundFailed(round.oracleCalled, round.closeTimestamp, bufferSeconds)

  const { targetRef, tooltip, tooltipVisible } = useTooltip(t('Last price from Chainlink Oracle'), {
    placement: 'bottom',
  })

  useEffect(() => {
    const secondsToClose = closeTimestamp ? closeTimestamp - getNow() : 0
    if (secondsToClose > 0) {
      const refreshPriceTimeout = setTimeout(() => {
        refresh()
      }, (secondsToClose - REFRESH_PRICE_BEFORE_SECONDS_TO_CLOSE) * 1000)

      const calculatingPhaseTimeout = setTimeout(() => {
        setIsCalculatingPhase(true)
      }, secondsToClose * 1000)

      return () => {
        clearTimeout(refreshPriceTimeout)
        clearTimeout(calculatingPhaseTimeout)
      }
    }
    return undefined
  }, [refresh, closeTimestamp])

  if (hasRoundFailed) {
    return <CanceledRoundCard round={round} />
  }

  if (isCalculatingPhase) {
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
          isActive={isHouse ? false : isBull}
          isHouse={isHouse}
        />
        <RoundResultBox betPosition={betPosition}>
          <Text color="textSubtle" fontSize="12px" bold textTransform="uppercase" mb="8px">
            {t('Last Price')}
          </Text>
          <Flex alignItems="center" justifyContent="space-between" mb="16px" height="36px">
            <div ref={targetRef}>
              <LiveRoundPrice betPosition={betPosition} price={price} />
            </div>
            <PositionTag betPosition={betPosition}>{formatUsdv2(priceDifference, displayedDecimals)}</PositionTag>
          </Flex>
          {lockPrice && <LockPriceRow lockPrice={lockPrice} />}
          <PrizePoolRow totalAmount={totalAmount} />
        </RoundResultBox>
        <MultiplierArrow
          betAmount={betAmount}
          multiplier={bearMultiplier}
          betPosition={BetPosition.BEAR}
          hasEntered={hasEnteredDown}
          isActive={isHouse ? false : !isBull}
          isHouse={isHouse}
        />
      </CardBody>
      {tooltipVisible && tooltip}
    </Card>
  )
}

export default LiveRoundCard
