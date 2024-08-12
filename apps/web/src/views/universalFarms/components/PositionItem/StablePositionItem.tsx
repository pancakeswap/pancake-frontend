import { memo } from 'react'
import { usePoolInfo } from 'state/farmsV4/hooks'
import { StableLPDetail } from 'state/farmsV4/state/accountPositions/type'
import { PoolInfo } from 'state/farmsV4/state/type'
import { useTotalPriceUSD } from 'views/universalFarms/hooks'
import { PositionItem } from './PositionItem'

export const StablePositionItem = memo(
  ({ data, detailMode }: { data: StableLPDetail; pool?: PoolInfo; detailMode?: boolean }) => {
    const { pair, deposited0, deposited1 } = data

    const totalPriceUSD = useTotalPriceUSD({
      currency0: pair.token0,
      currency1: pair.token1,
      amount0: deposited0,
      amount1: deposited1,
    })
    const pool = usePoolInfo({ poolAddress: pair.stableSwapAddress, chainId: pair.liquidityToken.chainId })

    return (
      <PositionItem
        chainId={pair.liquidityToken.chainId}
        pool={pool}
        link={`/stable/${pair.lpAddress}`}
        totalPriceUSD={totalPriceUSD}
        currency0={pair.token0}
        currency1={pair.token1}
        removed={false}
        outOfRange={false}
        protocol={data.protocol}
        fee={Number(pair.fee.numerator)}
        amount0={deposited0}
        amount1={deposited1}
        detailMode={detailMode}
      />
    )
  },
)
