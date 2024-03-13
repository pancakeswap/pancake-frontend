import { Pair } from '@pancakeswap/sdk'
import { Tag } from '@pancakeswap/uikit'
import { useTokensDeposited } from 'components/PositionCard'
import useTotalSupply from 'hooks/useTotalSupply'
import React from 'react'
import { useTokenBalance } from 'state/wallet/hooks'
import currencyId from 'utils/currencyId'
import { unwrappedToken } from 'utils/wrappedCurrency'
import { LiquidityCardRow } from 'views/AddLiquidity/components/LiquidityCardRow'

export const V2PairCard = React.memo(({ pair, account }: { pair: null | Pair; account: string | undefined }) => {
  const userPoolBalance = useTokenBalance(account ?? undefined, pair?.liquidityToken)

  const totalPoolTokens = useTotalSupply(pair?.liquidityToken)

  const [token0Deposited, token1Deposited] = useTokensDeposited({ pair, userPoolBalance, totalPoolTokens })

  if (!pair) {
    return null
  }

  const unwrappedToken0 = unwrappedToken(pair.token0)
  const unwrappedToken1 = unwrappedToken(pair.token1)

  if (!unwrappedToken0 || !unwrappedToken1) return null

  return (
    <LiquidityCardRow
      link={`/v2/pair/${currencyId(unwrappedToken0)}/${currencyId(unwrappedToken1)}`}
      currency0={unwrappedToken0}
      currency1={unwrappedToken1}
      pairText={`${unwrappedToken0.symbol}-${unwrappedToken1.symbol} V2 LP`}
      subtitle={`${token0Deposited?.toSignificant(6)} ${unwrappedToken0.symbol} / ${token1Deposited?.toSignificant(6)}
        ${unwrappedToken1.symbol}`}
      tags={<Tag variant="secondary">V2 LP</Tag>}
    />
  )
})
