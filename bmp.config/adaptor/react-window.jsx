/* eslint-disable react/jsx-filename-extension */
import React from 'react'
import { Box } from '@pancakeswap/uikit'

export function FixedSizeList({ itemData, itemKey, children }) {
  return (
    <Box style={{ height: '390px', overflowY: 'scroll', width: '100%' }}>
      {itemData.map((item, index) => {
        return <Box key={itemKey(itemData, index)}>{children({ data: itemData, index })}</Box>
      })}
    </Box>
  )
}
