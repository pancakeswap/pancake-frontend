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
  QuestionHelper,
} from '@pancakeswap/uikit'
import { encodeSqrtRatioX96, parseProtocolFees, Pool } from '@pancakeswap/v3-sdk'
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
import { batch } from 'react-redux'

import { useV3FormState } from '../formViews/V3FormView/form/reducer'
import { useV3MintActionHandlers } from '../formViews/V3FormView/form/hooks/useV3MintActionHandlers'

interface Props {
  baseCurrency: Currency
  quoteCurrency: Currency
  feeAmount: number
  showTitle?: boolean
  showQuestion?: boolean
}

const AprButtonContainer = styled(Flex)`
  cursor: pointer;
`

export function AprCalculator({
  baseCurrency,
  quoteCurrency,
  feeAmount,
  showTitle = true,
  showQuestion = false,
}: Props) {
  const { t } = useTranslation()
  const [isOpen, setOpen] = useState(false)
  const [priceSpan, setPriceSpan] = useState(0)

  const formState = useV3FormState()
  const { position: existingPosition } = useDerivedPositionInfo(undefined)
  const prices = usePairTokensPrice(baseCurrency, quoteCurrency, priceSpan, baseCurrency?.chainId)
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

  // For now the protocol fee is the same on both tokens so here we just use the fee on token0
  const [protocolFee] = useMemo(
    () => (pool?.feeProtocol && parseProtocolFees(pool.feeProtocol)) || [],
    [pool?.feeProtocol],
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
    protocolFee,
  })

  // NOTE: Assume no liquidity when openning modal
  const { onFieldAInput, onBothRangeInput } = useV3MintActionHandlers(false)

  const closeModal = useCallback(() => setOpen(false), [])
  const onApply = useCallback(
    (position: RoiCalculatorPositionInfo) => {
      batch(() => {
        onBothRangeInput({
          leftTypedValue: position.priceLower.toFixed(),
          rightTypedValue: position.priceUpper.toFixed(),
        })

        onFieldAInput(position.amountA.toExact())
      })
      closeModal()
    },
    [closeModal, onBothRangeInput, onFieldAInput],
  )

  if (!data || !data.length) {
    return null
  }

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
          {showQuestion ? (
            <QuestionHelper
              text={
                <>
                  {t(
                    'Calculated at the current rates with historical trading volume data, and subject to change based on various external variables.',
                  )}
                  <br />
                  <br />
                  {t(
                    'This figure is provided for your convenience only, and by no means represents guaranteed returns.',
                  )}
                </>
              }
              size="20px"
            />
          ) : null}
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
        protocolFee={protocolFee}
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
