import { Box, IconButton, RefreshIcon } from '@pancakeswap/uikit'

import { memo } from 'react'

export const OnRampFlipButton = memo(function FlipButton({ refetch }: { refetch: any }) {
  return (
    <Box p="24px" mb="18px">
      <IconButton scale="sm" onClick={refetch} variant="tertiary">
        <RefreshIcon width="24px" height="24px" color="primary" />
      </IconButton>
    </Box>
  )
})
