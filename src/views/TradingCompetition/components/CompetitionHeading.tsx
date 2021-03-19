import React from 'react'
import { Heading } from '@pancakeswap-libs/uikit'
import styled from 'styled-components'

const sharedStyles = `
font-size: 32px;
line-height: 110%;
`

export const HeadingText = styled(Heading)`
  ${sharedStyles}
  color: #FFFFFF;
  background: -webkit-linear-gradient(#7645d9 0%, #452a7a 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-stroke: 4px transparent;
  text-shadow: 0px 2px 2px rgba(0, 0, 0, 0.25);
`

export const VisuallyHiddenHeadingText = styled(Heading)`
  ${sharedStyles}
  visibility: hidden;
  height: 1px;
`

export default HeadingText
