import React from 'react'
import { BoxProps, Flex, Text } from '@pancakeswap-libs/uikit'
import { BetPosition, Round } from 'state/types'
import { useTranslation } from 'contexts/Localization'
import { formatUsd, getMultiplier } from '../../helpers'
import PositionTag from '../PositionTag'
import { LockPriceRow, PayoutRow, PrizePoolRow, RoundResultBox } from './styles'

interface RoundResultProps extends BoxProps {
  round: Round
}

const RoundResult: React.FC<RoundResultProps> = ({ round, ...props }) => {
  const { lockPrice, closePrice, totalAmount, bullAmount, bearAmount } = round
  const betPosition = closePrice > lockPrice ? BetPosition.BULL : BetPosition.BEAR
  const isPositionUp = betPosition === BetPosition.BULL
  const { t } = useTranslation()
  const priceDifference = closePrice - lockPrice
  const bullMultiplier = getMultiplier(totalAmount, bullAmount)
  const bearMultiplier = getMultiplier(totalAmount, bearAmount)

  return (
    <RoundResultBox betPosition={betPosition} {...props}>
      <Text color="textSubtle" fontSize="12px" bold textTransform="uppercase" mb="8px">
        {t('Closed Price')}
      </Text>
      {round.failed ? (
        <Text bold textTransform="uppercase" color="textDisabled" mb="16px" fontSize="24px">
          {t('Canceled')}
        </Text>
      ) : (
        <Flex alignItems="center" justifyContent="space-between" mb="16px">
          <Text color={isPositionUp ? 'success' : 'failure'} bold fontSize="24px">
            {formatUsd(closePrice)}
          </Text>
          <PositionTag betPosition={betPosition}>{formatUsd(priceDifference)}</PositionTag>
        </Flex>
      )}
      {lockPrice && <LockPriceRow lockPrice={lockPrice} />}
      <PrizePoolRow totalAmount={totalAmount} />
      <PayoutRow positionLabel={t('Up')} multiplier={bullMultiplier} amount={round.bullAmount} />
      <PayoutRow positionLabel={t('Down')} multiplier={bearMultiplier} amount={round.bearAmount} />
    </RoundResultBox>
  )
}

export default RoundResult
