import React from 'react'
import styled from 'styled-components'

interface CellProps {
  value: string;
  multiplier: string;
}

const CalculateIcon = styled.img`
  width: 1.5rem;
  height: 1.5rem;
`

const Multiplier = styled.div`
  background: ${({ theme }) => theme.colors.secondary};
  border-radius: 1rem;
  color: white;
  padding: 0.375rem 0.5rem;
`

const Apy: React.FunctionComponent<CellProps> = ({ value, multiplier }) => {
  return (
    <>
    {`${value}`}
    <CalculateIcon src="/images/calculate.svg" alt="calculate" />
    <Multiplier>
      {multiplier}
    </Multiplier>
    </>
  )
}

export default Apy