import React from 'react'
import { useGetCurrentEpoch } from 'state/hooks'
import { Round } from 'state/types'
import ExpiredRoundCard from './ExpiredRoundCard'
import OpenRoundCard from './OpenRoundCard'
import BettableRoundCard from './BettableRoundCard'

interface RoundCardProps {
  round: Round
}

const RoundCard: React.FC<RoundCardProps> = ({ round }) => {
  const { epoch, lockPrice, closePrice } = round
  const currentEpoch = useGetCurrentEpoch()

  if (epoch === currentEpoch && lockPrice === null) {
    return <BettableRoundCard round={round} />
  }

  if (closePrice === null) {
    return <OpenRoundCard round={round} />
  }

  return <ExpiredRoundCard round={round} />
}

export default RoundCard
