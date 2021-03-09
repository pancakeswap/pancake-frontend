import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { Box, Card, Text } from '@pancakeswap-libs/uikit'
import getTimePeriods from 'utils/getTimePeriods'
import BnbUsdtPairToken from '../icons/BnbUsdtPairToken'
import PocketWatch from '../icons/PocketWatch'

enum PriceChange {
  UP = 'up',
  DOWN = 'down',
  NOCHANGE = 'nochange',
}

interface PricePairLabelProps {
  pricePair: string
  price: number
}

const Label = styled(Card)`
  align-items: center;
  display: flex;
  height: 32px;
  overflow: initial;
`

const getPriceChangeColor = (priceChange: PriceChange) => {
  switch (priceChange) {
    case PriceChange.UP:
      return { symbol: '-', color: 'failure' }
    case PriceChange.DOWN:
      return { symbol: '+', color: 'success' }
    case PriceChange.NOCHANGE:
    default:
      return { symbol: '', color: 'text' }
  }
}

export const PricePairLabel: React.FC<PricePairLabelProps> = ({ pricePair, price }) => {
  const [priceChange, setPriceChange] = useState<PriceChange>(PriceChange.NOCHANGE)
  const previousPrice = useRef(price)
  const { symbol, color } = getPriceChangeColor(priceChange)

  useEffect(() => {
    if (previousPrice.current === price) {
      setPriceChange(PriceChange.NOCHANGE)
    } else {
      setPriceChange(previousPrice.current > price ? PriceChange.DOWN : PriceChange.UP)
    }
    previousPrice.current = price
  }, [previousPrice, price, setPriceChange])

  return (
    <Box pl="24px" position="relative">
      <Box position="absolute" left={0} mt="-24px" top="50%" zIndex={30}>
        <BnbUsdtPairToken width="48px" />
      </Box>
      <Label pl="32px" pr="16px">
        <Text bold fontSize="20px" lineHeight="22px" textTransform="uppercase">
          {pricePair}
        </Text>
        <Text color={color} fontSize="12px" ml="8px" style={{ width: '60px' }} textAlign="center">
          {`${symbol} $${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
        </Text>
      </Label>
    </Box>
  )
}

interface TimerLabelProps {
  secondsLeft: number
  interval: string
}

export const TimerLabel: React.FC<TimerLabelProps> = ({ secondsLeft, interval }) => {
  const { minutes, seconds } = getTimePeriods(secondsLeft)
  const minutesDisplay = minutes <= 9 ? `0${minutes}` : minutes
  const secondsDisplay = seconds <= 9 ? `0${seconds}` : seconds

  return (
    <Box pr="24px" position="relative">
      <Label pl="16px" pr="32px">
        <Text bold fontSize="20px" color="secondary">
          {`${minutesDisplay}:${secondsDisplay}`}
        </Text>
        <Text ml="8px" fontSize="12px">
          {interval}
        </Text>
      </Label>
      <Box position="absolute" right={0} mt="-24px" top="50%" zIndex={30}>
        <PocketWatch width="48px" />
      </Box>
    </Box>
  )
}
