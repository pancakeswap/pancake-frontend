import React, { useEffect } from 'react'
import { BigNumber } from 'bignumber.js'
import OutbidRoundCard from './OutbidRoundCard'
import LeaderRoundCard from './LeaderRoundCard'

interface RoundCardProps {
  bid: any,
  lastBidId: number,
  userInfo: any,
  aid: number,
  id: number
}

const RoundCard: React.FC<RoundCardProps> = ({ bid, lastBidId, id, userInfo, aid }) => {
  // Live round
  if (id === lastBidId - 1) {
    return (
      <LeaderRoundCard
        bid={bid}
        id={id}
      />
    )
  }

  // Past rounds
  return (
    <OutbidRoundCard
      bid={bid}
      id={id}
    />
  )
}

export default RoundCard
