/* eslint-disable react/jsx-pascal-case */
import { useTranslation } from '@pancakeswap/localization'
import {
  AutoRow,
  CalculateIcon,
  Farm as FarmUI,
  IconButton,
  RoiCalculatorModalV2,
  Skeleton,
  Text,
  useModalV2,
  useRoi,
  Flex,
  useTooltip,
  TooltipText,
  RocketIcon,
  useMatchBreakpoints,
} from '@pancakeswap/uikit'
import { BIG_ZERO } from '@pancakeswap/utils/bigNumber'
import { useCakePriceAsBN } from '@pancakeswap/utils/useCakePrice'
import { encodeSqrtRatioX96, Position } from '@pancakeswap/v3-sdk'
import BigNumber from 'bignumber.js'
import { useMemo, useState } from 'react'
import styled from 'styled-components'

import { Bound } from 'config/constants/types'
import { usePoolAvgInfo } from 'hooks/usePoolAvgInfo'
import { useAllV3Ticks } from 'hooks/v3/usePoolTickData'
import useV3DerivedInfo from 'hooks/v3/useV3DerivedInfo'
import { usePairTokensPrice } from 'hooks/v3/usePairTokensPrice'
import { useFarmsV3Public } from 'state/farmsV3/hooks'
import { Field } from 'state/mint/actions'
import LiquidityFormProvider from 'views/AddLiquidityV3/formViews/V3FormView/form/LiquidityFormProvider'
import { useV3FormState } from 'views/AddLiquidityV3/formViews/V3FormView/form/reducer'
import { V3Farm } from 'views/Farms/FarmsV3'
import { getDisplayApr } from '../../getDisplayApr'
import { USER_ESTIMATED_MULTIPLIER, useUserBoostedMultiplier } from '../../YieldBooster/hooks/bCakeV3/useBCakeV3Info'
import { BoostStatus, useBoostStatus } from '../../YieldBooster/hooks/bCakeV3/useBoostStatus'

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
  const prices = usePairTokensPrice(lpAddress, priceTimeWindow, baseCurrency?.chainId)

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

  const cakePrice = useCakePriceAsBN()

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
          : new BigNumber(existingPosition.liquidity.toString()).times(cakeAprFactor).div(depositUsdAsBN).toNumber()
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
  const cakeApr = +farm.cakeApr
  const positionDisplayApr = getDisplayApr(+positionCakeApr, lpApr)
  const displayApr = getDisplayApr(cakeApr, lpApr)
  const cakeAprDisplay = cakeApr.toFixed(2)
  const positionCakeAprDisplay = positionCakeApr.toFixed(2)
  const lpAprDisplay = lpApr.toFixed(2)
  const { isDesktop } = useMatchBreakpoints()
  const userMultiplier = useUserBoostedMultiplier(tokenId)
  const estimatedAPR = useMemo(() => {
    return (parseFloat(cakeAprDisplay) * USER_ESTIMATED_MULTIPLIER + parseFloat(lpAprDisplay)).toLocaleString(
      undefined,
      { maximumSignificantDigits: 3 },
    )
  }, [cakeAprDisplay, lpAprDisplay])
  const boostedAPR = useMemo(() => {
    return (parseFloat(positionCakeAprDisplay) * userMultiplier + parseFloat(lpAprDisplay)).toLocaleString(undefined, {
      maximumSignificantDigits: 3,
    })
  }, [positionCakeAprDisplay, lpAprDisplay, userMultiplier])
  const canBoosted = useMemo(() => boostedStatus !== BoostStatus.CanNotBoost, [boostedStatus])
  const isBoosted = useMemo(() => boostedStatus === BoostStatus.Boosted, [boostedStatus])

  const aprTooltip = useTooltip(
    <>
      <Text>
        {t('Combined APR')}: <b>{displayApr}%</b>
      </Text>
      <ul>
        <li>
          {t('Farm APR')}: <b>{cakeAprDisplay}%</b>
        </li>
        <li>
          {t('LP Fee APR')}: <b>{canBoosted ? parseFloat(lpAprDisplay) * USER_ESTIMATED_MULTIPLIER : lpAprDisplay}%</b>
        </li>
      </ul>
      <br />
      <Text>
        {t('Calculated using the total active liquidity staked versus the CAKE reward emissions for the farm.')}
      </Text>
      <Text>{t('APRs for individual positions may vary depending on the configs.')}</Text>
    </>,
  )
  const existingPositionAprTooltip = useTooltip(
    <>
      <Text>
        {t('Combined APR')}: <b>{positionDisplayApr}%</b>
      </Text>
      <ul>
        <li>
          {t('Farm APR')}:
          <b>{isBoosted ? parseFloat(positionCakeAprDisplay) * userMultiplier : positionCakeAprDisplay}%</b>
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
    return <Skeleton height={24} width={80} />
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
                          {boostedAPR}%
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
          <FarmUI.FarmApyButton
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
          </FarmUI.FarmApyButton>
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
          cakeAprFactor={cakeAprFactor}
          prices={prices}
          priceSpan={priceTimeWindow}
          onPriceSpanChange={setPriceTimeWindow}
        />
      )}
    </>
  )
}
