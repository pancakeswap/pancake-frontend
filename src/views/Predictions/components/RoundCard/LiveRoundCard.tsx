import React from 'react'
import styled, { DefaultTheme } from 'styled-components'
import { CardBody, CardHeader, Flex, PlayCircleOutlineIcon, Progress, Text } from '@pancakeswap-libs/uikit'
import useI18n from 'hooks/useI18n'
import { Round, Position } from 'state/types'
import { formatBnbFromBigNumber, formatRoundPriceDifference, formatUsdFromBigNumber } from '../../helpers'
import MultiplierArrow from './MultiplierArrow'
import Card from './Card'
import RoundInfoBox from './RoundInfoBox'
import { PositionTag } from './Tag'

interface LiveRoundCardProps {
  round: Round
}

const GradientBorder = styled.div`
  background: linear-gradient(180deg, #53dee9 0%, #7645d9 100%);
  border-radius: 16px;
  padding: 1px;
`

// TODO: Move this to the UI Kit
const getBackground = (theme: DefaultTheme) => {
  if (theme.isDark) {
    return 'linear-gradient(139.73deg, #142339 0%, #24243D 47.4%, #37273F 100%)'
  }

  return 'linear-gradient(139.73deg, #E6FDFF 0%, #EFF4F5 46.87%, #F3EFFF 100%)'
}

const TransparentCardHeader = styled(CardHeader)`
  background: transparent;
`

const GradientCard = styled(Card)`
  background: ${({ theme }) => getBackground(theme)};
`

const LiveRoundCard: React.FC<LiveRoundCardProps> = ({ round }) => {
  const TranslateString = useI18n()
  const { endBlock, lockPrice, closePrice, bullAmount, bearAmount } = round
  const roundPosition = closePrice.gt(lockPrice) ? Position.UP : Position.DOWN
  const isPositionUp = roundPosition === Position.UP
  const prizePool = bullAmount.plus(bearAmount)

  return (
    <GradientBorder>
      <GradientCard>
        <TransparentCardHeader p="16px">
          <Flex alignItems="center" justifyContent="space-between">
            <Flex alignItems="center">
              <PlayCircleOutlineIcon mr="4px" width="21px" color="secondary" />
              <Text bold textTransform="uppercase" color="secondary">
                {TranslateString(999, 'Live')}
              </Text>
            </Flex>
            <Text color="secondary">{TranslateString(999, `Ended: Block ${endBlock}`, { num: endBlock })}</Text>
          </Flex>
        </TransparentCardHeader>
        <Progress variant="flat" primaryStep={54} />
        <CardBody p="16px">
          <MultiplierArrow multiplier={10.3} hasEntered={false} />
          <RoundInfoBox>
            <Text color="textSubtle" fontSize="12px" bold textTransform="uppercase" mb="8px">
              {TranslateString(999, 'Closed Price')}
            </Text>
            <Flex alignItems="center" justifyContent="space-between" mb="16px">
              <Text color={isPositionUp ? 'success' : 'failure'} bold fontSize="24px">{`${formatUsdFromBigNumber(
                closePrice,
              )}`}</Text>
              <PositionTag roundPosition={roundPosition}>
                {formatRoundPriceDifference(lockPrice, closePrice)}
              </PositionTag>
            </Flex>
            <Flex alignItems="center" justifyContent="space-between">
              <Text fontSize="14px">{TranslateString(999, 'Locked Price')}:</Text>
              <Text fontSize="14px">~</Text>
            </Flex>
            <Flex alignItems="center" justifyContent="space-between">
              <Text bold>{TranslateString(999, 'Prize Pool')}:</Text>
              <Text bold>{`${formatBnbFromBigNumber(prizePool)} BNB`}</Text>
            </Flex>
          </RoundInfoBox>
          <MultiplierArrow multiplier={1} roundPosition={Position.DOWN} hasEntered={false} />
        </CardBody>
      </GradientCard>
    </GradientBorder>
  )
}

export default LiveRoundCard
