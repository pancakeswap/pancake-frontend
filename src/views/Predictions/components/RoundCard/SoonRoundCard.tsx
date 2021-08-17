import React, { useEffect, useState } from 'react'
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
import { formatDuration } from '../../../../utils/timerHelpers'
import { auctionById } from '../../../../redux/get'

interface SoonRoundCardProps {
  lastBidId: number,
  id: number,
  bidId: number
}

const SoonRoundCard: React.FC<SoonRoundCardProps> = ({lastBidId, id, bidId}) => {
  const { t } = useTranslation()
  const interval = useGetTotalIntervalBlocks()
  const currentEpoch = useGetCurrentEpoch()
  const { end } = auctionById(id)
  const [remainingTime, setRemainingTime] = useState(end - Math.floor(Date.now() / 1000))
  const [timerSet, setTimerSet] = useState(false)

  useEffect(() => {
    setInterval(() => {
      setRemainingTime(end - Math.floor(Date.now() / 1000))
      setTimerSet(true)
    },1000)
  })


  return (
    <Card className="mbCardStyle">
      <CardHeader
        status="soon"
        icon={<WaitIcon mr="4px" width="21px" />}
        title={t('TBA')}
        bid={{ id: lastBidId+1 }}
        id={bidId}
      />
      <CardBody p="16px">
        <RoundResultBox>
          <Text textAlign="center">
            <Text bold>{t('Auction End')}</Text>
            <Text bold>
              ~{formatDuration(remainingTime, true)}
            </Text>
          </Text>
        </RoundResultBox>
      </CardBody>
    </Card>
  )
}

export default SoonRoundCard
