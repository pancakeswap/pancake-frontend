import React from 'react'
import { useWeb3React } from '@web3-react/core'
import { useGetCurrentEpoch, useGetUserBetByRound } from 'state/hooks'
import { BetPosition, Round } from 'state/types'
import { getMultiplier } from '../../helpers'
import ExpiredRoundCard from './ExpiredRoundCard'
import LiveRoundCard from './LiveRoundCard'
import OpenRoundCard from './OpenRoundCard'
import SoonRoundCard from './SoonRoundCard'

interface RoundCardProps {
  round: Round
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

  // Next (open) round
  if (epoch === currentEpoch && lockPrice === null) {
    return (
      <OpenRoundCard
        round={round}
        betAmount={bet?.amount}
        hasEnteredUp={hasEnteredUp}
        hasEnteredDown={hasEnteredDown}
        bullMultiplier={bullMultiplier}
        bearMultiplier={bearMultiplier}
      />
    )
  }

  // Live round
  if (closePrice === null && epoch === currentEpoch - 1) {
    return (
      <LiveRoundCard
        betAmount={bet?.amount}
        round={round}
        hasEnteredUp={hasEnteredUp}
        hasEnteredDown={hasEnteredDown}
        bullMultiplier={bullMultiplier}
        bearMultiplier={bearMultiplier}
      />
    )
  }

  // Fake future rounds
  if (epoch > currentEpoch) {
    return <SoonRoundCard round={round} />
  }

  // Past rounds
  return (
    <ExpiredRoundCard
      round={round}
      betAmount={bet?.amount}
      hasEnteredUp={hasEnteredUp}
      hasEnteredDown={hasEnteredDown}
      bullMultiplier={bullMultiplier}
      bearMultiplier={bearMultiplier}
    />
  )
}

export default RoundCard
