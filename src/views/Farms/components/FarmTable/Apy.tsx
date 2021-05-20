import React from 'react'
import styled from 'styled-components'
import ApyButton from 'views/Farms/components/FarmCard/ApyButton'
import { Address } from 'config/constants/types'
import BigNumber from 'bignumber.js'
import { BASE_ADD_LIQUIDITY_URL } from 'config'
import getLiquidityUrlPathParts from 'utils/getLiquidityUrlPathParts'
import { Skeleton } from '@pancakeswap/uikit'

export interface ApyProps {
  value: string
//  multiplier: string
  lpLabel: string
  tokenAddress?: Address
  quoteTokenAddress?: Address
//  cakePrice: BigNumber
  originalValue: number
  hideButton?: boolean
}

const Container = styled.div`
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.colors.text};

  button {
    width: 20px;
    height: 20px;

    svg {
      path {
        fill: ${({ theme }) => theme.colors.textSubtle};
      }
    }
  }
`

const ApyWrapper = styled.div`
  min-width: 60px;
  text-align: left;
`

const Apy: React.FC<ApyProps> = ({
  value,
  lpLabel,
  tokenAddress,
  quoteTokenAddress,
  originalValue,
}) => {
  const liquidityUrlPathParts = getLiquidityUrlPathParts({ quoteTokenAddress, tokenAddress })
  const addLiquidityUrl = `${BASE_ADD_LIQUIDITY_URL}/${liquidityUrlPathParts}`

  return originalValue !== 0 ? (
    <Container>
      {originalValue ? (
        <>
          <ApyWrapper>{value}%</ApyWrapper>
        </>
      ) : (
        <ApyWrapper>
          <Skeleton width={60} />
        </ApyWrapper>
      )}
    </Container>
  ) : (
    <Container>
      <ApyWrapper>{originalValue}%</ApyWrapper>
    </Container>
  )
}

export default Apy
