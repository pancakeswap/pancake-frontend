import React from 'react'
import { BlockIcon, CardBody, CardHeader, Flex, Text } from '@pancakeswap-libs/uikit'
import useI18n from 'hooks/useI18n'
import { Round, Position } from 'state/types'
import { formatBnbFromBigNumber, formatRoundPriceDifference, formatUsdFromBigNumber } from '../../helpers'
import MultiplierArrow from './MultiplierArrow'
import Card from './Card'
import RoundInfoBox from './RoundInfoBox'
import { PositionTag } from './Tag'

interface ExpiredPositionCardProps {
  round: Round
}

const ExpiredPositionCard: React.FC<ExpiredPositionCardProps> = ({ round }) => {
  const TranslateString = useI18n()
  const { endBlock, lockPrice, closePrice, bullAmount, bearAmount } = round
  const roundPosition = closePrice.gt(lockPrice) ? Position.UP : Position.DOWN
  const isPositionUp = roundPosition === Position.UP
  const prizePool = bullAmount.plus(bearAmount)

  return (
    <Card>
      <CardHeader p="8px">
        <Flex alignItems="center" justifyContent="space-between">
          <Flex alignItems="center">
            <BlockIcon mr="4px" width="14px" color="textDisabled" />
            <Text fontSize="14px" color="textDisabled">
              {TranslateString(999, 'Expired')}
            </Text>
          </Flex>
          <Text fontSize="14px" color="textDisabled">
            {TranslateString(999, `Ended: Block ${endBlock}`, { num: endBlock })}
          </Text>
        </Flex>
      </CardHeader>
      <CardBody p="16px">
        <MultiplierArrow multiplier={10.3} isActive={roundPosition === Position.UP} hasEntered={false} />
        <RoundInfoBox roundPosition={roundPosition}>
          <Text color="textSubtle" fontSize="12px" bold textTransform="uppercase" mb="8px">
            {TranslateString(999, 'Closed Price')}
          </Text>
          <Flex alignItems="center" justifyContent="space-between" mb="16px">
            <Text color={isPositionUp ? 'success' : 'failure'} bold fontSize="24px">{`${formatUsdFromBigNumber(
              closePrice,
            )}`}</Text>
            <PositionTag roundPosition={roundPosition}>{formatRoundPriceDifference(lockPrice, closePrice)}</PositionTag>
          </Flex>
          <Flex alignItems="center" justifyContent="space-between">
            <Text fontSize="14px">{TranslateString(999, 'Locked Price')}:</Text>
            <Text fontSize="14px">{`${formatUsdFromBigNumber(lockPrice)}`}</Text>
          </Flex>
          <Flex alignItems="center" justifyContent="space-between">
            <Text bold>{TranslateString(999, 'Prize Pool')}:</Text>
            <Text bold>{`${formatBnbFromBigNumber(prizePool)} BNB`}</Text>
          </Flex>
        </RoundInfoBox>
        <MultiplierArrow
          multiplier={1}
          roundPosition={Position.DOWN}
          isActive={roundPosition === Position.DOWN}
          hasEntered={false}
        />
      </CardBody>
    </Card>
  )
}

export default ExpiredPositionCard
