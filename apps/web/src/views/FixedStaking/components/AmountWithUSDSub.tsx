import { CurrencyAmount, Token } from '@pancakeswap/swap-sdk-core'
import { Balance, Text } from '@pancakeswap/uikit'

import { useStablecoinPriceAmount } from 'hooks/useBUSDPrice'
import toNumber from 'lodash/toNumber'

export function AmountWithUSDSub({ amount }: { amount: CurrencyAmount<Token> }) {
  const formattedUsdAmount = useStablecoinPriceAmount(amount.currency, toNumber(amount.toSignificant(6)))

  return (
    <>
      <Text bold mb="-4px">
        {amount.toSignificant(2)} {amount.currency.symbol}
      </Text>
      <Balance unit=" USD" color="textSubtle" prefix="~$" fontSize="12px" decimals={2} value={formattedUsdAmount} />
    </>
  )
}
