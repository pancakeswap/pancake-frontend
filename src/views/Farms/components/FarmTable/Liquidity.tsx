import React from 'react'
import styled from 'styled-components'
import { HelpIcon, Text } from '@pancakeswap-libs/uikit'
import useI18n from 'hooks/useI18n'

import Tooltip from '../Tooltip/Tooltip'

export interface LiquidityProps {
  liquidity: number
}

const LiquidityWrapper = styled.div`
  min-width: 110px;
  font-weight: 600;
  text-align: right;

  ${({ theme }) => theme.mediaQueries.sm} {
    text-align: left;
  }
`

const Container = styled.div`
  display: flex;
  align-items: center;

  svg {
    margin-left: 14px;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    svg {
      margin-left: 0;
    }
  }
`

const Liquidity: React.FunctionComponent<LiquidityProps> = ({ liquidity }) => {
  const displayLiquidity = liquidity
    ? `$${Number(liquidity).toLocaleString(undefined, { maximumFractionDigits: 0 })}`
    : '-'
  const TranslateString = useI18n()

  return (
    <Container>
      <LiquidityWrapper>
        <Text>{displayLiquidity}</Text>
      </LiquidityWrapper>
      <Tooltip content={TranslateString(999, 'The total value of the funds in this farm’s liquidity pool')}>
        <HelpIcon color="textSubtle" />
      </Tooltip>
    </Container>
  )
}

export default Liquidity
