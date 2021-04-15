import React from 'react'
import styled from 'styled-components'
import { HelpIcon, Text, useTooltip } from '@pancakeswap-libs/uikit'
import useI18n from 'hooks/useI18n'

const ReferenceElement = styled.div`
  display: inline-block;
`

export interface LiquidityProps {
  liquidity: number
}

const LiquidityWrapper = styled.div`
  min-width: 110px;
  font-weight: 600;
  text-align: right;
  margin-right: 14px;

  ${({ theme }) => theme.mediaQueries.lg} {
    text-align: left;
    margin-right: 0;
  }
`

const Container = styled.div`
  display: flex;
  align-items: center;
`

const Liquidity: React.FunctionComponent<LiquidityProps> = ({ liquidity }) => {
  const displayLiquidity = liquidity
    ? `$${Number(liquidity).toLocaleString(undefined, { maximumFractionDigits: 0 })}`
    : '-'
  const TranslateString = useI18n()
  const { targetRef, tooltip, tooltipVisible } = useTooltip(
    TranslateString(999, 'The total value of the funds in this farm’s liquidity pool'),
    'top-end',
    'hover',
    undefined,
    undefined,
    [20, 10],
  )

  return (
    <Container>
      <LiquidityWrapper>
        <Text>{displayLiquidity}</Text>
      </LiquidityWrapper>
      <ReferenceElement ref={targetRef}>
        <HelpIcon color="textSubtle" />
      </ReferenceElement>
      {tooltipVisible && tooltip}
    </Container>
  )
}

export default Liquidity
