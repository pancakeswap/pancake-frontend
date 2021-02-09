import React from 'react'
import styled from 'styled-components'
import ApyButton from 'views/Farms/components/FarmCard/ApyButton'
import { Address, QuoteToken } from 'config/constants/types'
import BigNumber from 'bignumber.js'
import CellLayout from './CellLayout'

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
  width: 7.5rem;
  display: flex;
  align-items: center;
  color: ${(props) => props.theme.colors.text};
  font-weight: 600;

  button {
    width: 1.25rem;
    height: 1.25rem;

    svg {
      path {
        fill: ${(props) => props.theme.colors.textSubtle};
      }
    }
  }
`

const AprWrapper = styled.div`
  min-width: 3.8rem;
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
  return (
    <CellLayout label="APR">
      <Container>
        <AprWrapper>
          {displayApr}
        </AprWrapper>
        <ApyButton
          lpLabel={lpLabel}
          quoteTokenAdresses={quoteTokenAdresses}
          quoteTokenSymbol={quoteTokenSymbol}
          tokenAddresses={tokenAddresses}
          cakePrice={cakePrice}
          apy={originalValue}
        />
      </Container>
    </CellLayout>
  )
}

export default Apr
