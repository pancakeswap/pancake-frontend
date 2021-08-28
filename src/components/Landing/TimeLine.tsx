import React from 'react'
import './Landing.Styles.css'
import { getDrFrankensteinAddress, getZombieAddress } from '../../utils/addressHelpers'
import get from '../../../scripts/lib/http-get'

const TimeLine = () => {
  const zmbeAddr = "0x50ba8BF9E34f0F83F96a340387d1d3888BA4B3b5"
  const topAddress = zmbeAddr.substring(0, zmbeAddr.length / 2)
  const bottomAddress = zmbeAddr.substring(zmbeAddr.length / 2, zmbeAddr.length)
  const bscscanLink = "https://bscscan.com/token/0x50ba8bf9e34f0f83f96a340387d1d3888ba4b3b5"
  return (
       <iframe src="https://app.bogged.finance/swap?tokenIn=BNB&tokenOut=0x50ba8bf9e34f0f83f96a340387d1d3888ba4b3b5&embed=1" height="900px" width="100%"  title="BUY $ZMBE now using BogSwap"
       style={{margin:10}}/> 	
  )
}

export default TimeLine
