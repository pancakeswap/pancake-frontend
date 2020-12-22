import React from 'react'
import styled from 'styled-components'
import { Text } from '@pancakeswap-libs/uikit'

const Wrapper = styled.div`
  position: absolute;
  top: 0;
  right: 0;
`

const Timestamp = ({ timeValue }) => {
  const date = new Date(timeValue)

  const dateString = date.toDateString()
  const hours = date.getUTCHours()
  const monthAndDay = dateString.split(' ').splice(1, 2).join(' ')

  return (
    <Wrapper>
      <Text fontSize="14px">
        {monthAndDay}, {hours}:00 UTC
      </Text>
    </Wrapper>
  )
}

export default Timestamp
