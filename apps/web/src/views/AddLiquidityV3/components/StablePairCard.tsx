import { Tag } from '@pancakeswap/uikit'
import { useTokenBalance } from 'state/wallet/hooks'
import { getTokenSymbolAlias } from 'utils/getTokenAlias'
import { LiquidityCardRow } from 'views/AddLiquidity/components/LiquidityCardRow'
import { useGetRemovedTokenAmounts } from 'views/RemoveLiquidity/RemoveStableLiquidity/hooks/useStableDerivedBurnInfo'
import { LPStablePair } from 'views/Swap/hooks/useStableConfig'

export function StablePairCard({ pair, account }: { pair: LPStablePair; account: string | undefined }) {
  const userPoolBalance = useTokenBalance(account ?? undefined, pair.liquidityToken)
  const token0symbol = pair.token0.isToken
    ? getTokenSymbolAlias(pair.token0.address, pair.token0.chainId, pair.token0.symbol)
    : pair.token0.symbol
  const token1symbol = pair.token1.isToken
    ? getTokenSymbolAlias(pair.token1.address, pair.token1.chainId, pair.token1.symbol)
    : pair.token1.symbol

  const [token0Deposited, token1Deposited] = useGetRemovedTokenAmounts({
    lpAmount: userPoolBalance?.quotient?.toString() ?? '0',
  })

  return (
    <LiquidityCardRow
      link={`/stable/${pair.liquidityToken.address}`}
      currency0={pair.token0}
      currency1={pair.token1}
      pairText={`${token0symbol}-${token1symbol} Stable LP`}
      feeAmount={pair.stableTotalFee * 1000000}
      tags={
        <Tag variant="secondary" outline>
          Stable LP
        </Tag>
      }
      subtitle={`${token0Deposited?.toSignificant(6)} ${token0symbol} / ${token1Deposited?.toSignificant(6)} 
        ${token1symbol}`}
    />
  )
}
