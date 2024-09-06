import { memo, useMemo } from 'react'
import { usePoolInfo, usePoolTimeFrame } from 'state/farmsV4/hooks'
import { StableLPDetail } from 'state/farmsV4/state/accountPositions/type'
import { StablePoolInfo } from 'state/farmsV4/state/type'
import { useTotalPriceUSD } from 'hooks/useTotalPriceUSD'
import { V2PositionActions } from '../PositionActions/V2PositionActions'
import { PositionItem } from './PositionItem'

export const StablePositionItem = memo(
  ({ data, detailMode, poolLength }: { poolLength?: number; data: StableLPDetail; detailMode?: boolean }) => {
    const {
      pair: {
        liquidityToken: { chainId, address },
        token0,
        token1,
        stableSwapAddress,
        lpAddress,
        stableTotalFee,
      },
      nativeDeposited0,
      nativeDeposited1,
      nativeBalance,
      farmingBalance,
      farmingDeposited0,
      farmingDeposited1,
    } = data

    const nativeTotalPriceUSD = useTotalPriceUSD({
      currency0: token0,
      currency1: token1,
      amount0: nativeDeposited0,
      amount1: nativeDeposited1,
    })
    const farmingTotalPriceUSD = useTotalPriceUSD({
      currency0: token0,
      currency1: token1,
      amount0: farmingDeposited0,
      amount1: farmingDeposited1,
    })
    const pool = usePoolInfo<StablePoolInfo>({ poolAddress: stableSwapAddress, chainId })

    const bCakeWrapperAddress = pool?.bCakeWrapperAddress

    const { startTimestamp, endTimestamp } = usePoolTimeFrame(bCakeWrapperAddress, chainId)

    const isFarmLive = useMemo(
      () =>
        bCakeWrapperAddress &&
        (!startTimestamp || Date.now() / 1000 >= startTimestamp) &&
        (!endTimestamp || Date.now() / 1000 < endTimestamp) &&
        (!poolLength || !pool?.pid || pool.pid <= poolLength),
      [pool?.pid, poolLength, bCakeWrapperAddress, startTimestamp, endTimestamp],
    )
    return (
      <>
        {nativeBalance.greaterThan('0') ? (
          <PositionItem
            chainId={chainId}
            pool={pool}
            link={`/stable/${lpAddress}`}
            totalPriceUSD={nativeTotalPriceUSD}
            currency0={token0}
            currency1={token1}
            removed={false}
            outOfRange={false}
            protocol={data.protocol}
            fee={Number(stableTotalFee) * 10000}
            isStaked={false}
            amount0={nativeDeposited0}
            amount1={nativeDeposited1}
            detailMode={detailMode}
          >
            {chainId && address && pool?.bCakeWrapperAddress ? (
              <V2PositionActions
                isFarmLive={isFarmLive}
                isStaked={false}
                poolInfo={pool}
                data={data}
                lpAddress={address}
                chainId={chainId}
                pid={pool.pid}
                tvlUsd={pool.tvlUsd}
              />
            ) : null}
          </PositionItem>
        ) : null}
        {farmingBalance.greaterThan('0') ? (
          <PositionItem
            chainId={chainId}
            pool={pool}
            link={`/stable/${lpAddress}`}
            totalPriceUSD={farmingTotalPriceUSD}
            currency0={token0}
            currency1={token1}
            removed={false}
            outOfRange={false}
            protocol={data.protocol}
            fee={Number(stableTotalFee) * 10000}
            isStaked
            amount0={farmingDeposited0}
            amount1={farmingDeposited1}
            detailMode={detailMode}
            userPosition={data}
          >
            {chainId && address && pool?.bCakeWrapperAddress ? (
              <V2PositionActions
                isFarmLive={isFarmLive}
                tvlUsd={pool.tvlUsd}
                isStaked
                data={data}
                poolInfo={pool}
                lpAddress={address}
                chainId={chainId}
                pid={pool.pid}
              />
            ) : null}
          </PositionItem>
        ) : null}
      </>
    )
  },
)
