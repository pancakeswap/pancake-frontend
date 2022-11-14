import { Flex, Box } from '@pancakeswap/uikit'
import styled from 'styled-components'
import { CurrencyLogo, DoubleCurrencyLogo } from 'components/Logo'
import { Trade, TradeType, Currency } from '@pancakeswap/sdk'

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
  trade?: Trade<Currency, Currency, TradeType>
}

export const RouterViewer: React.FC<RouterViewerProps> = ({ trade, inputCurrency, outputCurrency }) => {
  return (
    <RouterBox justifyContent="space-between">
      <CurrencyLogo currency={inputCurrency || trade?.route?.input} />
      {trade?.route &&
        trade?.route.pairs.map((d) => (
          <RouterPoolBox key={`tradingPairIds${d.liquidityToken.address}`}>
            <DoubleCurrencyLogo currency0={d.token0} currency1={d.token1} />
          </RouterPoolBox>
        ))}
      <CurrencyLogo currency={outputCurrency || trade?.route?.output} />
    </RouterBox>
  )
}
