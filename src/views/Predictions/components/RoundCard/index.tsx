import { useWeb3React } from '@web3-react/core'
import React from 'react'
import { useGetCurrentEpoch, useGetUserBetByRound } from 'state/hooks'
import { BetPosition, Round } from 'state/types'
import ExpiredRoundCard from './ExpiredRoundCard'
import LiveRoundCard from './LiveRoundCard'
import OpenRoundCard from './OpenRoundCard'
import SoonRoundCard from './SoonRoundCard'

interface RoundCardProps {
  round: Round
}

const getMultiplier = (total: number, amount: number) => {
  if (total === 0 || amount === 0) {
    return 0
  }

  return total / amount
}

const RoundCard: React.FC<RoundCardProps> = ({ round }) => {
  const { epoch, lockPrice, closePrice, totalAmount, bullAmount, bearAmount } = round
  const currentEpoch = useGetCurrentEpoch()
  const { account } = useWeb3React()
  const bet = useGetUserBetByRound(round.id, account)
  const hasEnteredUp = bet && bet.position === BetPosition.BULL
  const hasEnteredDown = bet && bet.position === BetPosition.BEAR
  const bullMultiplier = getMultiplier(totalAmount, bullAmount)
  const bearMultiplier = getMultiplier(totalAmount, bearAmount)

  if (epoch === currentEpoch && lockPrice === null) {
    return (
      <OpenRoundCard
        round={round}
        hasEnteredUp={hasEnteredUp}
        hasEnteredDown={hasEnteredDown}
        bullMultiplier={bullMultiplier}
        bearMultiplier={bearMultiplier}
      />
    )
  }

  if (closePrice === null && epoch === currentEpoch - 1) {
    return (
      <LiveRoundCard
        round={round}
        hasEnteredUp={hasEnteredUp}
        hasEnteredDown={hasEnteredDown}
        bullMultiplier={bullMultiplier}
        bearMultiplier={bearMultiplier}
      />
    )
  }

  if (epoch > currentEpoch) {
    return <SoonRoundCard round={round} />
  }

  return (
    <ExpiredRoundCard
      round={round}
      hasEnteredUp={hasEnteredUp}
      hasEnteredDown={hasEnteredDown}
      bullMultiplier={bullMultiplier}
      bearMultiplier={bearMultiplier}
    />
  )
}

export default RoundCard
