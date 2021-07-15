import React from 'react'
import { CardBody, Text } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { NodeRound, BetPosition } from 'state/types'
import { useGetIntervalSeconds } from 'state/hooks'
import { ROUND_BUFFER } from 'state/predictions/config'
import { formatRoundTime } from '../../helpers'
import useCountdown from '../../hooks/useCountdown'
import { RoundResultBox } from '../RoundResult'
import MultiplierArrow from './MultiplierArrow'
import Card from './Card'
import { SoonRoundCardHeader } from './CardHeader'

interface SoonRoundCardProps {
  round: NodeRound
}

const SoonRoundCard: React.FC<SoonRoundCardProps> = ({ round }) => {
  const intervalSeconds = useGetIntervalSeconds()
  const { secondsRemaining } = useCountdown(round.startTimestamp + intervalSeconds + ROUND_BUFFER)
  const countdown = formatRoundTime(secondsRemaining)
  const { t } = useTranslation()

  return (
    <Card>
      <SoonRoundCardHeader epoch={round.epoch} />
      <CardBody p="16px">
        <MultiplierArrow isDisabled />
        <RoundResultBox>
          <Text textAlign="center">
            <Text bold>{t('Entry starts')}</Text>
            <Text fontSize="24px" bold>
              {`~${countdown}`}
            </Text>
          </Text>
        </RoundResultBox>
        <MultiplierArrow betPosition={BetPosition.BEAR} isDisabled />
      </CardBody>
    </Card>
  )
}

export default SoonRoundCard
