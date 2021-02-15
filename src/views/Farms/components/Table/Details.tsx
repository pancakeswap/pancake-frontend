import React from 'react'
import styled from 'styled-components'
import { LinkExternal } from '@pancakeswap-libs/uikit'
import useI18n from 'hooks/useI18n'

export interface DetailsProps {
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
  margin-right: 8px;
`

const StyledLinkExternal = styled(LinkExternal)`
  white-space: nowrap;
  color: ${({ theme }) => theme.colors.primary};
  font-weight: normal;
  font-size: 14px;
  svg {
    width: 16px;
    height: 16px;
    margin-left: 6px;
  }
`

const Details: React.FunctionComponent<DetailsProps> = ({ liquidity, lpName, liquidityUrlPathParts }) => {
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
