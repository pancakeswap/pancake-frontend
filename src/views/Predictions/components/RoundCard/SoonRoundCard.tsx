import React from 'react'
import { Card, CardBody, Text, WaitIcon } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { NodeRound, BetPosition } from 'state/types'
import { useGetCurrentEpoch, useGetTotalIntervalBlocks } from 'state/predictions/hooks'
import useTheme from 'hooks/useTheme'
import { formatRoundTime } from '../../helpers'
import useRoundCountdown from '../../hooks/useRoundCountdown'
import { RoundResultBox } from '../RoundResult'
import MultiplierArrow from './MultiplierArrow'
import CardHeader, { getBorderBackground } from './CardHeader'

interface SoonRoundCardProps {
  round: NodeRound
}

const SoonRoundCard: React.FC<SoonRoundCardProps> = ({ round }) => {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const interval = useGetTotalIntervalBlocks()
  const currentEpoch = useGetCurrentEpoch()
  const estimatedEndBlock = round.startBlock + interval
  const seconds = useRoundCountdown(round.epoch - currentEpoch + 1)
  const countdown = formatRoundTime(seconds)

  return (
    <Card borderBackground={getBorderBackground(theme, 'soon')}>
      <CardHeader
        status="soon"
        icon={<WaitIcon mr="4px" width="21px" />}
        title={t('Later')}
        epoch={round.epoch}
        blockNumber={estimatedEndBlock}
      />
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
