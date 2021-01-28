import React from 'react'
import styled from 'styled-components'
import { LinkExternal } from '@pancakeswap-libs/uikit'
import useI18n from 'hooks/useI18n'

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
      color: ${(props) => props.theme.colors.text};
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
  font-weight: normal;
  font-size: 0.875rem;
  svg {
    width: 1rem;
    height: 1rem;
    margin-left: 0.375rem;
  }
`

const Details: React.FunctionComponent<CellProps> = ({ liquidity, lpName, liquidityUrlPathParts }) => {
  const TranslateString = useI18n()

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
          <StakeLabel>{TranslateString(316, 'Stake')}:</StakeLabel>
          <StyledLinkExternal href={`https://exchange.pancakeswap.finance/#/add/${liquidityUrlPathParts}`}>
            {lpName}
          </StyledLinkExternal>
        </div>
        <div>
          <StakeLabel>{TranslateString(999, 'Liquidity')}:</StakeLabel>
          <span>{renderLiquidity()}</span>
        </div>
      </Container>
    </>
  )
}

export default Details
