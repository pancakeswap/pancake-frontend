/* eslint-disable react/jsx-pascal-case */
import { useTranslation } from '@pancakeswap/localization'
import {
  AutoRow,
  CalculateIcon,
  Flex,
  IconButton,
  RocketIcon,
  Skeleton,
  Text,
  TooltipText,
  useMatchBreakpoints,
  useModalV2,
  useTooltip,
} from '@pancakeswap/uikit'
import { BIG_ZERO } from '@pancakeswap/utils/bigNumber'
import { Position, encodeSqrtRatioX96 } from '@pancakeswap/v3-sdk'
import { FarmWidget } from '@pancakeswap/widgets-internal'
import { RoiCalculatorModalV2, useRoi } from '@pancakeswap/widgets-internal/roi'
import BigNumber from 'bignumber.js'
import { useCakePrice } from 'hooks/useCakePrice'
import { useMemo, useState } from 'react'
import { styled } from 'styled-components'

import { Bound } from 'config/constants/types'
import { usePoolAvgInfo } from 'hooks/usePoolAvgInfo'
import { usePairTokensPrice } from 'hooks/v3/usePairTokensPrice'
import { useAllV3Ticks } from 'hooks/v3/usePoolTickData'
import useV3DerivedInfo from 'hooks/v3/useV3DerivedInfo'
import { useFarmsV3Public } from 'state/farmsV3/hooks'
import { Field } from 'state/mint/actions'
import LiquidityFormProvider from 'views/AddLiquidityV3/formViews/V3FormView/form/LiquidityFormProvider'
import { useV3FormState } from 'views/AddLiquidityV3/formViews/V3FormView/form/reducer'
import { V3Farm } from 'views/Farms/FarmsV3'
import { USER_ESTIMATED_MULTIPLIER, useUserPositionInfo } from '../../YieldBooster/hooks/bCakeV3/useBCakeV3Info'
import { BoostStatus, useBoostStatus } from '../../YieldBooster/hooks/bCakeV3/useBoostStatus'
import { getDisplayApr } from '../../getDisplayApr'

const ApyLabelContainer = styled(Flex)`
  cursor: pointer;
  &:hover {
    opacity: 0.5;
  }
`

type FarmV3ApyButtonProps = {
  farm: V3Farm
  existingPosition?: Position
  isPositionStaked?: boolean
  tokenId?: string
}

export function FarmV3ApyButton(props: FarmV3ApyButtonProps) {
  return (
    <LiquidityFormProvider>
      <FarmV3ApyButton_ {...props} />
    </LiquidityFormProvider>
  )
}

