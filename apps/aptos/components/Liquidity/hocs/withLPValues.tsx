import multiplyPriceByAmount from '@pancakeswap/utils/multiplyPriceByAmount'

import { Coin, JSBI, Pair, Percent, Price } from '@pancakeswap/aptos-swap-sdk'
import { memo, useMemo } from 'react'
import { useCurrencyBalance } from 'hooks/Balances'
import useTotalSupply from 'hooks/useTotalSupply'
import currencyId from 'utils/currencyId'

// Philip TODO: Replace useBUSDPrice mock
export function useBUSDPrice(currency?: Coin): Price<Coin, Coin> | undefined {
  if (!currency) return undefined

  return new Price(currency, currency, JSBI.BigInt(0), JSBI.BigInt(0))
}

const useTokensDeposited = ({ pair, totalPoolTokens, userPoolBalance }) => {
  return useMemo(() => {
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
}

const useTotalUSDValue = ({ currency0, currency1, token0Deposited, token1Deposited }) => {
  const token0Price = useBUSDPrice(currency0)
  const token1Price = useBUSDPrice(currency1)

  const token0USDValue =
    token0Deposited && token0Price
      ? multiplyPriceByAmount(token0Price, parseFloat(token0Deposited.toSignificant(8)))
      : null
  const token1USDValue =
    token1Deposited && token1Price
      ? multiplyPriceByAmount(token1Price, parseFloat(token1Deposited.toSignificant(8)))
      : null
  return token0USDValue && token1USDValue ? token0USDValue + token1USDValue : null
}

const usePoolTokenPercentage = ({ userPoolBalance, totalPoolTokens }) => {
  return useMemo(
    () =>
      !!userPoolBalance &&
      !!totalPoolTokens &&
      JSBI.greaterThanOrEqual(totalPoolTokens.quotient, userPoolBalance.quotient)
        ? new Percent(userPoolBalance.quotient, totalPoolTokens.quotient)
        : undefined,
    [userPoolBalance, totalPoolTokens],
  )
}

const withLPValues = (Component) =>
  memo(({ pair, mb }: { pair: Pair; mb?: string }) => {
    const currency0 = pair.token0
    const currency1 = pair.token1

    const totalPoolTokens = useTotalSupply(pair.liquidityToken)
    const userPoolBalance = useCurrencyBalance(pair.liquidityToken.address)
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
        userPoolBalance={userPoolBalance}
        poolTokenPercentage={poolTokenPercentage}
        removeTo={`/remove/${currencyId(currency0)}/${currencyId(currency1)}`}
        addTo={`/add/${currencyId(currency0)}/${currencyId(currency1)}?step=1`}
      />
    )
  })

export default withLPValues
