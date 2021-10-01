import React from 'react'
import './Landing.Styles.css'
import { Flex, useMatchBreakpoints } from '@rug-zombie-libs/uikit'

const TimeLine = () => {
  const { isLg, isXl, isMd } = useMatchBreakpoints()
  const isDesktop = isLg || isXl || isMd

  return (
    <div id='Timeline' style={{width: "100%", paddingTop: isDesktop ? "0px" : "80px", height: isDesktop ? '1200px' : '1320px'}}>
      <Flex justifyContent="center">
        <iframe
          src='https://app.bogged.finance/swap?tokenIn=BNB&tokenOut=0x50ba8bf9e34f0f83f96a340387d1d3888ba4b3b5&embed=1'
          height={isDesktop ? '873px' : '941px'}  title='BUY $ZMBE now using BogSwap'
          style={{ margin: 10, minWidth: isDesktop ? '30%' : '80%' }} />
      </Flex>
    </div>
  )
}

export default TimeLine
