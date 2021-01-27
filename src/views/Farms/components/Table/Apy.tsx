import React from 'react'
import styled from 'styled-components'

interface CellProps {
  value: string
  multiplier: string
}

const CalculateIcon = styled.img`
  width: 1.5rem;
  height: 1.5rem;
  margin-left: auto;
`

const Multiplier = styled.div`
  background: ${({ theme }) => theme.colors.secondary};
  border-radius: 1rem;
  color: white;
  padding: 0.3125rem 0.5rem;
  width: 2.5rem;
`

const Apy: React.FunctionComponent<CellProps> = ({ value, multiplier }) => {
  const renderValue = (): string => {
    if (value) {
      return `${value}%`
    }

    return 'Loading...'
  }
  return (
    <>
      {renderValue()}
      <CalculateIcon src="/images/calculate.svg" alt="calculate" />
      <Multiplier>{multiplier}</Multiplier>
    </>
  )
}

export default Apy
