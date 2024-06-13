import { useTranslation } from '@pancakeswap/localization'
import { BetPosition } from '@pancakeswap/prediction'
import { BoxProps, Flex, Text } from '@pancakeswap/uikit'
import { Round } from 'state/types'
import { useConfig } from '../../../context/ConfigProvider'
import PositionTag from '../../PositionTag'
import { LockPriceHistoryRow, PrizePoolHistoryRow, RoundResultBox } from '../../RoundResult/styles'
import { formatUsd } from '../helpers'

interface AIRoundResultHistoryProps extends BoxProps {
  round: Round
}

export const AIRoundResultHistory: React.FC<React.PropsWithChildren<AIRoundResultHistoryProps>> = ({
  round,
  children,
  ...props
}) => {
  const config = useConfig()
  const { lockPrice, closePrice, totalAmount } = round
  const betPosition = closePrice > lockPrice ? BetPosition.BULL : BetPosition.BEAR
  const isPositionUp = betPosition === BetPosition.BULL
  const { t } = useTranslation()
  const priceDifference = closePrice - lockPrice

  return (
    <RoundResultBox betPosition={betPosition} {...props}>
      <Text color="textSubtle" fontSize="12px" bold textTransform="uppercase" mb="8px">
        {t('Closed Price')}
      </Text>
      {round.failed ? (
        <Text bold textTransform="uppercase" color="textDisabled" mb="16px" fontSize="24px">
          {t('Cancelled')}
        </Text>
      ) : (
        <Flex alignItems="center" justifyContent="space-between" mb="16px">
          <Text color={isPositionUp ? 'success' : 'failure'} bold fontSize="24px">
            {formatUsd(closePrice, config?.displayedDecimals ?? 0)}
          </Text>
          <PositionTag betPosition={betPosition}>
            {formatUsd(priceDifference, config?.displayedDecimals ?? 0)}
          </PositionTag>
        </Flex>
      )}
      {lockPrice && <LockPriceHistoryRow lockPrice={lockPrice} />}
      <PrizePoolHistoryRow totalAmount={totalAmount} />
      {children}
    </RoundResultBox>
  )
}
