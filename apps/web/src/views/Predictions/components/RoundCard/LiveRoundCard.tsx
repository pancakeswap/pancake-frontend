import { useTranslation } from '@pancakeswap/localization'
import { BetPosition } from '@pancakeswap/prediction'
import { Card, CardBody, Flex, PlayCircleOutlineIcon, Text, useTooltip } from '@pancakeswap/uikit'
import RoundProgress from 'components/RoundProgress'
import { useEffect, useMemo, useState } from 'react'
import { getHasRoundFailed } from 'state/predictions/helpers'
import { useGetBufferSeconds } from 'state/predictions/hooks'
import { NodeLedger, NodeRound } from 'state/types'
import { getNowInSeconds } from 'utils/getNowInSeconds'
import usePollOraclePrice from 'views/Predictions/hooks/usePollOraclePrice'
import { useConfig } from '../../context/ConfigProvider'
import { formatUsdv2, getPriceDifference } from '../../helpers'
import PositionTag from '../PositionTag'
import { LockPriceRow, PrizePoolRow, RoundResultBox } from '../RoundResult'
import CalculatingCard from './CalculatingCard'
import CanceledRoundCard from './CanceledRoundCard'
import CardHeader from './CardHeader'
import LiveRoundPrice from './LiveRoundPrice'
import MultiplierArrow from './MultiplierArrow'

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
  const bufferSeconds = useGetBufferSeconds()
  const config = useConfig()
  const { price, refresh } = usePollOraclePrice({
    chainlinkOracleAddress: config?.chainlinkOracleAddress,
    galetoOracleAddress: config?.galetoOracleAddress,
  })

  const [isCalculatingPhase, setIsCalculatingPhase] = useState(false)

  const isHouse = useMemo(() => {
    const secondsToClose = closeTimestamp ? closeTimestamp - getNowInSeconds() : 0
    return Boolean(lockPrice && price === lockPrice && secondsToClose <= SHOW_HOUSE_BEFORE_SECONDS_TO_CLOSE)
  }, [closeTimestamp, lockPrice, price])

  const isBull = Boolean(lockPrice && price > lockPrice)

  const betPosition = isHouse ? BetPosition.HOUSE : isBull ? BetPosition.BULL : BetPosition.BEAR

  const priceDifference = getPriceDifference(price, lockPrice ?? 0n)
  const hasRoundFailed = getHasRoundFailed(round.oracleCalled, round.closeTimestamp, bufferSeconds, round.closePrice)

  const { targetRef, tooltip, tooltipVisible } = useTooltip(
    config?.chainlinkOracleAddress ? t('Last price from Chainlink Oracle') : t('Last price from Pyth Oracle'),
    {
      placement: 'bottom',
    },
  )

  useEffect(() => {
    const secondsToClose = closeTimestamp ? closeTimestamp - getNowInSeconds() : 0
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
      <RoundProgress
        variant="flat"
        scale="sm"
        lockTimestamp={lockTimestamp ?? 0}
        closeTimestamp={closeTimestamp ?? 0}
      />
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
              <LiveRoundPrice
                betPosition={betPosition}
                price={price}
                displayedDecimals={config?.displayedDecimals ?? 4}
              />
            </div>
            <PositionTag betPosition={betPosition}>
              {formatUsdv2(priceDifference, config?.displayedDecimals ?? 0)}
            </PositionTag>
          </Flex>
          {lockPrice?.toString() && <LockPriceRow lockPrice={lockPrice} />}
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
