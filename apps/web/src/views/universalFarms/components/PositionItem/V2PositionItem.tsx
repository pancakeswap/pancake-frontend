import { unwrappedToken } from '@pancakeswap/tokens'
import { memo, useMemo } from 'react'
import { usePoolInfo, usePoolTimeFrame } from 'state/farmsV4/hooks'
import { V2LPDetail } from 'state/farmsV4/state/accountPositions/type'
import { V2PoolInfo } from 'state/farmsV4/state/type'
import currencyId from 'utils/currencyId'
import { v2Fee } from 'views/PoolDetail/hooks/useStablePoolFee'
import { useTotalPriceUSD } from 'hooks/useTotalPriceUSD'
import { V2PositionActions } from '../PositionActions/V2PositionActions'
import { PositionItem } from './PositionItem'

export const V2PositionItem = memo(
  ({ data, detailMode, poolLength }: { poolLength?: number; data: V2LPDetail; detailMode?: boolean }) => {
    const {
      pair: {
        token0,
        token1,
        chainId,
        liquidityToken: { address },
      },
      nativeDeposited0,
      nativeDeposited1,
      nativeBalance,
      farmingBalance,
      farmingDeposited0,
      farmingDeposited1,
    } = data

    const unwrappedToken0 = unwrappedToken(token0)
    const unwrappedToken1 = unwrappedToken(token1)
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
    const pool = usePoolInfo<V2PoolInfo>({ poolAddress: address, chainId })
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
            link={`/v2/pair/${currencyId(unwrappedToken0)}/${currencyId(unwrappedToken1)}`}
            totalPriceUSD={nativeTotalPriceUSD}
            currency0={unwrappedToken0}
            currency1={unwrappedToken1}
            removed={false}
            outOfRange={false}
            protocol={data.protocol}
            fee={feeAmount}
            isStaked={false}
            amount0={nativeDeposited0}
            amount1={nativeDeposited1}
            detailMode={detailMode}
          >
            {chainId && pool?.lpAddress && pool.bCakeWrapperAddress ? (
              <V2PositionActions
                isFarmLive={isFarmLive}
                poolInfo={pool}
                isStaked={false}
                data={data}
                lpAddress={pool.lpAddress}
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
            userPosition={data}
          >
            {chainId && pool?.lpAddress && pool.bCakeWrapperAddress ? (
              <V2PositionActions
                isFarmLive={isFarmLive}
                isStaked
                data={data}
                poolInfo={pool}
                lpAddress={pool.lpAddress}
                chainId={chainId}
                pid={pool.pid}
                tvlUsd={pool.tvlUsd}
              />
            ) : null}
          </PositionItem>
        ) : null}
      </>
    )
  },
)
