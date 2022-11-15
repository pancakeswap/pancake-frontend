import { Currency, Pair } from '@pancakeswap/sdk'
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
        pairs.map((d) => (
          <RouterPoolBox key={`tradingPairIds${d.liquidityToken.address}`}>
            <DoubleCurrencyLogo currency0={d.token0} currency1={d.token1} />
          </RouterPoolBox>
        ))}
      <CurrencyLogo currency={outputCurrency} />
    </RouterBox>
  )
}
