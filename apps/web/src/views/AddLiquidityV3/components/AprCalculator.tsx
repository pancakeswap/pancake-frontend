import { Currency } from '@pancakeswap/sdk'
import { useRoi, RoiCalculatorModalV2, TooltipText, Flex } from '@pancakeswap/uikit'
import { encodeSqrtRatioX96, Tick } from '@pancakeswap/v3-sdk'
import { useMemo, useState } from 'react'
import styled from 'styled-components'

import { LiquidityFormState } from 'hooks/v3/types'
import useV3DerivedInfo from 'hooks/v3/useV3DerivedInfo'
import useLocalSelector from 'contexts/LocalRedux/useSelector'
import { useDerivedPositionInfo } from 'hooks/v3/useDerivedPositionInfo'
import { Bound } from 'config/constants/types'
import { usePoolActiveLiquidity } from 'hooks/v3/usePoolTickData'
import { Field } from 'state/mint/actions'

interface Props {
  baseCurrency: Currency
  quoteCurrency: Currency
  feeAmount: number
}

const AprButtonContainer = styled(Flex)`
  cursor: pointer;
`

export function AprCalculator({ baseCurrency, quoteCurrency, feeAmount }: Props) {
  const [isOpen, setOpen] = useState(false)

  const formState = useLocalSelector<LiquidityFormState>((s) => s) as LiquidityFormState
  const { position: existingPosition } = useDerivedPositionInfo(undefined)
  const { data } = usePoolActiveLiquidity(baseCurrency, quoteCurrency, feeAmount)
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

  // TODO get data from subgraph
  const currencyAUsdPrice = 1
  const currencyBUsdPrice = 1
  const volume24H = 10

  const depositUsd = useMemo(
    () =>
      amountA &&
      amountB &&
      currencyAUsdPrice &&
      currencyBUsdPrice &&
      String(parseFloat(amountA.toExact()) * currencyAUsdPrice + parseFloat(amountB.toExact()) * currencyBUsdPrice),
    [amountA, amountB],
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

  return (
    <>
      <AprButtonContainer onClick={() => setOpen(true)}>
        <TooltipText>{apr.toSignificant(2)}%</TooltipText>
      </AprButtonContainer>
      <RoiCalculatorModalV2
        isOpen={isOpen}
        onDismiss={() => setOpen(false)}
        depositAmountInUsd={depositUsd}
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
      />
    </>
  )
}
