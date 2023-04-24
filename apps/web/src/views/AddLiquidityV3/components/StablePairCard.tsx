import { Tag } from '@pancakeswap/uikit'
import { useTokenBalance } from 'state/wallet/hooks'
import { useGetRemovedTokenAmounts } from 'views/RemoveLiquidity/RemoveStableLiquidity/hooks/useStableDerivedBurnInfo'
import { LPStablePair } from 'views/Swap/hooks/useStableConfig'
import { LiquidityCardRow } from 'components/LiquidityCardRow'

export function StablePairCard({ pair, account }: { pair: LPStablePair; account: string }) {
  const userPoolBalance = useTokenBalance(account ?? undefined, pair.liquidityToken)

  const [token0Deposited, token1Deposited] = useGetRemovedTokenAmounts({
    lpAmount: userPoolBalance?.quotient?.toString(),
  })

  return (
    <LiquidityCardRow
      link={`/stable/${pair.liquidityToken.address}`}
      currency0={pair.token0}
      currency1={pair.token1}
      pairText={`${pair.token0.symbol}-${pair.token1.symbol} Stable LP`}
      feeAmount={pair.stableLpFee * 1000000}
      tags={
        <Tag variant="secondary" outline>
          Stable LP
        </Tag>
      }
      subtitle={`${token0Deposited?.toSignificant(6)} ${pair.token0.symbol} / ${token1Deposited?.toSignificant(6)} 
        ${pair.token1.symbol}`}
    />
  )
}
