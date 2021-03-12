import React from 'react'
import { Box } from '@pancakeswap-libs/uikit'
import { Header } from './components/History'

const History = () => {
  return (
    <Box overflow="hidden" width={{ xs: '320px', lg: '384px' }}>
      <Header />
    </Box>
  )
}

export default History
