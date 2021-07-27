import React from 'react'
import { BigNumber } from 'bignumber.js'
import { BIG_ZERO } from 'utils/bigNumber'
import SoonRoundCard from '../RoundCard/SoonRoundCard'
import './cardStyles.css';
import IncreaseBidCard from '../RoundCard/IncreaseBidCard';
import RoundCard from '../RoundCard';

interface MobileCardProps {
  bids: any[],
  lastBidId: number,
  userInfo: any,
  aid: number,
  setRefresh: any,
  refresh: boolean
}

const MobileCard: React.FC<MobileCardProps> = ({ bids, refresh, lastBidId, setRefresh, userInfo, aid }) => {

  const formattedBids = bids.map((bid, i) => {
    return {
      amount: new BigNumber(bid.amount.toString()),
      bidder: bid.bidder,
      previousBidAmount: bids[i - 1] && bids[i - 1].amount ? new BigNumber(bids[i - 1].amount.toString()) : BIG_ZERO,
    }
  })

  console.log(lastBidId, formattedBids);

  return (
    <>
      <SoonRoundCard lastBidId={lastBidId} id={lastBidId + 1} />
      {bids.length > 0 ?
        <IncreaseBidCard
          lastBid={formattedBids[bids.length - 1]}
          userInfo={userInfo}
          aid={aid}
          id={lastBidId}
          setRefresh={setRefresh}
          refresh={refresh}
        /> :
        null
      }
      {bids[lastBidId - 1] ?
        <RoundCard bid={formattedBids[lastBidId - 1]} id={lastBidId - 1} userInfo={userInfo} lastBidId={lastBidId}
          aid={aid} /> : null
      }
      {bids[lastBidId - 2] ?
        <RoundCard bid={formattedBids[lastBidId - 2]} id={lastBidId - 2} userInfo={userInfo} lastBidId={lastBidId}
          aid={aid} /> : null
      }
      {bids[lastBidId - 3] ?
          <RoundCard bid={formattedBids[lastBidId - 3]} id={lastBidId - 3} userInfo={userInfo}
            lastBidId={lastBidId} aid={aid} />: null
      }
    </>
  )
}

export default MobileCard
