import React from 'react'
import { Box } from '@pancakeswap/uikit'
import styled, { keyframes } from 'styled-components'

const ellipsis = keyframes`
  0% {
    width: 2px;
  }
  33% {
    width: 6px;
  }
  66% {
    width: 10px;
  }
`
const DotsAfter = styled.div`
  width: 16px;
  display: inline-block;
  text-align: left;
  &::after {
    display: inline-block;
    animation: ${ellipsis} 1.25s infinite;
    content: '...';
    width: 2px;
    text-align: left;
    overflow: hidden;
    white-space: nowrap;
    line-height: 1;
  }
`
const Dots = ({ children }) => {
  return (
    <Box>
      {children}
      <DotsAfter />
    </Box>
  )
}

export default Dots
