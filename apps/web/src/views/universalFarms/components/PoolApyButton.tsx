import { useTranslation } from '@pancakeswap/localization'
import {
  Flex,
  LinkExternal,
  ModalV2,
  PairDataTimeWindowEnum,
  RoiCalculatorModal,
  Skeleton,
  Text,
  TooltipText,
  useModalV2,
  UseModalV2Props,
  useTooltip,
} from '@pancakeswap/uikit'
import { BIG_ZERO } from '@pancakeswap/utils/bigNumber'
import { encodeSqrtRatioX96 } from '@pancakeswap/v3-sdk'
import { Bound, FarmWidget } from '@pancakeswap/widgets-internal'
import { RoiCalculatorModalV2 } from '@pancakeswap/widgets-internal/roi'
import BigNumber from 'bignumber.js'
import { useCakePrice } from 'hooks/useCakePrice'
import { useCurrencyUsdPrice } from 'hooks/useCurrencyUsdPrice'
import { usePairTokensPrice } from 'hooks/v3/usePairTokensPrice'
import { useAllV3Ticks } from 'hooks/v3/usePoolTickData'
import useV3DerivedInfo from 'hooks/v3/useV3DerivedInfo'
import React, { useMemo, useState } from 'react'
import { CakeApr } from 'state/farmsV4/atom'
import { usePoolApr } from 'state/farmsV4/hooks'
import { PoolInfo } from 'state/farmsV4/state/type'
import { getMerklLink } from 'utils/getMerklLink'
import { useV3FormState } from 'views/AddLiquidityV3/formViews/V3FormView/form/reducer'
import { useLmPoolLiquidity } from 'views/Farms/hooks/useLmPoolLiquidity'
import { useMasterChefV2Data } from 'views/Farms/hooks/useMasterChefV2Data'
import { useV2LpTokenTotalSupply } from 'views/Farms/hooks/useV2LpTokenTotalSupply'
import { useAccount } from 'wagmi'

const displayApr = (apr: number, maximumFractionDigits = 2) =>
  (apr * 100).toLocaleString('en-US', { maximumFractionDigits })

const AprTooltip: React.FC<{
  pool: PoolInfo
  hasBoost: boolean
  combinedBoostedApr: number
  combinedBaseApr: number
  multiplier?: number
  lpAprValue: number
}> = ({ hasBoost, pool, combinedBaseApr, combinedBoostedApr, multiplier = 1, lpAprValue }) => {
  const { t } = useTranslation()
  const key = useMemo(() => `${pool.chainId}:${pool.lpAddress}` as const, [pool.chainId, pool.lpAddress])
  const { lpApr, cakeApr, merklApr } = usePoolApr(key, pool)
  const merklLink = useMemo(() => {
    return getMerklLink({ chainId: pool.chainId, lpAddress: pool.lpAddress })
  }, [pool.chainId, pool.lpAddress])
  const apr = useMemo(
    () => displayApr(hasBoost ? combinedBoostedApr : combinedBaseApr),
    [combinedBaseApr, combinedBoostedApr, hasBoost],
  )

  return (
    <>
      <Text>
        {t('Combined APR')}: <b>{apr}%</b>
      </Text>
      <ul>
        {cakeApr ? (
          <li>
            {t('Farm APR')}:{' '}
            <b>
              {hasBoost && <>{displayApr(Number(cakeApr?.boost ?? 0))}% </>}
              <Text
                display="inline-block"
                style={{ textDecoration: hasBoost ? 'line-through' : 'none', fontWeight: 800 }}
              >
                {displayApr(Number(cakeApr?.value ?? 0) * (hasBoost ? 1 : multiplier))}%
              </Text>
            </b>
          </li>
        ) : null}
        <li>
          {t('LP Fee APR')}: <b>{displayApr(Number(lpAprValue ?? lpApr ?? 0))}%</b>
        </li>
        {merklApr ? (
          <li>
            {t('merkl APR')}: <b>{displayApr(Number(merklApr ?? 0))}%</b>
            <LinkExternal display="inline-block" href={merklLink}>
              {t('Check')}
            </LinkExternal>
          </li>
        ) : null}
      </ul>
      {hasBoost ? (
        <>
          <br />
          <Text>
            {t('Calculated using the total active liquidity staked versus the CAKE reward emissions for the farm.')}
          </Text>
        </>
      ) : null}
      {hasBoost && ['v2', 'stable'].includes(pool.protocol) && (
        <Text mt="15px">
          {t('bCAKE only boosts Farm APR. Actual boost multiplier is subject to farm and pool conditions.')}
        </Text>
      )}
      {hasBoost ? <Text mt="15px">{t('APRs for individual positions may vary depending on the configs.')}</Text> : null}
    </>
  )
}

