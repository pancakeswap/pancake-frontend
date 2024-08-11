import { unwrappedToken } from '@pancakeswap/tokens'
import { memo, useMemo } from 'react'
import { usePoolInfo } from 'state/farmsV4/hooks'
import { V2LPDetail } from 'state/farmsV4/state/accountPositions/type'
import { PoolInfo } from 'state/farmsV4/state/type'
import currencyId from 'utils/currencyId'
import { v2Fee } from 'views/PoolDetail/hooks/useStablePoolFee'
import { useTotalPriceUSD } from 'views/universalFarms/hooks'
import { PositionItem } from './PositionItem'

export const V2PositionItem = memo(
  ({ data, detailMode }: { data: V2LPDetail; pool?: PoolInfo; detailMode?: boolean }) => {
    const { pair, deposited0, deposited1 } = data

    const unwrappedToken0 = unwrappedToken(pair.token0)
    const unwrappedToken1 = unwrappedToken(pair.token1)
    const totalPriceUSD = useTotalPriceUSD({
      currency0: unwrappedToken0,
      currency1: unwrappedToken1,
      amount0: deposited0,
      amount1: deposited1,
    })

    const feeAmount = useMemo(() => Number(v2Fee.multiply(100).toFixed(2)), [])
    const pool = usePoolInfo({ poolAddress: data.pair.liquidityToken.address, chainId: pair.chainId })

    return (
      <PositionItem
        data={data}
        chainId={pair.chainId}
        pool={pool}
        link={`/v2/pair/${currencyId(unwrappedToken0)}/${currencyId(unwrappedToken1)}`}
        totalPriceUSD={totalPriceUSD}
        currency0={unwrappedToken0}
        currency1={unwrappedToken1}
        removed={false}
        outOfRange={false}
        protocol={data.protocol}
        fee={feeAmount}
        amount0={deposited0}
        amount1={deposited1}
        detailMode={detailMode}
      />
    )
  },
)
