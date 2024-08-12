import { memo } from 'react'
import { usePoolInfo } from 'state/farmsV4/hooks'
import { StableLPDetail } from 'state/farmsV4/state/accountPositions/type'
import { useTotalPriceUSD } from 'views/universalFarms/hooks'
import { V2PositionActions } from '../PositionActions/V2PositionActions'
import { PositionItem } from './PositionItem'

export const StablePositionItem = memo(({ data, detailMode }: { data: StableLPDetail; detailMode?: boolean }) => {
  const {
    pair,
    nativeDeposited0,
    nativeDeposited1,
    nativeBalance,
    farmingBalance,
    farmingDeposited0,
    farmingDeposited1,
  } = data

  const nativeTotalPriceUSD = useTotalPriceUSD({
    currency0: pair.token0,
    currency1: pair.token1,
    amount0: nativeDeposited0,
    amount1: nativeDeposited1,
  })
  const pool = usePoolInfo({ poolAddress: pair.stableSwapAddress, chainId: pair.liquidityToken.chainId })

  return (
    <>
      {nativeBalance.greaterThan('0') ? (
        <PositionItem
          chainId={pair.liquidityToken.chainId}
          pool={pool}
          link={`/stable/${pair.lpAddress}`}
          totalPriceUSD={nativeTotalPriceUSD}
          currency0={pair.token0}
          currency1={pair.token1}
          removed={false}
          outOfRange={false}
          protocol={data.protocol}
          fee={Number(pair.stableLpFee) * 10000}
          isStaked={false}
          amount0={nativeDeposited0}
          amount1={nativeDeposited1}
          detailMode={detailMode}
        >
          {pair.liquidityToken.chainId && pool?.lpAddress && pool.pid ? (
            <V2PositionActions
              isStaked={false}
              data={data}
              lpAddress={pool.lpAddress}
              chainId={pair.liquidityToken.chainId}
              pid={pool.pid}
            />
          ) : null}
        </PositionItem>
      ) : null}
      {farmingBalance.greaterThan('0') ? (
        <PositionItem
          chainId={pair.liquidityToken.chainId}
          pool={pool}
          link={`/stable/${pair.lpAddress}`}
          totalPriceUSD={nativeTotalPriceUSD}
          currency0={pair.token0}
          currency1={pair.token1}
          removed={false}
          outOfRange={false}
          protocol={data.protocol}
          fee={Number(pair.stableLpFee) * 10000}
          isStaked
          amount0={farmingDeposited0}
          amount1={farmingDeposited1}
          detailMode={detailMode}
        >
          {pair.liquidityToken.chainId && pool?.lpAddress && pool.pid ? (
            <V2PositionActions
              isStaked
              data={data}
              lpAddress={pool.lpAddress}
              chainId={pair.liquidityToken.chainId}
              pid={pool.pid}
            />
          ) : null}
        </PositionItem>
      ) : null}
    </>
  )
})