type PoolApyButtonProps = {
  pool: PoolInfo
  multiplier?: number
  userLpApr?: number
}

export const PoolApyButton: React.FC<PoolApyButtonProps> = ({ pool, multiplier, userLpApr }) => {
  const { t } = useTranslation()
  const key = useMemo(() => `${pool.chainId}:${pool.lpAddress}` as const, [pool.chainId, pool.lpAddress])
  const { lpApr, cakeApr, merklApr } = usePoolApr(key, pool)

  const roiModal = useModalV2()
  const hasBoost = useMemo(
    () => !multiplier && Boolean(parseFloat(cakeApr?.boost ?? '0')),
    [cakeApr?.boost, multiplier],
  )
  const cakAprValue = useMemo(() => {
    if (multiplier) return Number(cakeApr?.value ?? 0) * multiplier
    return Number(cakeApr?.value ?? 0)
  }, [cakeApr?.value, multiplier])
  const merklAprValue = Number(merklApr ?? 0)
  const lpAprValue = Number(typeof userLpApr !== 'undefined' ? userLpApr : lpApr ?? 0)
  const combinedBaseApr = useMemo(() => {
    return cakAprValue + lpAprValue + merklAprValue
  }, [cakAprValue, lpAprValue, merklAprValue])
  const combinedBoostedApr = useMemo(() => {
    return lpAprValue + Number(cakeApr?.boost ?? 0) + merklAprValue
  }, [lpAprValue, cakeApr?.boost, merklAprValue])
  const aprTooltip = useTooltip(
    <AprTooltip
      pool={pool}
      hasBoost={hasBoost}
      lpAprValue={lpAprValue}
      combinedBaseApr={combinedBaseApr}
      combinedBoostedApr={combinedBoostedApr}
      multiplier={multiplier}
    />,
    {
      trigger: 'hover',
    },
  )

  if (!lpApr) {
    return <Skeleton height={24} width={80} style={{ borderRadius: '12px' }} />
  }

  return (
    <>
      <FarmWidget.FarmApyButton
        variant="text-and-button"
        handleClickButton={(e) => {
          e.stopPropagation()
          e.preventDefault()
          roiModal.onOpen()
        }}
      >
        <TooltipText decorationColor="secondary" ref={aprTooltip.targetRef}>
          <Flex ml="4px" mr="5px" style={{ gap: 5 }}>
            {hasBoost && (
              <Text bold color="success" fontSize={16}>
                <>
                  <Text bold color="success" fontSize={16} display="inline-block" mr="3px">
                    🌿
                    {t('Up to')}
                  </Text>
                  {`${displayApr(combinedBoostedApr)}%`}
                </>
              </Text>
            )}
            <Text style={{ textDecoration: hasBoost ? 'line-through' : 'none' }}>{displayApr(combinedBaseApr)}%</Text>
          </Flex>
        </TooltipText>
      </FarmWidget.FarmApyButton>
      {aprTooltip.tooltipVisible && aprTooltip.tooltip}
      {pool.protocol === 'v3' ? <V3ApyRoiModal poolInfo={pool} cakeApr={cakeApr} modal={roiModal} /> : null}
      {['v2', 'stable'].includes(pool.protocol) ? (
        <V2ApyRoiModal poolInfo={pool} cakeApr={cakeApr} modal={roiModal} multiplier={multiplier} />
      ) : null}
    </>
  )
}

