import React from 'react'
import styled from 'styled-components'
import { Box } from '@pancakeswap/uikit'
import Container from '../Layout/Container'

/* ${({ theme, background }) => background || theme.colors.gradients.bubblegum}; */

const Outer = styled(Box)<{ background?: string }>`
  background: transparent;
`
// paddnig top era 32
const Inner = styled(Container)`
  padding-top: 0px;
  padding-bottom: 32px;
`

const PageHeader: React.FC<{ background?: string }> = ({ background, children, ...props }) => (
  <Outer background={background} {...props}>
    <Inner>{children}</Inner>
  </Outer>
)

export default PageHeader
