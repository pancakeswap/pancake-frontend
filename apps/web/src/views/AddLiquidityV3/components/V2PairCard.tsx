import { useTokenBalance } from 'state/wallet/hooks'
import useTotalSupply from 'hooks/useTotalSupply'
import { useTokensDeposited } from 'components/PositionCard'
import { Tag } from '@pancakeswap/uikit'
import { Pair } from '@pancakeswap/sdk'
import { LiquidityCardRow } from 'components/LiquidityCardRow'

export function V2PairCard({ pair, account }: { pair: Pair; account: string }) {
  const userPoolBalance = useTokenBalance(account ?? undefined, pair.liquidityToken)

  const totalPoolTokens = useTotalSupply(pair.liquidityToken)

  const [token0Deposited, token1Deposited] = useTokensDeposited({ pair, userPoolBalance, totalPoolTokens })

  return (
    <LiquidityCardRow
      link={`/v2/pair/${pair.token0.address}/${pair.token1.address}`}
      currency0={pair.token0}
      currency1={pair.token1}
      pairText={`${pair.token0.symbol}-${pair.token1.symbol} V2 LP`}
      subtitle={`${token0Deposited?.toSignificant(6)} ${pair.token0.symbol} / ${token1Deposited?.toSignificant(6)} 
        ${pair.token1.symbol}`}
      tags={<Tag variant="secondary">V2 LP</Tag>}
    />
  )
}
