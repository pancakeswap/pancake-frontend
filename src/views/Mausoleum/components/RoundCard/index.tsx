import React, { useEffect } from 'react'
import { BigNumber } from 'bignumber.js'
import OutbidRoundCard from './OutbidRoundCard'
import LeaderRoundCard from './LeaderRoundCard'

interface RoundCardProps {
  bid: any,
  lastBidId: number,
  id: number,
  bidId: number,
}

const RoundCard: React.FC<RoundCardProps> = ({ bid, lastBidId, id, bidId }) => {
  // Live round
  if (bid.id === lastBidId) {
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
      bidId={bidId}
    />
  )
}

export default RoundCard
