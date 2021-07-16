import React from 'react'
import { CardBody, Text, WaitIcon } from '@rug-zombie-libs/uikit'
import { useTranslation } from 'contexts/Localization'
import { Round, BetPosition } from 'state/types'
import { useGetCurrentEpoch, useGetTotalIntervalBlocks } from 'state/hooks'
import { formatRoundTime } from '../../helpers'
import useRoundCountdown from '../../hooks/useRoundCountdown'
import { RoundResultBox } from '../RoundResult'
import MultiplierArrow from './MultiplierArrow'
import Card from './Card'
import CardHeader from './CardHeader'

interface SoonRoundCardProps {
  bid: any
}

const SoonRoundCard: React.FC<SoonRoundCardProps> = ({ bid }) => {
  const { t } = useTranslation()
  const interval = useGetTotalIntervalBlocks()
  const currentEpoch = useGetCurrentEpoch()
  // const seconds = useRoundCountdown(round.epoch - currentEpoch + 1)
  // const countdown = formatRoundTime(seconds)

  return (
    <Card>
      <CardHeader
        status="soon"
        icon={<WaitIcon mr="4px" width="21px" />}
        title={t('TBA')}
        bid={bid}
      />
      <CardBody p="16px">
        <RoundResultBox>
          <Text textAlign="center">
            <Text bold>{t('Auction End')}</Text>
            <Text fontSize="24px" bold>
              {/* {`~${countdown}`} */}
            </Text>
          </Text>
        </RoundResultBox>
      </CardBody>
    </Card>
  )
}

export default SoonRoundCard
