import React from 'react'
import { BoxProps, Flex, Text } from '@rug-zombie-libs/uikit'
import { BigNumber } from 'bignumber.js'
import PositionTag from '../PositionTag'
import { LockPriceRow, PrizePoolRow, RoundResultBox } from './styles'
import { zmbeBnbLpPriceBnb } from '../../../../redux/get'
import { getBalanceAmount } from '../../../../utils/formatBalance'

interface RoundResultProps {
  bid: any;
  id: number;
  mb?: string;
}

const RoundResult: React.FC<RoundResultProps> = ({ bid, id,mb }) => {
  const bidder = bid.bidder
  const bidderLength = bid.bidder.length
  const displayBidder = `${bidder.slice(0,6)}...${bidder.slice(bidderLength - 4, bidderLength)}`
  return (
    <RoundResultBox betPosition={bid.amount}>
      <Text color="textSubtle" fontSize="12px" bold textTransform="uppercase" mb="8px">
        {`Bid by ${displayBidder}`}
      </Text>
        <Flex alignItems="center" justifyContent="space-between" mb="16px">
           <Text color="success" bold fontSize="24px">
            {Math.round(getBalanceAmount(bid.amount).toNumber() * 100) / 100}
           </Text>
           <PositionTag betPosition={bid.amount}>{Math.round(getBalanceAmount(new BigNumber(bid.amount - bid.previousBidAmount)).toNumber() * 100) / 100} BT</PositionTag>
        </Flex>

        <LockPriceRow bid={bid} id={id} />
       <PrizePoolRow totalAmount={getBalanceAmount(zmbeBnbLpPriceBnb().times(bid.amount)).toNumber()} />
    </RoundResultBox>
  )
}

export default RoundResult
