import React, { useEffect, useState } from 'react'
import { Flex, TooltipText, IconButton, useModal, CalculateIcon, Skeleton, useTooltip } from '@rug-zombie-libs/uikit'
import { BigNumber } from 'bignumber.js'
import { auctionByAid } from '../../../../redux/get'
import { useMausoleum } from '../../../../hooks/useContract'
import { BIG_ZERO } from '../../../../utils/bigNumber'
import { getFullDisplayBalance } from '../../../../utils/formatBalance'

interface MinimumStakeProps {
  aid: number
}

const StartingBid: React.FC<MinimumStakeProps> = ({ aid }) => {
  const { isFinished, startingBid } = auctionByAid(aid)
  const mausoleum = useMausoleum()
  const [lastBidAmount, setLastBidAmount] = useState(BIG_ZERO)
  useEffect(() => {
    mausoleum.methods.lastBid(aid).call()
      .then(res => {
        setLastBidAmount(new BigNumber(res.amount))
      })
  }, [aid, mausoleum.methods])
  return (
    <>
    <Flex alignItems="center" justifyContent="space-between">
      <TooltipText >Starting Bid:</TooltipText>
        {startingBid} BT
    </Flex>
      <Flex alignItems="center" justifyContent="space-between">
  <TooltipText >{isFinished ? "Final Bid:" : "Current Bid:" }</TooltipText>
  {lastBidAmount.isZero() ? (
    <Skeleton width="82px" height="32px" />
  ) : (
    <Flex alignItems="center">
      {getFullDisplayBalance(lastBidAmount, 18, 2)} BT
    </Flex>
  )}
      </Flex>
    </>
  )
}

export default StartingBid
