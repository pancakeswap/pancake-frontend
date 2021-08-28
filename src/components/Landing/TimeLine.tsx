import React from 'react'
import './Landing.Styles.css'
import { Flex, useMatchBreakpoints } from '@rug-zombie-libs/uikit'

const TimeLine = () => {
  const zmbeAddr = '0x50ba8BF9E34f0F83F96a340387d1d3888BA4B3b5'
  const { isLg, isXl } = useMatchBreakpoints()
  const isDesktop = isLg || isXl

  return (
    <div id='Timeline' className="bog-buy-background" style={{width: "100%"}}>
      <Flex justifyContent="center">
        <iframe
          src='https://app.bogged.finance/swap?tokenIn=BNB&tokenOut=0x50ba8bf9e34f0f83f96a340387d1d3888ba4b3b5&embed=1'
          height='900px'  title='BUY $ZMBE now using BogSwap'
          style={{ margin: 10, minWidth: isDesktop ? '30%' : '80%' }} />
      </Flex>
    </div>
  )
}

export default TimeLine
