import React from 'react'
import { CardBody, Text, WaitIcon } from '@pancakeswap-libs/uikit'
import useI18n from 'hooks/useI18n'
import { Round, BetPosition } from 'state/types'
import { useGetIntervalBlocks } from 'state/hooks'
import { formatRoundTime } from '../../helpers'
import useBlockCountdown from '../../hooks/useGetBlockCountdown'
import MultiplierArrow from './MultiplierArrow'
import Card from './Card'
import RoundInfoBox from './RoundInfoBox'
import CardHeader from './CardHeader'

interface SoonRoundCardProps {
  round: Round
}

const SoonRoundCard: React.FC<SoonRoundCardProps> = ({ round }) => {
  const TranslateString = useI18n()
  const intervalBlocks = useGetIntervalBlocks()
  const estimatedEndBlock = round.startBlock + intervalBlocks
  const seconds = useBlockCountdown(estimatedEndBlock)
  const countdown = formatRoundTime(seconds)

  return (
    <Card>
      <CardHeader
        status="soon"
        icon={<WaitIcon mr="4px" width="21px" />}
        title={TranslateString(999, 'Later')}
        epoch={round.epoch}
        blockNumber={estimatedEndBlock}
        timerPrefix={TranslateString(999, 'Start')}
      />
      <CardBody p="16px">
        <MultiplierArrow isDisabled />
        <RoundInfoBox>
          <Text textAlign="center">
            <Text bold>{TranslateString(999, 'Entry starts')}</Text>
            <Text fontSize="24px" bold>
              {countdown}
            </Text>
          </Text>
        </RoundInfoBox>
        <MultiplierArrow betPosition={BetPosition.BEAR} isDisabled />
      </CardBody>
    </Card>
  )
}

export default SoonRoundCard
