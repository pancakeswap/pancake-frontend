// import { useMemo } from 'react'
// import { Currency, CurrencyAmount, JSBI, Pair, Percent } from '@pancakeswap/sdk'
// import { CardProps } from '@pancakeswap/uikit'
// import { useAccount } from '@pancakeswap/awgmi'
import multiplyPriceByAmount from '@pancakeswap/utils/multiplyPriceByAmount'

import { Coin, Currency, CurrencyAmount, JSBI, Pair, Percent, Price } from '@pancakeswap/aptos-swap-sdk'
import { useMemo } from 'react'

// Philip TODO: Replace useTotalSupply mock
export function useTotalSupply(token?: Coin): CurrencyAmount<Coin> | undefined {
  // const contract = useTokenContract(token?.isToken ? token.address : undefined, false)

  // const totalSupplyStr: string | undefined = useSingleCallResult(contract, 'totalSupply')?.result?.[0]?.toString()

  return useMemo(() => (token ? CurrencyAmount.fromRawAmount(token, '0') : undefined), [token])
}

// Philip TODO: Replace useBUSDPrice mock
export function useBUSDPrice(currency?: Coin): Price<Coin, Coin> | undefined {
  if (!currency) return undefined

  return new Price(currency, currency, JSBI.BigInt(0), JSBI.BigInt(0))
}

const useTokensDeposited = ({ pair, totalPoolTokens, userPoolBalance }) => {
  const [token0Deposited, token1Deposited] = useMemo(() => {
    return !!pair &&
      !!totalPoolTokens &&
      !!userPoolBalance &&
      // this condition is a short-circuit in the case where useTokenBalance updates sooner than useTotalSupply
      JSBI.greaterThanOrEqual(totalPoolTokens.quotient, userPoolBalance.quotient)
      ? [
          pair.getLiquidityValue(pair.token0, totalPoolTokens, userPoolBalance, false),
          pair.getLiquidityValue(pair.token1, totalPoolTokens, userPoolBalance, false),
        ]
      : [undefined, undefined]
  }, [totalPoolTokens, userPoolBalance, pair])

  return [token0Deposited, token1Deposited]
}

const useTotalUSDValue = ({ currency0, currency1, token0Deposited, token1Deposited }) => {
  const token0Price = useBUSDPrice(currency0)
  const token1Price = useBUSDPrice(currency1)

  const token0USDValue =
    token0Deposited && token0Price
      ? multiplyPriceByAmount(token0Price, parseFloat(token0Deposited.toSignificant(6)))
      : null
  const token1USDValue =
    token1Deposited && token1Price
      ? multiplyPriceByAmount(token1Price, parseFloat(token1Deposited.toSignificant(6)))
      : null
  return token0USDValue && token1USDValue ? token0USDValue + token1USDValue : null
}

const usePoolTokenPercentage = ({ userPoolBalance, totalPoolTokens }) => {
  return !!userPoolBalance &&
    !!totalPoolTokens &&
    JSBI.greaterThanOrEqual(totalPoolTokens.quotient, userPoolBalance.quotient)
    ? new Percent(userPoolBalance.quotient, totalPoolTokens.quotient)
    : undefined
}

// Philip TODO: add userPoolBalance type
const withLPValues =
  (Component) =>
  ({ pair, mb }: { pair: Pair; mb: string }) => {
    const currency0 = pair.token0
    const currency1 = pair.token1

    const totalPoolTokens = useTotalSupply(pair.liquidityToken)

    const poolTokenPercentage = usePoolTokenPercentage({ totalPoolTokens, userPoolBalance })

    const [token0Deposited, token1Deposited] = useTokensDeposited({ pair, userPoolBalance, totalPoolTokens })

    const totalUSDValue = useTotalUSDValue({ currency0, currency1, token0Deposited, token1Deposited })

    return (
      <Component
        mb={mb}
        currency0={currency0}
        currency1={currency1}
        token0Deposited={token0Deposited}
        token1Deposited={token1Deposited}
        totalUSDValue={totalUSDValue}
        userPoolBalance={CurrencyAmount.fromRawAmount(pair.liquidityToken, '0')}
        poolTokenPercentage={poolTokenPercentage}
      />
    )
  }

export default withLPValues