function FarmV3ApyButton_({ farm, existingPosition, isPositionStaked, tokenId }: FarmV3ApyButtonProps) {
  const { token: baseCurrency, quoteToken: quoteCurrency, feeAmount, lpAddress } = farm
  const { t } = useTranslation()
  const roiModal = useModalV2()

  const [priceTimeWindow, setPriceTimeWindow] = useState(0)
  const prices = usePairTokensPrice(lpAddress, priceTimeWindow, baseCurrency?.chainId, roiModal.isOpen)

  const { ticks: data } = useAllV3Ticks(baseCurrency, quoteCurrency, feeAmount)

  const formState = useV3FormState()

  const { pool, ticks, price, pricesAtTicks, currencyBalances, outOfRange } = useV3DerivedInfo(
    baseCurrency ?? undefined,
    quoteCurrency ?? undefined,
    feeAmount,
    baseCurrency ?? undefined,
    existingPosition,
    formState,
  )

  const cakePrice = useCakePrice()

  const sqrtRatioX96 = price && encodeSqrtRatioX96(price.numerator, price.denominator)
  const { [Bound.LOWER]: tickLower, [Bound.UPPER]: tickUpper } = ticks
  const { [Bound.LOWER]: priceLower, [Bound.UPPER]: priceUpper } = pricesAtTicks

  const currencyAUsdPrice = +farm.tokenPriceBusd
  const currencyBUsdPrice = +farm.quoteTokenPriceBusd

  const isSorted = farm.token.sortsBefore(farm.quoteToken)

  const { status: boostedStatus } = useBoostStatus(farm.pid, tokenId)

  const {
    volumeUSD: volume24H,
    feeUSD,
    tvlUSD,
  } = usePoolAvgInfo({
    address: farm.lpAddress,
    chainId: farm.token.chainId,
  })

  const balanceA =
    (isSorted ? existingPosition?.amount0 : existingPosition?.amount1) ?? currencyBalances[Field.CURRENCY_A]
  const balanceB =
    (isSorted ? existingPosition?.amount1 : existingPosition?.amount0) ?? currencyBalances[Field.CURRENCY_B]

  const globalLpApr = useMemo(() => (tvlUSD ? (100 * feeUSD * 365) / tvlUSD : 0), [feeUSD, tvlUSD])

  const depositUsdAsBN = useMemo(
    () =>
      balanceA &&
      balanceB &&
      currencyAUsdPrice &&
      currencyBUsdPrice &&
      new BigNumber(balanceA.toExact())
        .times(currencyAUsdPrice)
        .plus(new BigNumber(balanceB.toExact()).times(currencyBUsdPrice)),
    [balanceA, balanceB, currencyAUsdPrice, currencyBUsdPrice],
  )

  const { data: farmV3 } = useFarmsV3Public()

  const cakeAprFactor = useMemo(
    () =>
      new BigNumber(farm.poolWeight)
        .times(farmV3.cakePerSecond)
        .times(365 * 60 * 60 * 24)
        .times(cakePrice)
        .div(
          new BigNumber(farm.lmPoolLiquidity).plus(
            isPositionStaked ? BIG_ZERO : existingPosition?.liquidity?.toString() ?? BIG_ZERO,
          ),
        )
        .times(100),
    [
      cakePrice,
      existingPosition?.liquidity,
      farm.lmPoolLiquidity,
      farm.poolWeight,
      farmV3.cakePerSecond,
      isPositionStaked,
    ],
  )

  const positionCakeApr = useMemo(
    () =>
      existingPosition
        ? outOfRange
          ? 0
          : new BigNumber(existingPosition.liquidity.toString())
              .times(cakeAprFactor)
              .div(depositUsdAsBN ?? 0)
              .toNumber()
        : 0,
    [cakeAprFactor, depositUsdAsBN, existingPosition, outOfRange],
  )

  const { apr } = useRoi({
    tickLower,
    tickUpper,
    sqrtRatioX96,
    fee: feeAmount,
    mostActiveLiquidity: pool?.liquidity,
    amountA: existingPosition?.amount0,
    amountB: existingPosition?.amount1,
    compoundOn: false,
    currencyAUsdPrice: isSorted ? currencyAUsdPrice : currencyBUsdPrice,
    currencyBUsdPrice: isSorted ? currencyBUsdPrice : currencyAUsdPrice,
    volume24H,
  })

  const lpApr = existingPosition ? +apr.toFixed(2) : globalLpApr
  const cakeApr = +(farm.cakeApr ?? 0)

  const displayApr = getDisplayApr(cakeApr, lpApr)
  const cakeAprDisplay = cakeApr.toFixed(2)
  const positionCakeAprDisplay = positionCakeApr.toFixed(2)
  const lpAprDisplay = lpApr.toFixed(2)
  const { isDesktop } = useMatchBreakpoints()
  const {
    data: { boostMultiplier },
  } = useUserPositionInfo(tokenId ?? '-1')

  const estimatedAPR = useMemo(() => {
    return (parseFloat(cakeAprDisplay) * USER_ESTIMATED_MULTIPLIER + parseFloat(lpAprDisplay)).toLocaleString('en-US', {
      maximumFractionDigits: 2,
    })
  }, [cakeAprDisplay, lpAprDisplay])
  const canBoosted = useMemo(() => boostedStatus !== BoostStatus.CanNotBoost, [boostedStatus])
  const isBoosted = useMemo(() => boostedStatus === BoostStatus.Boosted, [boostedStatus])
  const positionDisplayApr = getDisplayApr(+positionCakeApr, lpApr)
  const positionBoostedDisplayApr = getDisplayApr(boostMultiplier * positionCakeApr, lpApr)

  const aprTooltip = useTooltip(
    <>
      <Text>
        {t('Combined APR')}: <b>{canBoosted ? estimatedAPR : displayApr}%</b>
      </Text>
      <ul>
        <li>
          {t('Farm APR')}:{' '}
          <b>
            {canBoosted && <>{parseFloat(cakeAprDisplay) * USER_ESTIMATED_MULTIPLIER}% </>}
            <Text
              display="inline-block"
              style={{ textDecoration: canBoosted ? 'line-through' : 'none', fontWeight: 800 }}
            >
              {cakeAprDisplay}%
            </Text>
          </b>
        </li>
        <li>
          {t('LP Fee APR')}: <b>{lpAprDisplay}%</b>
        </li>
      </ul>
      <br />
      <Text>
        {t('Calculated using the total active liquidity staked versus the CAKE reward emissions for the farm.')}
      </Text>
      {canBoosted && (
        <Text mt="15px">
          {t('bCAKE only boosts Farm APR. Actual boost multiplier is subject to farm and pool conditions.')}
        </Text>
      )}
      <Text mt="15px">{t('APRs for individual positions may vary depending on the configs.')}</Text>
    </>,
  )
  const existingPositionAprTooltip = useTooltip(
    <>
      <Text>
        {t('Combined APR')}: <b>{isBoosted ? positionBoostedDisplayApr : positionDisplayApr}%</b>
      </Text>
      <ul>
        <li>
          {t('Farm APR')}:{' '}
          <b>
            {isBoosted && <>{(positionCakeApr * boostMultiplier).toFixed(2)}% </>}
            <Text
              display="inline-block"
              bold={!isBoosted}
              style={{ textDecoration: isBoosted ? 'line-through' : 'none' }}
            >
              {positionCakeAprDisplay}%
            </Text>
          </b>
        </li>
        <li>
          {t('LP Fee APR')}: <b>{lpAprDisplay}%</b>
        </li>
      </ul>
    </>,
  )

  if (farm.multiplier === '0X') {
    return <Text fontSize="14px">0%</Text>
  }

  if (!displayApr) {
    return <Skeleton height={24} width={80} style={{ borderRadius: '12px' }} />
  }

  return (
    <>
      {existingPosition ? (
        <AutoRow width="auto" gap="2px">
          <ApyLabelContainer alignItems="center" style={{ textDecoration: 'initial' }} onClick={roiModal.onOpen}>
            {outOfRange ? (
              <TooltipText decorationColor="failure" color="failure" fontSize="14px">
                {positionCakeApr.toLocaleString('en-US', { maximumFractionDigits: 2 })}%
              </TooltipText>
            ) : (
              <>
                <TooltipText ref={existingPositionAprTooltip.targetRef} decorationColor="secondary">
                  <Flex style={{ gap: 3 }}>
                    {isBoosted && (
                      <>
                        {isDesktop && <RocketIcon color="success" />}
                        <Text fontSize="14px" color="success">
                          {positionBoostedDisplayApr}%
                        </Text>
                      </>
                    )}
                    <Text fontSize="14px" style={{ textDecoration: isBoosted ? 'line-through' : 'none' }}>
                      {positionDisplayApr}%
                    </Text>
                  </Flex>
                </TooltipText>
                {existingPositionAprTooltip.tooltipVisible && existingPositionAprTooltip.tooltip}
              </>
            )}
            <IconButton variant="text" style={{ height: 18, width: 18 }} scale="sm">
              <CalculateIcon width="18px" color="textSubtle" />
            </IconButton>
          </ApyLabelContainer>
        </AutoRow>
      ) : (
        <>
          <FarmWidget.FarmApyButton
            variant="text-and-button"
            handleClickButton={(e) => {
              e.stopPropagation()
              e.preventDefault()
              roiModal.onOpen()
            }}
          >
            <TooltipText ref={aprTooltip.targetRef} decorationColor="secondary">
              <Flex ml="4px" mr="5px" style={{ gap: 5 }}>
                {canBoosted && (
                  <>
                    {isDesktop && <RocketIcon color="success" />}
                    <Text bold color="success" fontSize={16}>
                      <>
                        <Text bold color="success" fontSize={14} display="inline-block" mr="3px">
                          {t('Up to')}
                        </Text>
                        {`${estimatedAPR}%`}
                      </>
                    </Text>
                  </>
                )}
                <Text style={{ textDecoration: canBoosted ? 'line-through' : 'none' }}>{displayApr}%</Text>
              </Flex>
            </TooltipText>
          </FarmWidget.FarmApyButton>
          {aprTooltip.tooltipVisible && aprTooltip.tooltip}
        </>
      )}
      {cakePrice && cakeAprFactor && (
        <RoiCalculatorModalV2
          {...roiModal}
          isFarm
          maxLabel={existingPosition ? t('My Position') : undefined}
          closeOnOverlayClick={false}
          depositAmountInUsd={depositUsdAsBN?.toString()}
          max={depositUsdAsBN?.toString()}
          balanceA={balanceA}
          balanceB={balanceB}
          price={price}
          currencyA={baseCurrency}
          currencyB={quoteCurrency}
          currencyAUsdPrice={currencyAUsdPrice}
          currencyBUsdPrice={currencyBUsdPrice}
          sqrtRatioX96={sqrtRatioX96}
          liquidity={pool?.liquidity}
          feeAmount={feeAmount}
          ticks={data}
          volume24H={volume24H}
          priceUpper={priceUpper}
          priceLower={priceLower}
          cakePrice={cakePrice.toFixed(3)}
          cakeAprFactor={cakeAprFactor.times(isBoosted ? boostMultiplier : 1)}
          prices={prices}
          priceSpan={priceTimeWindow}
          onPriceSpanChange={setPriceTimeWindow}
        />
      )}
    </>
  )
}
