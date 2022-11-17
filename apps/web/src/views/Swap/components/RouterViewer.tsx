import { Currency } from '@pancakeswap/sdk'
import { Pair, isStableSwapPair } from '@pancakeswap/smart-router/evm'
import { Box, Flex } from '@pancakeswap/uikit'
import { CurrencyLogo, DoubleCurrencyLogo } from 'components/Logo'
import styled from 'styled-components'

const RouterBox = styled(Flex)`
  background-image: radial-gradient(${({ theme }) => theme.colors.textSubtle} 10%, transparent 10%);
  background-size: 10% 100%;
`
const RouterPoolBox = styled(Box)`
  padding: 3px;
  border-radius: 20px;
  background-color: ${({ theme }) => theme.colors.backgroundDisabled};
`

interface RouterViewerProps {
  inputCurrency?: Currency
  outputCurrency?: Currency
  pairs?: Pair[]
}

export const RouterViewer: React.FC<RouterViewerProps> = ({ pairs, inputCurrency, outputCurrency }) => {
  return (
    <RouterBox justifyContent="space-between">
      <CurrencyLogo currency={inputCurrency} />
      {pairs &&
        pairs.map((p) => (
          <RouterPoolBox key={`tradingPairIds${isStableSwapPair(p) ? p.stableSwapAddress : p.liquidityToken.address}`}>
            <DoubleCurrencyLogo currency0={p.token0} currency1={p.token1} />
          </RouterPoolBox>
        ))}
      <CurrencyLogo currency={outputCurrency} />
    </RouterBox>
  )
}
