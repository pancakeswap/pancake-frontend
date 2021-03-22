import React from 'react'
import styled from 'styled-components'
import { BlockIcon, CardBody, Flex, Text } from '@pancakeswap-libs/uikit'
import useI18n from 'hooks/useI18n'
import { Round, Position } from 'state/types'
import { formatBnbFromBigNumber, formatRoundPriceDifference, formatUsdFromBigNumber } from '../../helpers'
import MultiplierArrow from './MultiplierArrow'
import Card from './Card'
import RoundInfoBox from './RoundInfoBox'
import { PositionTag } from './Tag'
import CardHeader from './CardHeader'

interface ExpiredRoundCardProps {
  round: Round
}

const StyledExpiredRoundCard = styled(Card)`
  opacity: 0.7;
  transition: opacity 300ms;

  &:hover {
    opacity: 1;
  }
`

const ExpiredRoundCard: React.FC<ExpiredRoundCardProps> = ({ round }) => {
  const TranslateString = useI18n()
  const { endBlock, lockPrice, closePrice, bullAmount, bearAmount } = round
  const roundPosition = closePrice.gt(lockPrice) ? Position.UP : Position.DOWN
  const isPositionUp = roundPosition === Position.UP
  const prizePool = bullAmount.plus(bearAmount)

  return (
    <StyledExpiredRoundCard>
      <CardHeader
        status="expired"
        icon={<BlockIcon mr="4px" width="21px" color="textDisabled" />}
        title={TranslateString(999, 'Expired')}
        blockNumber={endBlock}
        epoch={round.epoch}
      />
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
    </StyledExpiredRoundCard>
  )
}

export default ExpiredRoundCard
