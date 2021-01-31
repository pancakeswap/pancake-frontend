import React, { useState, useEffect } from 'react'
import { Text } from '@pancakeswap-libs/uikit'
import styled from 'styled-components'

const MarketPrice: React.FC = () => {
  const [{ price, change }, setMarket] = useState({ price: '32.33', change: '89' })

  useEffect(() => {
    // subscript price
  }, [])

  return (
    <Text as="span">
      ${price}
      <Text as="span" ml="2" color="success">
        {change}
      </Text>
    </Text>
  )
}

export default MarketPrice
