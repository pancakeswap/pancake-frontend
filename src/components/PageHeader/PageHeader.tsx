import React from 'react'
import styled from 'styled-components'
import Container from '../layout/Container'

const Outer = styled.div`
  background: ${({ theme }) => theme.colors.gradients.bubblegum};
`

const Inner = styled(Container)`
  padding-top: 32px;
  padding-bottom: 32px;
`

const PageHeader = ({ children }) => (
  <Outer>
    <Inner>{children}</Inner>
  </Outer>
)

export default PageHeader
