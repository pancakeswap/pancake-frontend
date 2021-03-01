import React from 'react'
import { Box, Skeleton } from '@pancakeswap-libs/uikit'

const ActiveSkeleton = () => (
  <Box>
    <Skeleton height="18px" mb="4px" width="30%" />
    <Skeleton height="48px" mb="2px" />
    <Skeleton height="19px" width="15%" />
  </Box>
)

export default ActiveSkeleton
