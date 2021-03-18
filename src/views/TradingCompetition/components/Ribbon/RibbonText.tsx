import React from 'react'
import { Heading } from '@pancakeswap-libs/uikit'
import styled from 'styled-components'

const sharedStyles = `
font-size: 32px;
color: #FFFFFF;
line-height: 110%;
`

export const RibbonText = styled(Heading)`
  ${sharedStyles}
  text-shadow: 0px 2px 2px rgba(0, 0, 0, 0.25);
`

export const VisuallyHiddenRibbonText = styled(Heading)`
  ${sharedStyles}
  visibility: hidden;
`

export default RibbonText
