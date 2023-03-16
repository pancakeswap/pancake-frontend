import { Currency } from '@pancakeswap/sdk'
import { useRoi, RoiCalculatorModalV2, TooltipText, Flex, CalculateIcon, Text, IconButton } from '@pancakeswap/uikit'
import { encodeSqrtRatioX96, Pool } from '@pancakeswap/v3-sdk'
import { useMemo, useState } from 'react'
import styled from 'styled-components'
import { useTranslation } from '@pancakeswap/localization'

import { LiquidityFormState } from 'hooks/v3/types'
import useV3DerivedInfo from 'hooks/v3/useV3DerivedInfo'
import useLocalSelector from 'contexts/LocalRedux/useSelector'
import { useDerivedPositionInfo } from 'hooks/v3/useDerivedPositionInfo'
import { Bound } from 'config/constants/types'
import { useAllV3Ticks } from 'hooks/v3/usePoolTickData'
import { Field } from 'state/mint/actions'
import { usePoolAvgTradingVolume } from 'hooks/usePoolTradingVolume'
import { useStablecoinPrice } from 'hooks/useBUSDPrice'

interface Props {
  baseCurrency: Currency
  quoteCurrency: Currency
  feeAmount: number
}

const AprButtonContainer = styled(Flex)`
  cursor: pointer;
`

export function AprCalculator({ baseCurrency, quoteCurrency, feeAmount }: Props) {
  const { t } = useTranslation()
  const [isOpen, setOpen] = useState(false)

  const formState = useLocalSelector<LiquidityFormState>((s) => s) as LiquidityFormState
  const { position: existingPosition } = useDerivedPositionInfo(undefined)
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

  return (
    <>
      <Flex flexDirection="column">
        <Text color="textSubtle" fontSize="12px">
          {t('APR')}
        </Text>
        <AprButtonContainer onClick={() => setOpen(true)} alignItems="center">
          <TooltipText>{apr.toSignificant(2)}%</TooltipText>
          <IconButton variant="text" scale="sm" onClick={() => setOpen(true)}>
            <CalculateIcon color="textSubtle" ml="0.25em" width="24px" />
          </IconButton>
        </AprButtonContainer>
      </Flex>
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
