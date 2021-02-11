import React, { useEffect, useRef } from 'react'
import { useCountUp } from 'react-countup'
import { Text } from '@pancakeswap-libs/uikit'
import CardValue, { CardValueProps } from './CardValue'

const CardBusdValue: React.FC<CardValueProps> = ({ value }) => {
  return <CardValue value={value} fontSize="14px" lineHeight="1.1" color="textSubtle" prefix="~$" bold={false} />
}

export default CardBusdValue
