import React from 'react'
import styled from 'styled-components'
import { Box } from '@pancakeswap/uikit'
import Container from '../Layout/Container'

const Outer = styled("div")<{ background?: string }>`
  text-align:center;
`

const Inner = styled(Container)`
  padding-top: 32px;
  padding-bottom: 32px;

`

const PageHeader: React.FC<{ background?: string }> = ({ background, children, ...props }) => (
  <Outer background={background} {...props}>
    <Inner>{children}</Inner>
  </Outer>
)

export default PageHeader