const V3ApyRoiModal: React.FC<{
  poolInfo?: PoolInfo
  cakeApr?: CakeApr[keyof CakeApr]
  modal: UseModalV2Props
}> = ({ poolInfo, cakeApr, modal }) => {
  const { t } = useTranslation()
  const existingPosition = undefined
  const [priceTimeWindow, setPriceTimeWindow] = useState(PairDataTimeWindowEnum.DAY)
  const { data: token0PriceUsd } = useCurrencyUsdPrice(poolInfo?.token0, { enabled: Boolean(poolInfo?.token0) })
  const { data: token1PriceUsd } = useCurrencyUsdPrice(poolInfo?.token1, { enabled: Boolean(poolInfo?.token1) })

  const cakePrice = useCakePrice()
  const formState = useV3FormState()
  const lmPoolLiquidity = useLmPoolLiquidity(poolInfo?.lpAddress, poolInfo?.chainId)

  const prices = usePairTokensPrice(poolInfo?.lpAddress, priceTimeWindow, poolInfo?.chainId, modal.isOpen)
  const { ticks: ticksData } = useAllV3Ticks(poolInfo?.token0, poolInfo?.token1, poolInfo?.feeTier, modal.isOpen)
  const { pool, ticks, price, pricesAtTicks, currencyBalances, outOfRange } = useV3DerivedInfo(
    poolInfo?.token0 ?? undefined,
    poolInfo?.token1 ?? undefined,
    poolInfo?.feeTier,
    poolInfo?.token0 ?? undefined,
    existingPosition,
    formState,
  )
  const sqrtRatioX96 = price && encodeSqrtRatioX96(price.numerator, price.denominator)
  // const { [Bound.LOWER]: tickLower, [Bound.UPPER]: tickUpper } = ticks
  const { [Bound.LOWER]: priceLower, [Bound.UPPER]: priceUpper } = pricesAtTicks
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

  const cakeAprFactor = useMemo(() => {
    if (!cakeApr?.poolWeight || !cakeApr?.cakePerYear) return new BigNumber(0)

    return new BigNumber(cakeApr.poolWeight)
      .times(cakeApr?.cakePerYear)
      .times(cakePrice)
      .div(new BigNumber(Number(lmPoolLiquidity) ?? 0).plus(existingPosition ?? 0))
      .times(100)
  }, [cakeApr?.cakePerYear, cakeApr?.poolWeight, cakePrice, existingPosition, lmPoolLiquidity])

  return (
    <RoiCalculatorModalV2
      {...modal}
      isFarm={cakeApr?.value && Number(cakeApr?.value) > 0}
      maxLabel={existingPosition ? t('My Position') : undefined}
      closeOnOverlayClick={false}
      depositAmountInUsd={depositUsdAsBN?.toString()}
      max={depositUsdAsBN?.toString()}
      balanceA={currencyBalances?.CURRENCY_A}
      balanceB={currencyBalances?.CURRENCY_B}
      price={price}
      currencyA={poolInfo?.token0}
      currencyB={poolInfo?.token1}
      currencyAUsdPrice={token0PriceUsd ?? 0}
      currencyBUsdPrice={token1PriceUsd ?? 0}
      sqrtRatioX96={sqrtRatioX96}
      liquidity={pool?.liquidity}
      feeAmount={pool?.fee}
      ticks={ticksData}
      volume24H={Number(poolInfo?.vol24hUsd ?? 0)}
      priceUpper={priceUpper}
      priceLower={priceLower}
      cakePrice={cakePrice.toFixed(3)}
      cakeAprFactor={cakeAprFactor}
      prices={prices}
      priceSpan={priceTimeWindow}
      onPriceSpanChange={setPriceTimeWindow}
      // additionalApr={additionAprInfo?.aprValue}
    />
  )
}

