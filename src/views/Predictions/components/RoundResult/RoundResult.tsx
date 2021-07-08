import React from 'react'
import { ethers } from 'ethers'
import { BoxProps, Flex, Skeleton, Text } from '@pancakeswap/uikit'
import { BetPosition, NodeRound } from 'state/types'
import { useTranslation } from 'contexts/Localization'
import { formatUsdv2, getPriceDifference } from '../../helpers'
import PositionTag from '../PositionTag'
import { LockPriceRow, PrizePoolRow, RoundResultBox } from './styles'

interface RoundResultProps extends BoxProps {
  round: NodeRound
  hasFailed?: boolean
}

const getBetPosition = (closePrice: ethers.BigNumber, lockPrice: ethers.BigNumber) => {
  if (!closePrice) {
    return null
  }

  if (closePrice.eq(lockPrice)) {
    return BetPosition.HOUSE
  }

  return closePrice.gt(lockPrice) ? BetPosition.BULL : BetPosition.BEAR
}

const RoundResult: React.FC<RoundResultProps> = ({ round, hasFailed = false, children, ...props }) => {
  const { lockPrice, closePrice, totalAmount } = round
  const betPosition = getBetPosition(closePrice, lockPrice)
  const isPositionUp = betPosition === BetPosition.BULL
  const { t } = useTranslation()
  const priceDifference = getPriceDifference(closePrice, lockPrice)

  return (
    <RoundResultBox betPosition={betPosition} {...props}>
      <Text color="textSubtle" fontSize="12px" bold textTransform="uppercase" mb="8px">
        {t('Closed Price')}
      </Text>
      {hasFailed ? (
        <Text bold textTransform="uppercase" color="textDisabled" mb="16px" fontSize="24px">
          {t('Canceled')}
        </Text>
      ) : (
        <Flex alignItems="center" justifyContent="space-between" mb="16px">
          {closePrice ? (
            <Text color={isPositionUp ? 'success' : 'failure'} bold fontSize="24px">
              {formatUsdv2(closePrice)}
            </Text>
          ) : (
            <Skeleton height="34px" my="1px" />
          )}
          <PositionTag betPosition={betPosition}>{formatUsdv2(priceDifference)}</PositionTag>
        </Flex>
      )}
      {lockPrice && <LockPriceRow lockPrice={lockPrice} />}
      <PrizePoolRow totalAmount={totalAmount} />
      {children}
    </RoundResultBox>
  )
}

export default RoundResult
