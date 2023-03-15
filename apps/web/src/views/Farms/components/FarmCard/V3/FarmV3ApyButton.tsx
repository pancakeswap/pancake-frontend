/* eslint-disable react/jsx-pascal-case */
import { useTranslation } from '@pancakeswap/localization'
import {
  CalculateIcon,
  Farm as FarmUI,
  IconButton,
  RoiCalculatorModalV2,
  Skeleton,
  useModalV2,
  useRoi,
} from '@pancakeswap/uikit'
import { encodeSqrtRatioX96, Position, Tick } from '@pancakeswap/v3-sdk'
import { Bound } from 'config/constants/types'
import useLocalSelector from 'contexts/LocalRedux/useSelector'
import { LiquidityFormState } from 'hooks/v3/types'
import { useAllV3Ticks } from 'hooks/v3/usePoolTickData'
import useV3DerivedInfo from 'hooks/v3/useV3DerivedInfo'
import { useMemo } from 'react'
import { Field } from 'state/mint/actions'
import LiquidityFormProvider from 'views/AddLiquidityV3/formViews/V3FormView/form/LiquidityFormProvider'
import { V3Farm } from 'views/Farms/FarmsV3'
import { getDisplayApr } from '../../getDisplayApr'

type FarmV3ApyButtonProps = {
  farm: V3Farm
  existingPosition?: Position
  variant: 'text-and-button' | 'icon'
}

export function FarmV3ApyButton({ farm, existingPosition, variant }: FarmV3ApyButtonProps) {
  return (
    <LiquidityFormProvider>
      <FarmV3ApyButton_ farm={farm} existingPosition={existingPosition} variant={variant} />
    </LiquidityFormProvider>
  )
}

function FarmV3ApyButton_({ farm, existingPosition, variant }: FarmV3ApyButtonProps) {
  const roiModal = useModalV2()
  const { t } = useTranslation()
  const { token: baseCurrency, quoteToken: quoteCurrency, feeAmount } = farm

  const { ticks: data } = useAllV3Ticks(baseCurrency, quoteCurrency, feeAmount)

  const formState = useLocalSelector<LiquidityFormState>((s) => s) as LiquidityFormState

  const poolTicks = useMemo(
    () =>
      data?.map(
        ({ tick, liquidityNet }) =>
          new Tick({ index: parseInt(String(tick)), liquidityNet, liquidityGross: liquidityNet }),
      ),
    [data],
  )

  const { pool, ticks, price, pricesAtTicks, parsedAmounts, currencyBalances } = useV3DerivedInfo(
    baseCurrency ?? undefined,
    quoteCurrency ?? undefined,
    feeAmount,
    baseCurrency ?? undefined,
    existingPosition,
    formState,
  )

  const sqrtRatioX96 = price && encodeSqrtRatioX96(price.numerator, price.denominator)
  const { [Bound.LOWER]: tickLower, [Bound.UPPER]: tickUpper } = ticks
  const { [Bound.LOWER]: priceLower, [Bound.UPPER]: priceUpper } = pricesAtTicks

  const { [Field.CURRENCY_A]: amountA, [Field.CURRENCY_B]: amountB } = parsedAmounts

  // TODO: v3 farm get data from subgraph
  const currencyAUsdPrice = +farm.tokenPriceBusd
  const currencyBUsdPrice = +farm.quoteTokenPriceBusd
  const volume24H = 10

  const depositUsd = useMemo(
    () =>
      amountA &&
      amountB &&
      currencyAUsdPrice &&
      currencyBUsdPrice &&
      String(parseFloat(amountA.toExact()) * currencyAUsdPrice + parseFloat(amountB.toExact()) * currencyBUsdPrice),
    [amountA, amountB, currencyAUsdPrice, currencyBUsdPrice],
  )

  const { apr } = useRoi({
    tickLower,
    tickUpper,
    sqrtRatioX96,
    fee: feeAmount,
    ticks: poolTicks,
    amountA,
    amountB,
    compoundOn: false,
    currencyAUsdPrice,
    currencyBUsdPrice,
    volume24H,
  })

  const balanceA = existingPosition?.amount0 ?? currencyBalances[Field.CURRENCY_A]
  const balanceB = existingPosition?.amount1 ?? currencyBalances[Field.CURRENCY_B]

  const displayApr = getDisplayApr(+farm.cakeApr, +apr.toSignificant(2))

  if (!displayApr) {
    return <Skeleton height={24} width={variant === 'icon' ? 24 : 80} />
  }

  return (
    <>
      {variant === 'icon' ? (
        <IconButton variant="text" style={{ height: 18, width: 18 }} scale="sm" onClick={roiModal.onOpen}>
          <CalculateIcon width="18px" color="textSubtle" />
        </IconButton>
      ) : (
        <FarmUI.FarmApyButton
          variant="text-and-button"
          handleClickButton={(e) => {
            e.stopPropagation()
            e.preventDefault()
            roiModal.onOpen()
          }}
        >
          {displayApr}%
        </FarmUI.FarmApyButton>
      )}
      <RoiCalculatorModalV2
        {...roiModal}
        maxLabel={existingPosition ? t('My Position') : undefined}
        closeOnOverlayClick
        depositAmountInUsd={depositUsd}
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
      />
    </>
  )
}
