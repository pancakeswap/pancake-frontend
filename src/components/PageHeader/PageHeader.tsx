import React from 'react'
import styled from 'styled-components'
import Container from '../layout/Container'

const Outer = styled.div<{ background?: string }>`
  background: ${({ theme, background }) => (!background ? theme.colors.gradients.bubblegum : background)};
`

const Inner = styled(Container)`
  padding-top: 32px;
  padding-bottom: 32px;
`

const PageHeader: React.FC<{ background?: string }> = ({ background, children }) => (
  <Outer background={background}>
    <Inner>{children}</Inner>
  </Outer>
)

export default PageHeader
