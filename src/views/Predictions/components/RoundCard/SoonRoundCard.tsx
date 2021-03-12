import React from 'react'
import { CardBody, CardHeader, Flex, Text, WaitIcon } from '@pancakeswap-libs/uikit'
import useI18n from 'hooks/useI18n'
import { Position, Round } from 'state/types'
import { padTime } from '../../helpers'
import useBlockCountdown from '../../hooks/useGetBlockCountdown'
import MultiplierArrow from './MultiplierArrow'
import Card from './Card'
import RoundInfoBox from './RoundInfoBox'

interface SoonRoundCardProps {
  round: Round
}

const SoonRoundCard: React.FC<SoonRoundCardProps> = ({ round }) => {
  const TranslateString = useI18n()
  const { minutes, seconds } = useBlockCountdown(round.startBlock)
  const padMinute = padTime(minutes >= 0 ? minutes : 0)
  const padSecond = padTime(seconds >= 0 ? seconds : 0)
  const countdown = minutes > 0 || seconds > 0 ? `~${padMinute}:${padSecond}` : TranslateString(999, 'Soon')

  return (
    <Card>
      <CardHeader p="8px">
        <Flex alignItems="center" justifyContent="space-between">
          <Flex alignItems="center">
            <WaitIcon mr="4px" width="14px" />
            <Text fontSize="14px">{TranslateString(999, 'Later')}</Text>
          </Flex>
        </Flex>
      </CardHeader>
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
        <MultiplierArrow roundPosition={Position.DOWN} isDisabled />
      </CardBody>
    </Card>
  )
}

export default SoonRoundCard
