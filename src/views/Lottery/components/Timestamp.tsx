import React from 'react'
import styled from 'styled-components'
import { Text } from '@pancakeswap-libs/uikit'
import formatLotteryDate from '../helpers/formatLotteryDate'

const Wrapper = styled.div`
  position: absolute;
  top: 0;
  right: 0;
`

const Timestamp = ({ timeValue }) => {
  const { monthAndDay, hours } = formatLotteryDate(timeValue)

  return (
    <Wrapper>
      <Text fontSize="14px">
        {monthAndDay}, {hours}:00 UTC
      </Text>
    </Wrapper>
  )
}

export default Timestamp
