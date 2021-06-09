import React from 'react'
import { BoxProps, Flex, Text } from '@pancakeswap/uikit'
import { BetPosition, Round } from 'state/types'
import { useTranslation } from 'contexts/Localization'
import { formatUsd } from '../../helpers'
import PositionTag from '../PositionTag'
import { LockPriceRow, PrizePoolRow, RoundResultBox } from './styles'

interface RoundResultProps extends BoxProps {
  round: Round
}

const RoundResult: React.FC<RoundResultProps> = ({ round, children, ...props }) => {
  const { lockPrice, closePrice, totalAmount } = round
  const betPosition = closePrice > lockPrice ? BetPosition.BULL : BetPosition.BEAR
  const isPositionUp = betPosition === BetPosition.BULL
  const { t, currentLanguage } = useTranslation()
  const priceDifference = closePrice - lockPrice

  return (
    <RoundResultBox betPosition={betPosition} {...props}>
      <Text color="textSubtle" fontSize="12px" bold mb="8px">
        {t('Closed Price').toLocaleUpperCase(currentLanguage.locale)}
      </Text>
      {round.failed ? (
        <Text bold color="textDisabled" mb="16px" fontSize="24px">
          {t('Canceled').toLocaleUpperCase(currentLanguage.locale)}
        </Text>
      ) : (
        <Flex alignItems="center" justifyContent="space-between" mb="16px">
          <Text color={isPositionUp ? 'success' : 'failure'} bold fontSize="24px">
            {formatUsd(closePrice)}
          </Text>
          <PositionTag betPosition={betPosition}>{formatUsd(priceDifference).toUpperCase()}</PositionTag>
        </Flex>
      )}
      {lockPrice && <LockPriceRow lockPrice={lockPrice} />}
      <PrizePoolRow totalAmount={totalAmount} />
      {children}
    </RoundResultBox>
  )
}

export default RoundResult
