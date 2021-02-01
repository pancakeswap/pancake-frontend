import React from 'react'
import styled from 'styled-components'
import ApyButton from 'views/Farms/components/FarmCard/ApyButton'
import { Address, QuoteToken } from 'config/constants/types'
import BigNumber from 'bignumber.js'

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
`

const Multiplier = styled.div`
  background: ${({ theme }) => theme.colors.secondary};
  border-radius: 1rem;
  color: ${({ theme }) => theme.card.background};
  padding: 0.3125rem 0rem;
  width: 2.5rem;
  text-align: center;
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
      <Multiplier>{multiplier}</Multiplier>
    </Container>
  )
}

export default Apr
