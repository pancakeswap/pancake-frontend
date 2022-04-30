import React from 'react'
import { Box, Button } from '@pancakeswap/uikit'
import TokenInfo from './TokenInfo'

const VestingPeriod: React.FC = () => {
  return (
    <Box>
      <TokenInfo />
      <TokenInfo />
      <TokenInfo />
      <Button mt="4px" width="100%">
        Claim All
      </Button>
    </Box>
  )
}

export default VestingPeriod
