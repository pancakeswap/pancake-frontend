import React from 'react'
import { Text } from '@pancakeswap-libs/uikit'

const PastRoundCardError = ({ error }) => {
  return <Text p="24px">{error.message}</Text>
}

export default PastRoundCardError
