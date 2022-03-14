import React, { useEffect, useRef, memo } from 'react'
import { useCountUp } from 'react-countup'
import { Skeleton, TooltipText } from '@pancakeswap/uikit'
import { formatBigNumberToFixed } from 'utils/formatBalance'
import usePollOraclePrice from '../../hooks/usePollOraclePrice'

interface LiveRoundPriceProps {
  isBull: boolean
}

const LiveRoundPrice: React.FC<LiveRoundPriceProps> = ({ isBull }) => {
  const price = usePollOraclePrice()

  const priceAsNumber = parseFloat(formatBigNumberToFixed(price, 3, 8))
  const priceColor = isBull ? 'success' : 'failure'

  const { countUp, update } = useCountUp({
    start: 0,
    end: priceAsNumber,
    duration: 1,
    decimals: 3,
  })

  const updateRef = useRef(update)

  useEffect(() => {
    updateRef.current(priceAsNumber)
  }, [priceAsNumber, updateRef])

  return (
    <TooltipText bold color={priceColor} fontSize="24px" style={{ minHeight: '36px' }}>
      {price.gt(0) ? `$${countUp}` : <Skeleton height="36px" width="94px" />}
    </TooltipText>
  )
}

export default memo(LiveRoundPrice)
