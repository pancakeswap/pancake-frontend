import React from 'react'
import styled from 'styled-components'
import { Box, BoxProps } from '@pancakeswap/uikit'
import Container from '../Layout/Container'

const Outer = styled(Box)<{ background?: string }>`
  background: ${({ theme, background }) => background || theme.colors.gradients.bubblegum};
`

const Inner = styled(Container)`
  padding-top: 32px;
  padding-bottom: 32px;
`

interface PageHeaderProps extends BoxProps {
  background?: string
}

const PageHeader: React.FC<PageHeaderProps> = ({ background, children, ...props }) => (
  <Outer background={background} {...props}>
    <Inner>{children}</Inner>
  </Outer>
)

export default PageHeader
