import { Currency } from '@pancakeswap/sdk'
import {
  useRoi,
  RoiCalculatorModalV2,
  RoiCalculatorPositionInfo,
  TooltipText,
  Flex,
  CalculateIcon,
  Text,
  IconButton,
  PairDataTimeWindowEnum,
} from '@pancakeswap/uikit'
import { encodeSqrtRatioX96, Pool } from '@pancakeswap/v3-sdk'
import { useCallback, useMemo, useState } from 'react'
import styled from 'styled-components'
import { useTranslation } from '@pancakeswap/localization'

import useV3DerivedInfo from 'hooks/v3/useV3DerivedInfo'
import { useDerivedPositionInfo } from 'hooks/v3/useDerivedPositionInfo'
import { Bound } from 'config/constants/types'
import { useAllV3Ticks } from 'hooks/v3/usePoolTickData'
import { Field } from 'state/mint/actions'
import { usePoolAvgTradingVolume } from 'hooks/usePoolTradingVolume'
import { useStablecoinPrice } from 'hooks/useBUSDPrice'
import { usePairTokensPrice } from 'hooks/v3/usePairTokensPrice'

import { useV3FormState } from '../formViews/V3FormView/form/reducer'

interface Props {
  baseCurrency: Currency
  quoteCurrency: Currency
  feeAmount: number
  showTitle?: boolean
}

const AprButtonContainer = styled(Flex)`
  cursor: pointer;
`

export function AprCalculator({ baseCurrency, quoteCurrency, feeAmount, showTitle = true }: Props) {
  const { t } = useTranslation()
  const [isOpen, setOpen] = useState(false)
  const [priceSpan, setPriceSpan] = useState(0)

  const formState = useV3FormState()
  const { position: existingPosition } = useDerivedPositionInfo(undefined)
  const priceTimeWindow = useMemo(() => {
    switch (priceSpan) {
      case PairDataTimeWindowEnum.DAY:
        return 'day'
      case PairDataTimeWindowEnum.WEEK:
        return 'week'
      case PairDataTimeWindowEnum.MONTH:
        return 'month'
      case PairDataTimeWindowEnum.YEAR:
        return 'year'
      default:
        return 'week'
    }
  }, [priceSpan])
  const prices = usePairTokensPrice(baseCurrency, quoteCurrency, priceTimeWindow, baseCurrency?.chainId)
  const { ticks: data } = useAllV3Ticks(baseCurrency, quoteCurrency, feeAmount)
  const { pool, ticks, price, pricesAtTicks, parsedAmounts, currencyBalances } = useV3DerivedInfo(
    baseCurrency ?? undefined,
    quoteCurrency ?? undefined,
    feeAmount,
    baseCurrency ?? undefined,
    existingPosition,
    formState,
  )
  const volume24H = usePoolAvgTradingVolume({
    address: pool && Pool.getAddress(pool.token0, pool.token1, pool.fee),
    chainId: pool?.token0.chainId,
  })
  const sqrtRatioX96 = price && encodeSqrtRatioX96(price.numerator, price.denominator)
  const { [Bound.LOWER]: tickLower, [Bound.UPPER]: tickUpper } = ticks
  const { [Bound.LOWER]: priceLower, [Bound.UPPER]: priceUpper } = pricesAtTicks
  const { [Field.CURRENCY_A]: amountA, [Field.CURRENCY_B]: amountB } = parsedAmounts

  const baseUSDPrice = useStablecoinPrice(baseCurrency)
  const quoteUSDPrice = useStablecoinPrice(quoteCurrency)
  const currencyAUsdPrice = parseFloat(baseUSDPrice?.toSignificant(6))
  const currencyBUsdPrice = parseFloat(quoteUSDPrice?.toSignificant(6))

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
    mostActiveLiquidity: pool?.liquidity,
    amountA,
    amountB,
    compoundOn: false,
    currencyAUsdPrice,
    currencyBUsdPrice,
    volume24H,
  })

  const closeModal = useCallback(() => setOpen(false), [])
  const onApply = useCallback(
    (position: RoiCalculatorPositionInfo) => {
      // TODO: v3 apply position to add liquidity page
      // eslint-disable-next-line
      console.log(position)
      closeModal()
    },
    [closeModal],
  )

  return (
    <>
      <Flex flexDirection="column">
        {showTitle && (
          <Text color="textSubtle" fontSize="12px">
            {t('APR')}
          </Text>
        )}
        <AprButtonContainer onClick={() => setOpen(true)} alignItems="center">
          <TooltipText>{apr.toSignificant(2)}%</TooltipText>
          <IconButton variant="text" scale="sm" onClick={() => setOpen(true)}>
            <CalculateIcon color="textSubtle" ml="0.25em" width="24px" />
          </IconButton>
        </AprButtonContainer>
      </Flex>
      <RoiCalculatorModalV2
        allowApply
        isOpen={isOpen}
        onDismiss={closeModal}
        depositAmountInUsd={depositUsd}
        prices={prices}
        price={price}
        currencyA={baseCurrency}
        currencyB={quoteCurrency}
        balanceA={currencyBalances[Field.CURRENCY_A]}
        balanceB={currencyBalances[Field.CURRENCY_B]}
        currencyAUsdPrice={currencyAUsdPrice}
        currencyBUsdPrice={currencyBUsdPrice}
        sqrtRatioX96={sqrtRatioX96}
        liquidity={pool?.liquidity}
        feeAmount={feeAmount}
        ticks={data}
        volume24H={volume24H}
        priceUpper={priceUpper}
        priceLower={priceLower}
        priceSpan={priceSpan}
        onPriceSpanChange={setPriceSpan}
        onApply={onApply}
      />
    </>
  )
}
