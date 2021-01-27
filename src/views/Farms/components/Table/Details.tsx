import React from 'react'
import styled from 'styled-components'

interface CellProps {
  liquidity: string
}

const Container = styled.div`
  text-align: left;
  & div {
    display: flex;
    width: 100%;
    justify-content: space-between;
    align-items: center;

    & span {
      display: flex;
      align-items: center;
    }
  }
`

const StakeLabel = styled.span`
  color: ${({ theme }) => theme.colors.text};
  margin-right: 0.5rem;
`

const OpenIcon = styled.img`
  width: 1rem;
  height: 1rem;
  margin-left: 0.375rem;
`

const StakeTitle = styled.span`
  color: ${({ theme }) => theme.colors.primary};
  white-space: nowrap;
`

const Details: React.FunctionComponent<CellProps> = ({ liquidity }) => {
  const renderLiquidity = (): string => {
    if (liquidity) {
      return `$${Number(liquidity).toLocaleString(undefined, { maximumFractionDigits: 0 })}`
    }

    return '-'
  }

  return (
    <>
      <Container>
        <div>
          <StakeLabel>Stake:</StakeLabel>
          <StakeTitle>
            HARD-BNB LP
            <OpenIcon src="/images/open_in_new.svg" alt="open in new" />
          </StakeTitle>
        </div>
        <div>
          <StakeLabel>Liquidity:</StakeLabel>
          <span>{renderLiquidity()}</span>
        </div>
      </Container>
    </>
  )
}

export default Details
