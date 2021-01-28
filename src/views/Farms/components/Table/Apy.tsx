import React from 'react'
import styled from 'styled-components'

interface CellProps {
  value: string
  multiplier: string
}

const Container = styled.div`
  width: 7.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: ${(props) => props.theme.colors.text};
`

const CalculateIcon = styled.img`
  width: 1.5rem;
  height: 1.5rem;
  margin-left: auto;
`

const Multiplier = styled.div`
  background: ${({ theme }) => theme.colors.secondary};
  border-radius: 1rem;
  color: ${({ theme }) => theme.card.background};
  padding: 0.3125rem 0rem;
  width: 2.5rem;
  text-align: center;
`

const Apy: React.FunctionComponent<CellProps> = ({ value, multiplier }) => {
  const displayApy = value ? `${value}%` : 'Loading...'
  return (
    <Container>
      <div>{displayApy}</div>
      <CalculateIcon src="/images/calculate.svg" alt="calculate" />
      <Multiplier>{multiplier}</Multiplier>
    </Container>
  )
}

export default Apy
