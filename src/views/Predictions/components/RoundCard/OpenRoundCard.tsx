import React from 'react'
import styled from 'styled-components'
import { CardBody, Flex, PlayCircleOutlineIcon, Progress, Text } from '@pancakeswap-libs/uikit'
import useI18n from 'hooks/useI18n'
import { Round, BetPosition } from 'state/types'
import { useGetIntervalBlocks } from 'state/hooks'
import { useBnbUsdtTicker } from 'hooks/ticker'
import { formatUsd, getBubbleGumBackground } from '../../helpers'
import MultiplierArrow from './MultiplierArrow'
import Card from './Card'
import RoundInfoBox from './RoundInfoBox'
import CardHeader from './CardHeader'
import RoundInfo from './RoundInfo'

interface OpenRoundCardProps {
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

const OpenRoundCard: React.FC<OpenRoundCardProps> = ({ round }) => {
  const TranslateString = useI18n()
  const { lockPrice, startBlock, totalAmount } = round
  const { stream } = useBnbUsdtTicker()
  const intervalBlocks = useGetIntervalBlocks()

  // Open rounds do not have an endblock set so we approximate it by adding the block interval
  // to the start block
  const endBlock = startBlock + intervalBlocks * 2

  return (
    <GradientBorder>
      <GradientCard>
        <CardHeader
          status="live"
          icon={<PlayCircleOutlineIcon mr="4px" width="24px" color="secondary" />}
          title={TranslateString(1198, 'Live')}
          epoch={round.epoch}
          blockNumber={endBlock}
          timerPrefix={TranslateString(410, 'End')}
        />
        <Progress variant="flat" primaryStep={54} />
        <CardBody p="16px">
          <MultiplierArrow multiplier={10.3} hasEntered={false} isActive={false} />
          <RoundInfoBox isLive>
            <Text color="textSubtle" fontSize="12px" bold textTransform="uppercase" mb="8px">
              {TranslateString(999, 'Last Price')}
            </Text>
            <Flex alignItems="center" justifyContent="space-between" mb="16px">
              <Text bold fontSize="24px" style={{ minHeight: '36px' }}>
                {stream && formatUsd(stream.lastPrice)}
              </Text>
            </Flex>
            <RoundInfo lockPrice={lockPrice} totalAmount={totalAmount} />
          </RoundInfoBox>
          <MultiplierArrow multiplier={1} betPosition={BetPosition.BEAR} hasEntered={false} isActive={false} />
        </CardBody>
      </GradientCard>
    </GradientBorder>
  )
}

export default OpenRoundCard
