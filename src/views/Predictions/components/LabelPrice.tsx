import React, { useEffect, useRef, useMemo, memo } from 'react'
import { useCountUp } from 'react-countup'
import { Text } from '@pancakeswap/uikit'
import { formatBigNumberToFixed } from 'utils/formatBalance'
import styled from 'styled-components'
import { BigNumber } from '@ethersproject/bignumber'

const Price = styled(Text)`
  height: 18px;
  justify-self: start;
  width: 70px;

  ${({ theme }) => theme.mediaQueries.lg} {
    text-align: center;
  }
`

interface LabelPriceProps {
  price: BigNumber
}

const LabelPrice: React.FC<LabelPriceProps> = ({ price }) => {
  const priceAsNumber = useMemo(() => parseFloat(formatBigNumberToFixed(price, 4, 8)), [price])

  const { countUp, update } = useCountUp({
    start: 0,
    end: priceAsNumber,
    duration: 1,
    decimals: 4,
  })

  const updateRef = useRef(update)

  useEffect(() => {
    updateRef.current(priceAsNumber)
  }, [priceAsNumber, updateRef])

  return <Price fontSize="12px">{`$${countUp}`}</Price>
}

export default memo(LabelPrice)
