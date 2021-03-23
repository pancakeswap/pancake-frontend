import React from 'react'
import styled from 'styled-components'
import { Header } from './components/History'

const StyledHistory = styled.div`
  background-color: ${({ theme }) => theme.card.background};
  height: 100%;
`

const History = () => {
  return (
    <StyledHistory>
      <Header />
    </StyledHistory>
  )
}

export default History
