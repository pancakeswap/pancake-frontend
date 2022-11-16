import React, { memo, useMemo } from 'react'
import { BigNumber } from '@ethersproject/bignumber'
import CountUp from 'react-countup'
import { Skeleton, TooltipText } from '@pancakeswap/uikit'
import { formatBigNumberToFixed } from '@pancakeswap/utils/formatBalance'
import { BetPosition } from 'state/types'

interface LiveRoundPriceProps {
  betPosition: BetPosition
  price: BigNumber
}

const LiveRoundPrice: React.FC<React.PropsWithChildren<LiveRoundPriceProps>> = ({ betPosition, price }) => {
  const priceAsNumber = useMemo(() => parseFloat(formatBigNumberToFixed(price, 4, 8)), [price])

  const priceColor = useMemo(() => {
    switch (betPosition) {
      case BetPosition.BULL:
        return 'success'
      case BetPosition.BEAR:
        return 'failure'
      case BetPosition.HOUSE:
      default:
        return 'textDisabled'
    }
  }, [betPosition])

  if (!Number.isFinite(priceAsNumber)) {
    return null
  }

  if (price.lt(0)) {
    return <Skeleton height="36px" width="94px" />
  }

  return (
    <CountUp start={0} preserveValue delay={0} end={priceAsNumber} prefix="$" decimals={4} duration={1}>
      {({ countUpRef }) => (
        <TooltipText bold color={priceColor} fontSize="24px" style={{ minHeight: '36px' }}>
          <span ref={countUpRef} />
        </TooltipText>
      )}
    </CountUp>
  )
}

export default memo(LiveRoundPrice)
