import React, { useEffect, useRef } from 'react'
import styled from 'styled-components'
import { Box, Card, Text } from '@pancakeswap-libs/uikit'
import { useBnbUsdtTicker, useGetCurrentRound } from 'state/hooks'
import BnbUsdtPairToken from '../icons/BnbUsdtPairToken'
import PocketWatch from '../icons/PocketWatch'
import useBlockCountdown from '../hooks/useGetBlockCountdown'
import { padTime } from '../helpers'

enum PriceChange {
  UP = 'up',
  DOWN = 'down',
  NOCHANGE = 'nochange',
}

const Label = styled(Card)`
  align-items: center;
  display: flex;
  height: 32px;
  overflow: initial;
`

const Countdown = styled(Text)`
  width: 56px;
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

export const PricePairLabel: React.FC = () => {
  const lastPriceRef = useRef(0)
  const { stream } = useBnbUsdtTicker()
  const { lastPrice } = stream ?? {}
  const positionChange = lastPrice > lastPriceRef.current ? PriceChange.DOWN : PriceChange.UP
  const { color, symbol } = getPriceChangeColor(positionChange)

  useEffect(() => {
    lastPriceRef.current = lastPrice
  }, [lastPriceRef, lastPrice])

  return (
    <Box pl="24px" position="relative" display="inline-block">
      <Box position="absolute" left={0} mt="-24px" top="50%" zIndex={30}>
        <BnbUsdtPairToken width="48px" />
      </Box>
      <Label pl="32px" pr="16px">
        <Text bold fontSize="20px" lineHeight="22px" textTransform="uppercase">
          BNBUSDT
        </Text>
        <Text color={color} fontSize="12px" ml="8px" style={{ width: '60px' }} textAlign="center">
          {lastPrice &&
            `${symbol} $${lastPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
        </Text>
      </Label>
    </Box>
  )
}

interface TimerLabelProps {
  interval: string
}

export const TimerLabel: React.FC<TimerLabelProps> = ({ interval }) => {
  const currentRound = useGetCurrentRound()
  const { minutes, seconds } = useBlockCountdown(currentRound.endBlock)
  const padMinute = padTime(minutes >= 0 ? minutes : 0)
  const padSecond = padTime(seconds >= 0 ? seconds : 0)

  return (
    <Box pr="24px" position="relative">
      <Label pl="16px" pr="32px">
        <Countdown bold fontSize="20px" color="secondary">
          {`${padMinute}:${padSecond}`}
        </Countdown>
        <Text ml="8px" fontSize="12px">
          {interval}
        </Text>
      </Label>
      <Box position="absolute" right={0} top="-10px" zIndex={30}>
        <PocketWatch width="48px" />
      </Box>
    </Box>
  )
}
