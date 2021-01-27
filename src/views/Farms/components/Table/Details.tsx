import React from 'react'
import styled from 'styled-components'
import { LinkExternal } from '@pancakeswap-libs/uikit'

interface CellProps {
  liquidity: number
  lpName: string
  liquidityUrlPathParts: string
}

const Container = styled.div`
  text-align: left;
  width: 100%;

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

const StyledLinkExternal = styled(LinkExternal)`
  white-space: nowrap;
  color: ${({ theme }) => theme.colors.primary};
  text-decoration: none !important;
  font-weight: normal;
  font-size: 0.875rem;
  svg {
    width: 1rem;
    height: 1rem;
    margin-left: 0.375rem;
  }
`

const Details: React.FunctionComponent<CellProps> = ({ liquidity, lpName, liquidityUrlPathParts }) => {
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
          <StyledLinkExternal href={`https://exchange.pancakeswap.finance/#/add/${liquidityUrlPathParts}`}>
            {lpName}
          </StyledLinkExternal>
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
