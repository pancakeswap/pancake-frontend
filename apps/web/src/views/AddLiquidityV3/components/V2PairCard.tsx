import { useTokenBalance } from 'state/wallet/hooks'
import useTotalSupply from 'hooks/useTotalSupply'
import { useTokensDeposited } from 'components/PositionCard'
import { Tag } from '@pancakeswap/uikit'
import { Pair } from '@pancakeswap/sdk'
import { LiquidityCardRow } from 'components/LiquidityCardRow'
import { unwrappedToken } from 'utils/wrappedCurrency'
import currencyId from 'utils/currencyId'

export function V2PairCard({ pair, account }: { pair: Pair; account: string }) {
  const userPoolBalance = useTokenBalance(account ?? undefined, pair.liquidityToken)

  const totalPoolTokens = useTotalSupply(pair.liquidityToken)

  const [token0Deposited, token1Deposited] = useTokensDeposited({ pair, userPoolBalance, totalPoolTokens })

  const unwrappedToken0 = unwrappedToken(pair.token0)
  const unwrappedToken1 = unwrappedToken(pair.token1)

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
}
