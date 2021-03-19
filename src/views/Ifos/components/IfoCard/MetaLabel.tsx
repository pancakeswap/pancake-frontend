import React from 'react'
import { Box, BoxProps, Text } from '@pancakeswap-libs/uikit'

type MetaLabel = BoxProps

const MetaLabel: React.FC<BoxProps> = ({ children, ...props }) => {
  return (
    <Box minHeight="18px" {...props}>
      <Text color="textSubtle" fontSize="12px">
        {children}
      </Text>
    </Box>
  )
}

export default MetaLabel
