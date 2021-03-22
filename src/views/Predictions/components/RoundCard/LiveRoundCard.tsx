import React from 'react'
import styled from 'styled-components'
import { CardBody, Flex, PlayCircleOutlineIcon, Progress, Text } from '@pancakeswap-libs/uikit'
import useI18n from 'hooks/useI18n'
import { Round, Position } from 'state/types'
import { useBnbUsdtTicker } from 'hooks/ticker'
import { formatBnbFromBigNumber, formatUsd, getBubbleGumBackground } from '../../helpers'
import MultiplierArrow from './MultiplierArrow'
import Card from './Card'
import RoundInfoBox from './RoundInfoBox'
import CardHeader from './CardHeader'

interface LiveRoundCardProps {
  round: Round
}

const GradientBorder = styled.div`
  background: linear-gradient(180deg, #53dee9 0%, #7645d9 100%);
  border-radius: 16px;
  padding: 1px;
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
        <CardHeader
          status="live"
          icon={<PlayCircleOutlineIcon mr="4px" width="24px" color="secondary" />}
          title={TranslateString(999, 'Live')}
          epoch={round.epoch}
          blockNumber={endBlock}
        />
        <Progress variant="flat" primaryStep={54} />
        <CardBody p="16px">
          <MultiplierArrow multiplier={10.3} hasEntered={false} isActive={false} />
          <RoundInfoBox isActive>
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
          <MultiplierArrow multiplier={1} roundPosition={Position.DOWN} hasEntered={false} isActive={false} />
        </CardBody>
      </GradientCard>
    </GradientBorder>
  )
}

export default LiveRoundCard
