import { useTranslation } from '@pancakeswap/localization'
import { PairDataTimeWindowEnum, UseModalV2Props } from '@pancakeswap/uikit'
import { encodeSqrtRatioX96 } from '@pancakeswap/v3-sdk'
import { RoiCalculatorModalV2 } from '@pancakeswap/widgets-internal/roi'
import BigNumber from 'bignumber.js'
import { useCakePrice } from 'hooks/useCakePrice'
import { useCurrencyUsdPrice } from 'hooks/useCurrencyUsdPrice'
import { usePairTokensPrice } from 'hooks/v3/usePairTokensPrice'
import { useAllV3Ticks } from 'hooks/v3/usePoolTickData'
import useV3DerivedInfo from 'hooks/v3/useV3DerivedInfo'
import React, { useMemo, useState } from 'react'
import { CakeApr } from 'state/farmsV4/atom'
import { useExtraV3PositionInfo } from 'state/farmsV4/hooks'
import { PositionDetail } from 'state/farmsV4/state/accountPositions/type'
import { PoolInfo } from 'state/farmsV4/state/type'
import { useV3FormState } from 'views/AddLiquidityV3/formViews/V3FormView/form/reducer'
import { useLmPoolLiquidity } from 'views/Farms/hooks/useLmPoolLiquidity'

type V3PoolAprModalProps = {
  modal: UseModalV2Props
  poolInfo: PoolInfo
  // combinedApr: number
  cakeApr?: CakeApr[keyof CakeApr]
  boostMultiplier?: number
  lpApr?: number
  userPosition?: PositionDetail
}

export const V3PoolAprModal: React.FC<V3PoolAprModalProps> = ({ modal, ...props }) => {
  return modal.isOpen ? <AprModal modal={modal} {...props} /> : null
}

const AprModal: React.FC<V3PoolAprModalProps> = ({ modal, poolInfo, userPosition, cakeApr }) => {
  const { t } = useTranslation()
  const cakePrice = useCakePrice()
  const { priceUpper, priceLower, position } = useExtraV3PositionInfo(userPosition)
  const { data: token0PriceUsd } = useCurrencyUsdPrice(poolInfo.token0, { enabled: !!poolInfo.token0 })
  const { data: token1PriceUsd } = useCurrencyUsdPrice(poolInfo.token1, { enabled: !!poolInfo.token1 })
  const formState = useV3FormState()
  const [priceTimeWindow, setPriceTimeWindow] = useState(PairDataTimeWindowEnum.DAY)
  const { pool, price, currencyBalances } = useV3DerivedInfo(
    poolInfo?.token0 ?? undefined,
    poolInfo?.token1 ?? undefined,
    poolInfo?.feeTier,
    poolInfo?.token0 ?? undefined,
    position,
    formState,
  )
  const { ticks: ticksData } = useAllV3Ticks(poolInfo.token0, poolInfo.token1, poolInfo.feeTier, modal.isOpen)
  const prices = usePairTokensPrice(poolInfo?.lpAddress, priceTimeWindow, poolInfo?.chainId, modal.isOpen)
  const sqrtRatioX96 = price && encodeSqrtRatioX96(price.numerator, price.denominator)
  const depositUsdAsBN = useMemo(
    () =>
      currencyBalances.CURRENCY_A &&
      currencyBalances.CURRENCY_B &&
      token0PriceUsd &&
      token1PriceUsd &&
      new BigNumber(currencyBalances.CURRENCY_A.toExact())
        .times(token0PriceUsd)
        .plus(new BigNumber(currencyBalances.CURRENCY_B.toExact()).times(token1PriceUsd)),
    [currencyBalances.CURRENCY_A, currencyBalances.CURRENCY_B, token0PriceUsd, token1PriceUsd],
  )
  const lmPoolLiquidity = useLmPoolLiquidity(poolInfo.lpAddress, poolInfo.chainId)
  const cakeAprFactor = useMemo(() => {
    if (!cakeApr?.poolWeight || !cakeApr?.cakePerYear) return new BigNumber(0)

    return new BigNumber(cakeApr.poolWeight)
      .times(cakeApr?.cakePerYear)
      .times(cakePrice)
      .div(new BigNumber(Number(lmPoolLiquidity) ?? 0).plus(position?.liquidity ? position?.liquidity.toString() : 0))
      .times(100)
  }, [cakeApr?.cakePerYear, cakeApr?.poolWeight, cakePrice, lmPoolLiquidity, position?.liquidity])

  return (
    <RoiCalculatorModalV2
      {...modal}
      isFarm={userPosition?.isStaked || poolInfo.isFarming}
      maxLabel={userPosition ? t('My Position') : undefined}
      closeOnOverlayClick={false}
      depositAmountInUsd={depositUsdAsBN?.toString()}
      max={depositUsdAsBN?.toString()}
      balanceA={position?.amount0 ?? currencyBalances.CURRENCY_A}
      balanceB={position?.amount1 ?? currencyBalances.CURRENCY_B}
      price={price}
      currencyA={poolInfo.token0.wrapped}
      currencyB={poolInfo.token1.wrapped}
      currencyAUsdPrice={token0PriceUsd}
      currencyBUsdPrice={token1PriceUsd}
      sqrtRatioX96={sqrtRatioX96}
      liquidity={pool?.liquidity}
      customCakeApr={new BigNumber(cakeApr?.value ?? 0).times(100)}
      feeAmount={poolInfo.feeTier}
      ticks={ticksData}
      volume24H={Number(poolInfo.vol24hUsd) || 0}
      priceUpper={priceUpper}
      priceLower={priceLower}
      cakePrice={cakePrice.toFixed(3)}
      cakeAprFactor={cakeAprFactor}
      prices={prices}
      priceSpan={priceTimeWindow}
      onPriceSpanChange={setPriceTimeWindow}
    />
  )
}
