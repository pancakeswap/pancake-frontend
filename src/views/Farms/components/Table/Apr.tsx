import React from 'react'
import styled from 'styled-components'
import ApyButton from 'views/Farms/components/FarmCard/ApyButton'
import { Address, QuoteToken } from 'config/constants/types'
import BigNumber from 'bignumber.js'

import ColumnLabel from './ColumnLabel'

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
  justify-content: space-between;
  color: ${(props) => props.theme.colors.text};

  button {
    width: 1.25rem;
    height: 1.25rem;
  }
`

const Apr: React.FunctionComponent<AprProps> = ({
  value,
  multiplier,
  lpLabel,
  quoteTokenAdresses,
  quoteTokenSymbol,
  tokenAddresses,
  cakePrice,
  originalValue,
}) => {
  const displayApy = value ? `${value}%` : 'Loading...'
  return (
    <div>
      <ColumnLabel>
        APR
      </ColumnLabel>
      <Container>
        <div>{displayApy}</div>
        <ApyButton
          lpLabel={lpLabel}
          quoteTokenAdresses={quoteTokenAdresses}
          quoteTokenSymbol={quoteTokenSymbol}
          tokenAddresses={tokenAddresses}
          cakePrice={cakePrice}
          apy={originalValue}
        />
      </Container>
    </div>
  )
}

export default Apr
