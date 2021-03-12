import React from 'react'
import styled from 'styled-components'
import { CardBody, CardHeader, Flex, PlayCircleOutlineIcon, Progress, Text } from '@pancakeswap-libs/uikit'
import useI18n from 'hooks/useI18n'
import { Round, Position } from 'state/types'
import { useBnbUsdtTicker } from 'state/hooks'
import { formatBnbFromBigNumber, formatUsd, getBubbleGumBackground } from '../../helpers'
import MultiplierArrow from './MultiplierArrow'
import Card from './Card'
import RoundInfoBox from './RoundInfoBox'

interface LiveRoundCardProps {
  round: Round
}

const GradientBorder = styled.div`
  background: linear-gradient(180deg, #53dee9 0%, #7645d9 100%);
  border-radius: 16px;
  padding: 1px;
`

const TransparentCardHeader = styled(CardHeader)`
  background: transparent;
`

const GradientCard = styled(Card)`
  background: ${({ theme }) => getBubbleGumBackground(theme)};
`

const LiveRoundCard: React.FC<LiveRoundCardProps> = ({ round }) => {
  const TranslateString = useI18n()
  const { endBlock, bullAmount, bearAmount } = round
  const { stream } = useBnbUsdtTicker()
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
              {TranslateString(999, 'Last Price')}
            </Text>
            <Flex alignItems="center" justifyContent="space-between" mb="16px">
              <Text bold fontSize="24px" style={{ minHeight: '36px' }}>
                {stream && formatUsd(stream.lastPrice)}
              </Text>
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
