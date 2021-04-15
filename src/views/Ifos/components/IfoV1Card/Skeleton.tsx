import React from 'react'
import { Box, Flex, Skeleton } from '@pancakeswap-libs/uikit'

export const ActiveSkeleton = () => (
  <Box>
    <Skeleton height="18px" mb="4px" width="30%" />
    <Skeleton height="48px" mb="2px" />
    <Skeleton height="19px" width="15%" />
  </Box>
)

export const InactiveSkeleton = () => (
  <>
    <Flex mb="24px">
      <Box width="50%" height="52px">
        <Skeleton height="18px" mb="4px" width="70%" />
        <Skeleton height="30px" width="20%" />
      </Box>
      <Box width="50%" height="52px">
        <Skeleton height="18px" mb="4px" width="70%" />
        <Skeleton height="30px" width="20%" />
      </Box>
    </Flex>
    <Skeleton height="48px" mb="24px" />
    <Skeleton height="48px" mt="4px" />
  </>
)
