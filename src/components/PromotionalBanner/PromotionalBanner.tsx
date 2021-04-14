import React from 'react'
import { Box } from '@pancakeswap-libs/uikit'

const PromotionalBanner = ({ children = null }) => {
  return <>{children && <Box>{children}</Box>}</>
}

export default PromotionalBanner
