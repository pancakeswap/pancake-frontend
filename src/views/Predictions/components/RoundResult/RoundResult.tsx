import React from 'react'
import { BoxProps, Flex, Text } from '@rug-zombie-libs/uikit'
import { BetPosition, Round } from 'state/types'
import { useTranslation } from 'contexts/Localization'
import { formatUsd } from '../../helpers'
import PositionTag from '../PositionTag'
import { LockPriceRow, PrizePoolRow, RoundResultBox } from './styles'
import { zmbeBnbLpPriceBnb } from '../../../../redux/get'

interface RoundResultProps extends BoxProps {
  bid: any
}

const RoundResult: React.FC<RoundResultProps> = ({ bid }) => {
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
            {bid.amount.toString()}
           </Text>
           <PositionTag betPosition={bid.amount}>{bid.amount - bid.lastBidAmount} BT</PositionTag>
        </Flex>

        <LockPriceRow bid={bid} />
       <PrizePoolRow totalAmount={zmbeBnbLpPriceBnb().times(bid.amount).toNumber()} />
    </RoundResultBox>
  )
}

export default RoundResult
