import { unwrappedToken } from '@pancakeswap/tokens'
import { memo, useMemo } from 'react'
import { usePoolInfo } from 'state/farmsV4/hooks'
import { V2LPDetail } from 'state/farmsV4/state/accountPositions/type'
import { PoolInfo } from 'state/farmsV4/state/type'
import currencyId from 'utils/currencyId'
import { v2Fee } from 'views/PoolDetail/hooks/useStablePoolFee'
import { useTotalPriceUSD } from 'views/universalFarms/hooks'
import { V2PositionActions } from '../PositionActions/V2PositionActions'
import { PositionItem } from './PositionItem'

export const V2PositionItem = memo(
  ({ data, detailMode }: { data: V2LPDetail; pool?: PoolInfo; detailMode?: boolean }) => {
    const {
      pair,
      nativeDeposited0,
      nativeDeposited1,
      nativeBalance,
      farmingBalance,
      farmingDeposited0,
      farmingDeposited1,
    } = data

    const unwrappedToken0 = unwrappedToken(pair.token0)
    const unwrappedToken1 = unwrappedToken(pair.token1)
    const nativeTotalPriceUSD = useTotalPriceUSD({
      currency0: unwrappedToken0,
      currency1: unwrappedToken1,
      amount0: nativeDeposited0,
      amount1: nativeDeposited1,
    })
    const farmingTotalPriceUSD = useTotalPriceUSD({
      currency0: unwrappedToken0,
      currency1: unwrappedToken1,
      amount0: farmingDeposited0,
      amount1: farmingDeposited1,
    })

    const feeAmount = useMemo(() => Number(v2Fee.multiply(100).toFixed(2)), [])
    const pool = usePoolInfo({ poolAddress: data.pair.liquidityToken.address, chainId: pair.chainId })

    return (
      <>
        {nativeBalance.greaterThan('0') ? (
          <PositionItem
            chainId={pair.chainId}
            pool={pool}
            link={`/v2/pair/${currencyId(unwrappedToken0)}/${currencyId(unwrappedToken1)}`}
            totalPriceUSD={nativeTotalPriceUSD}
            currency0={unwrappedToken0}
            currency1={unwrappedToken1}
            removed={false}
            outOfRange={false}
            protocol={data.protocol}
            fee={feeAmount}
            amount0={nativeDeposited0}
            isStaked={false}
            amount1={nativeDeposited1}
            detailMode={detailMode}
          >
            <V2PositionActions data={data} />
          </PositionItem>
        ) : null}
        {farmingBalance.greaterThan('0') ? (
          <PositionItem
            chainId={pair.chainId}
            pool={pool}
            link={`/v2/pair/${currencyId(unwrappedToken0)}/${currencyId(unwrappedToken1)}`}
            totalPriceUSD={farmingTotalPriceUSD}
            currency0={unwrappedToken0}
            currency1={unwrappedToken1}
            removed={false}
            outOfRange={false}
            isStaked
            protocol={data.protocol}
            fee={feeAmount}
            amount0={farmingDeposited0}
            amount1={farmingDeposited1}
            detailMode={detailMode}
          >
            <V2PositionActions data={data} />
          </PositionItem>
        ) : null}
      </>
    )
  },
)
