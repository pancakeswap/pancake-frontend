import React from 'react'
import styled from 'styled-components'
import ApyButton from 'views/Farms/components/FarmCard/ApyButton'
import { Address, QuoteToken } from 'config/constants/types'
import BigNumber from 'bignumber.js'
import { BASE_ADD_LIQUIDITY_URL } from 'config'
import getLiquidityUrlPathParts from 'utils/getLiquidityUrlPathParts'

export interface AprProps {
  value: number
  multiplier: string
  lpLabel: string
  quoteTokenAdresses: Address
  quoteTokenSymbol: QuoteToken
  tokenAddresses: Address
  cakePrice: BigNumber
  originalValue: BigNumber
}

const Container = styled.div`
  display: flex;
  align-items: center;
  color: ${(props) => props.theme.colors.text};
  font-weight: 600;

  button {
    width: 20px;
    height: 20px;

    svg {
      path {
        fill: ${(props) => props.theme.colors.textSubtle};
      }
    }
  }
`

const AprWrapper = styled.div`
  min-width: 60px;
  text-align: left;
`

const Apr: React.FunctionComponent<AprProps> = ({
  value,
  lpLabel,
  quoteTokenAdresses,
  quoteTokenSymbol,
  tokenAddresses,
  cakePrice,
  originalValue,
}) => {
  const displayApr = value ? `${value}%` : 'Loading...'
  const liquidityUrlPathParts = getLiquidityUrlPathParts({ quoteTokenAdresses, quoteTokenSymbol, tokenAddresses })
  const addLiquidityUrl = `${BASE_ADD_LIQUIDITY_URL}/${liquidityUrlPathParts}`
  return (
    <Container>
      <AprWrapper>{displayApr}</AprWrapper>
      <ApyButton lpLabel={lpLabel} cakePrice={cakePrice} apy={originalValue} addLiquidityUrl={addLiquidityUrl} />
    </Container>
  )
}

export default Apr