const displayCakePerSecond = (cakePerSecond: number | BigNumber) => {
  const bn = new BigNumber(cakePerSecond)
  if (bn.isZero()) {
    return '0'
  }
  if (bn.lt(0.000001)) {
    return '<0.000001'
  }
  return `~${cakePerSecond.toFixed(6)}`
}

const V2ApyRoiModal: React.FC<{
  poolInfo?: PoolInfo
  cakeApr?: CakeApr[keyof CakeApr]
  addLiquidityUrl?: string
  modal: UseModalV2Props
  multiplier?: number
}> = ({ poolInfo, cakeApr, addLiquidityUrl, modal, multiplier = 1 }) => {
  const { address: account } = useAccount()
  const { t } = useTranslation()
  const lpSymbol = useMemo(
    () => (poolInfo ? `${poolInfo?.token0.symbol}-${poolInfo?.token1.symbol} LP` : ''),
    [poolInfo],
  )
  const lpLabel = useMemo(() => {
    return lpSymbol.replace(/pancake/gi, '')
  }, [lpSymbol])
  // @todo @ChefJerry
  const userBalanceInFarm = new BigNumber(0)
  const { data: lpTokenTotalSupply } = useV2LpTokenTotalSupply(poolInfo?.lpAddress, poolInfo?.chainId)
  // @todo @ChefJerry check if stableSwap can use same logic file:getFarmLpTokenPrice
  const lpTokenPrice = useMemo(() => {
    return new BigNumber(poolInfo?.tvlUsd ?? 0).div(Number(lpTokenTotalSupply))
  }, [lpTokenTotalSupply, poolInfo?.tvlUsd])
  const cakePrice = useCakePrice()
  const farmCakePerSecond = useMemo(() => {
    return displayCakePerSecond(cakeApr?.cakePerYear ? cakeApr.cakePerYear.div(365 / 24 / 60 / 60) : BIG_ZERO)
  }, [cakeApr?.cakePerYear])
  const { data: masterChefV2Data } = useMasterChefV2Data(poolInfo?.chainId)
  const totalMultipliers = useMemo(() => {
    return masterChefV2Data?.totalRegularAllocPoint
      ? (Number(masterChefV2Data.totalRegularAllocPoint) / 100).toString()
      : '0'
  }, [masterChefV2Data?.totalRegularAllocPoint])

  return (
    <ModalV2 {...modal}>
      <RoiCalculatorModal
        account={account}
        pid={poolInfo?.pid}
        linkLabel={t('Add %symbol%', { symbol: lpLabel })}
        stakingTokenBalance={userBalanceInFarm}
        stakingTokenSymbol={lpSymbol}
        stakingTokenDecimals={18}
        stakingTokenPrice={lpTokenPrice.toNumber()}
        earningTokenPrice={cakePrice.toNumber()}
        apr={Number(cakeApr?.value ?? 0) * multiplier + Number(poolInfo?.lpApr ?? 0)}
        multiplier="1"
        displayApr={displayApr(Number(cakeApr?.value ?? 0) * multiplier + Number(poolInfo?.lpApr ?? 0))}
        linkHref={addLiquidityUrl}
        lpRewardsApr={Number(poolInfo?.lpApr ?? 0)}
        isFarm={cakeApr?.value && Number(cakeApr?.value) > 0}
        // @todo @ChefJerry stableSwap
        stableSwapAddress={undefined}
        // @todo @ChefJerry stableSwap
        stableLpFee={undefined}
        farmCakePerSecond={farmCakePerSecond}
        totalMultipliers={totalMultipliers}
      />
    </ModalV2>
  )
}
