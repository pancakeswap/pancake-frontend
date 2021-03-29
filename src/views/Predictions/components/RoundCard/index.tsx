import React from 'react'
import { useGetCurrentEpoch } from 'state/hooks'
import { Round } from 'state/types'
import ExpiredRoundCard from './ExpiredRoundCard'
import LiveRoundCard from './LiveRoundCard'
import OpenRoundCard from './OpenRoundCard'
import SoonRoundCard from './SoonRoundCard'

interface RoundCardProps {
  round: Round
}

const RoundCard: React.FC<RoundCardProps> = ({ round }) => {
  const { epoch, lockPrice, closePrice } = round
  const currentEpoch = useGetCurrentEpoch()

  if (epoch === currentEpoch && lockPrice === null) {
    return <OpenRoundCard round={round} />
  }

  if (closePrice === null && epoch === currentEpoch - 1) {
    return <LiveRoundCard round={round} />
  }

  if (epoch > currentEpoch) {
    return <SoonRoundCard round={round} />
  }

  return <ExpiredRoundCard round={round} />
}

export default RoundCard
