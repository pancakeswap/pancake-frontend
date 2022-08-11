import React, { memo, useMemo } from 'react'
import { BigNumber } from '@ethersproject/bignumber'
import CountUp from 'react-countup'
import { Skeleton, TooltipText } from '@pancakeswap/uikit'
import { formatBigNumberToFixed } from 'utils/formatBalance'

interface LiveRoundPriceProps {
  isBull: boolean
  price: BigNumber
}

const LiveRoundPrice: React.FC<React.PropsWithChildren<LiveRoundPriceProps>> = ({ isBull, price }) => {
  const priceAsNumber = useMemo(() => parseFloat(formatBigNumberToFixed(price, 4, 8)), [price])

  const priceColor = isBull ? 'success' : 'failure'

  return (
    <CountUp start={0} preserveValue delay={0} end={priceAsNumber} prefix="$" decimals={4} duration={1}>
      {({ countUpRef }) => (
        <TooltipText bold color={priceColor} fontSize="24px" style={{ minHeight: '36px' }}>
          {price.gt(0) ? <span ref={countUpRef} /> : <Skeleton height="36px" width="94px" />}
        </TooltipText>
      )}
    </CountUp>
  )
}

export default memo(LiveRoundPrice)
