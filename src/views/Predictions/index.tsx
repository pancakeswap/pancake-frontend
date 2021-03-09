import React, { useEffect, useState } from 'react'
import { random } from 'lodash'
import { Box, Flex } from '@pancakeswap-libs/uikit'
import PositionCard from './components/PositionCard'
import { PricePairLabel, TimerLabel } from './components/Label'
import CardNav from './components/CardNav'

const Predictions = () => {
  const [price, setPrice] = useState(200)

  useEffect(() => {
    const timer = setInterval(() => {
      setPrice(random(190, 230))
    }, 2000)

    return () => clearInterval(timer)
  }, [setPrice])

  return (
    <Flex p="40px">
      <PositionCard />
      <Box ml="16px">
        <PricePairLabel pricePair="BNBUSDT" price={price} />
      </Box>
      <Box ml="16px">
        <TimerLabel secondsLeft={67} interval="5m" />
      </Box>
      <Box ml="16px">
        <CardNav />
      </Box>
    </Flex>
  )
}

export default Predictions
