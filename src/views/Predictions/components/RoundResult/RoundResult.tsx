import React from 'react'
import { BoxProps, Flex, Text } from '@pancakeswap-libs/uikit'
import { BetPosition, Round } from 'state/types'
import useI18n from 'hooks/useI18n'
import { formatUsd } from '../../helpers'
import PositionTag from '../PositionTag'
import { LockPriceRow, PrizePoolRow, RoundResultBox } from './styles'

interface RoundResultProps extends BoxProps {
  round: Round
}

const RoundResult: React.FC<RoundResultProps> = ({ round, ...props }) => {
  const { lockPrice, closePrice, totalAmount } = round
  const betPosition = closePrice > lockPrice ? BetPosition.BULL : BetPosition.BEAR
  const isPositionUp = betPosition === BetPosition.BULL
  const TranslateString = useI18n()
  const priceDifference = closePrice - lockPrice

  return (
    <RoundResultBox betPosition={betPosition} {...props}>
      <Text color="textSubtle" fontSize="12px" bold textTransform="uppercase" mb="8px">
        {TranslateString(999, 'Closed Price')}
      </Text>
      {round.failed ? (
        <Text bold textTransform="uppercase" color="textDisabled" mb="16px" fontSize="24px">
          {TranslateString(999, 'Canceled')}
        </Text>
      ) : (
        <Flex alignItems="center" justifyContent="space-between" mb="16px">
          <Text color={isPositionUp ? 'success' : 'failure'} bold fontSize="24px">{`${formatUsd(closePrice)}`}</Text>
          <PositionTag betPosition={betPosition}>{formatUsd(priceDifference)}</PositionTag>
        </Flex>
      )}
      {lockPrice && <LockPriceRow lockPrice={lockPrice} />}
      <PrizePoolRow totalAmount={totalAmount} />
    </RoundResultBox>
  )
}

export default RoundResult
