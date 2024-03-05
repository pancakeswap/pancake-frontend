import { useTranslation } from '@pancakeswap/localization'
import { Currency, CurrencyAmount, Price, Token, ZERO } from '@pancakeswap/sdk'
import { CalculateIcon, Flex, IconButton, QuestionHelper, RocketIcon, Text, TooltipText } from '@pancakeswap/uikit'
import { BIG_ZERO } from '@pancakeswap/utils/bigNumber'
import { formatPrice } from '@pancakeswap/utils/formatFractions'
import { FeeCalculator, Pool, encodeSqrtRatioX96, isPoolTickInRange, parseProtocolFees } from '@pancakeswap/v3-sdk'
import {
  RoiCalculatorModalV2,
  RoiCalculatorPositionInfo,
  useAmountsByUsdValue,
  useRoi,
} from '@pancakeswap/widgets-internal/roi'
import { useCakePrice } from 'hooks/useCakePrice'
import { useRouter } from 'next/router'
import { useCallback, useMemo, useState } from 'react'
import { styled } from 'styled-components'

import { PositionDetails, getPositionFarmApr, getPositionFarmAprFactor } from '@pancakeswap/farms'
import { Bound } from 'config/constants/types'
import { useFarm } from 'hooks/useFarm'
import { usePoolAvgTradingVolume } from 'hooks/usePoolTradingVolume'
import { useStablecoinPrice } from 'hooks/useStablecoinPrice'
import { useDerivedPositionInfo } from 'hooks/v3/useDerivedPositionInfo'
import { usePairTokensPrice } from 'hooks/v3/usePairTokensPrice'
import { useAllV3Ticks } from 'hooks/v3/usePoolTickData'
import useV3DerivedInfo from 'hooks/v3/useV3DerivedInfo'
import { batch } from 'react-redux'
import { Field } from 'state/mint/actions'
import currencyId from 'utils/currencyId'

import { useUserPositionInfo } from 'views/Farms/components/YieldBooster/hooks/bCakeV3/useBCakeV3Info'
import { BoostStatus, useBoostStatus } from 'views/Farms/components/YieldBooster/hooks/bCakeV3/useBoostStatus'
import { useV3MintActionHandlers } from '../formViews/V3FormView/form/hooks/useV3MintActionHandlers'
import { useV3FormState } from '../formViews/V3FormView/form/reducer'

interface Props {
  baseCurrency?: Currency | null
  quoteCurrency?: Currency | null
  feeAmount?: number
  showTitle?: boolean
  showQuestion?: boolean
  allowApply?: boolean
  positionDetails?: PositionDetails
  defaultDepositUsd?: string
  tokenAmount0?: CurrencyAmount<Token>
  tokenAmount1?: CurrencyAmount<Token>
}

const AprButtonContainer = styled(Flex)`
  cursor: pointer;
`

const deriveUSDPrice = (baseUSDPrice?: Price<Currency, Currency>, pairPrice?: Price<Currency, Currency>) => {
  if (baseUSDPrice && pairPrice && pairPrice.greaterThan(ZERO)) {
    const baseUSDPriceFloat = parseFloat(formatPrice(baseUSDPrice, 6) || '0')
    return baseUSDPriceFloat / parseFloat(formatPrice(pairPrice, 6) || '0')
  }
  return undefined
}

export function AprCalculator({
  baseCurrency,
  quoteCurrency,
  feeAmount,
  showTitle = true,
  showQuestion = false,
  allowApply = true,
  positionDetails,
  defaultDepositUsd,
  tokenAmount0,
  tokenAmount1,
}: Props) {
  const { t } = useTranslation()
  const [isOpen, setOpen] = useState(false)
  const [priceSpan, setPriceSpan] = useState(0)
  const { data: farm } = useFarm({ currencyA: baseCurrency, currencyB: quoteCurrency, feeAmount })
  const cakePrice = useCakePrice()

  const formState = useV3FormState()

  const { position: existingPosition } = useDerivedPositionInfo(positionDetails)
  const { pool, ticks, price, pricesAtTicks, parsedAmounts, currencyBalances } = useV3DerivedInfo(
    baseCurrency ?? undefined,
    quoteCurrency ?? undefined,
    feeAmount,
    baseCurrency ?? undefined,
    existingPosition,
    formState,
  )
  const router = useRouter()
  const poolAddress = useMemo(() => (pool ? Pool.getAddress(pool.token0, pool.token1, pool.fee) : undefined), [pool])

  const prices = usePairTokensPrice(poolAddress, priceSpan, baseCurrency?.chainId, isOpen)
  const { ticks: data } = useAllV3Ticks(baseCurrency, quoteCurrency, feeAmount)
  const volume24H = usePoolAvgTradingVolume({
    address: poolAddress,
    chainId: pool?.token0.chainId,
  })
  const sqrtRatioX96 = useMemo(() => price && encodeSqrtRatioX96(price.numerator, price.denominator), [price])
  const { [Bound.LOWER]: tickLower, [Bound.UPPER]: tickUpper } = ticks
  const { [Bound.LOWER]: priceLower, [Bound.UPPER]: priceUpper } = pricesAtTicks
  const { [Field.CURRENCY_A]: amountA, [Field.CURRENCY_B]: amountB } = parsedAmounts

  const tokenA = (baseCurrency ?? undefined)?.wrapped
  const tokenB = (quoteCurrency ?? undefined)?.wrapped

  const inverted = useMemo(
    () => Boolean(tokenA && tokenB && tokenA?.address !== tokenB?.address && tokenB.sortsBefore(tokenA)),
    [tokenA, tokenB],
  )

  const baseUSDPrice = useStablecoinPrice(baseCurrency)
  const quoteUSDPrice = useStablecoinPrice(quoteCurrency)
  const currencyAUsdPrice = useMemo(
    () =>
      baseUSDPrice
        ? parseFloat(formatPrice(baseUSDPrice, 6) || '0')
        : deriveUSDPrice(
            quoteUSDPrice,
            quoteCurrency && price?.baseCurrency.equals(quoteCurrency.wrapped) ? price : price?.invert(),
          ),
    [baseUSDPrice, quoteUSDPrice, price, quoteCurrency],
  )
  const currencyBUsdPrice = useMemo(
    () =>
      baseUSDPrice &&
      (deriveUSDPrice(
        baseUSDPrice,
        baseCurrency && price?.baseCurrency.equals(baseCurrency.wrapped) ? price : price?.invert(),
      ) ||
        parseFloat(formatPrice(quoteUSDPrice, 6) || '0')),
    [baseUSDPrice, quoteUSDPrice, price, baseCurrency],
  )

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

  const applyProtocolFee = defaultDepositUsd ? undefined : protocolFee

  const { amountA: aprAmountA, amountB: aprAmountB } = useAmountsByUsdValue({
    usdValue: '1',
    currencyA: inverted ? tokenB : tokenA,
    currencyB: inverted ? tokenA : tokenB,
    price,
    priceLower,
    priceUpper,
    sqrtRatioX96,
    currencyAUsdPrice: inverted ? currencyBUsdPrice : currencyAUsdPrice,
    currencyBUsdPrice: inverted ? currencyAUsdPrice : currencyBUsdPrice,
  })

  const validAmountA = amountA || (inverted ? tokenAmount1 : tokenAmount0) || (inverted ? aprAmountB : aprAmountA)
  const validAmountB = amountB || (inverted ? tokenAmount0 : tokenAmount1) || (inverted ? aprAmountA : aprAmountB)
  const { apr } = useRoi({
    tickLower,
    tickUpper,
    sqrtRatioX96,
    fee: feeAmount,
    mostActiveLiquidity: pool?.liquidity,
    amountA: validAmountA,
    amountB: validAmountB,
    compoundOn: false,
    currencyAUsdPrice,
    currencyBUsdPrice,
    volume24H,
    protocolFee: applyProtocolFee,
  })

  const positionLiquidity = useMemo(
    () =>
      existingPosition?.liquidity ||
      (validAmountA &&
        validAmountB &&
        sqrtRatioX96 &&
        typeof tickLower === 'number' &&
        typeof tickUpper === 'number' &&
        tickLower < tickUpper &&
        FeeCalculator.getLiquidityByAmountsAndPrice({
          amountA: validAmountA,
          amountB: validAmountB,
          tickUpper,
          tickLower,
          sqrtRatioX96,
        })),
    [existingPosition, validAmountA, validAmountB, tickUpper, tickLower, sqrtRatioX96],
  )
  const [amount0, amount1] = inverted ? [validAmountB, validAmountA] : [validAmountA, validAmountB]
  const inRange = useMemo(() => isPoolTickInRange(pool, tickLower, tickUpper), [pool, tickLower, tickUpper])
  const { positionFarmApr, positionFarmAprFactor } = useMemo(() => {
    if (!farm || !cakePrice || !positionLiquidity || !amount0 || !amount1 || !inRange) {
      return {
        positionFarmApr: '0',
        positionFarmAprFactor: BIG_ZERO,
      }
    }
    const { farm: farmDetail, cakePerSecond } = farm
    const { poolWeight, token, quoteToken, tokenPriceBusd, quoteTokenPriceBusd, lmPoolLiquidity } = farmDetail
    const [token0Price, token1Price] = token.sortsBefore(quoteToken)
      ? [tokenPriceBusd, quoteTokenPriceBusd]
      : [quoteTokenPriceBusd, tokenPriceBusd]
    const positionTvlUsd = +amount0.toExact() * +token0Price + +amount1.toExact() * +token1Price
    return {
      positionFarmApr: getPositionFarmApr({
        poolWeight,
        positionTvlUsd,
        cakePriceUsd: cakePrice,
        liquidity: positionLiquidity,
        cakePerSecond,
        totalStakedLiquidity: lmPoolLiquidity,
      }),
      positionFarmAprFactor: getPositionFarmAprFactor({
        poolWeight,
        cakePriceUsd: cakePrice,
        liquidity: positionLiquidity,
        cakePerSecond,
        totalStakedLiquidity: lmPoolLiquidity,
      }),
    }
  }, [farm, cakePrice, positionLiquidity, amount0, amount1, inRange])

  // NOTE: Assume no liquidity when opening modal
  const { onFieldAInput, onBothRangeInput, onSetFullRange } = useV3MintActionHandlers(false)

  const tokenId = useMemo(() => positionDetails?.tokenId?.toString() ?? '-1', [positionDetails?.tokenId])
  const pid = useMemo(() => farm?.farm?.pid ?? -1, [farm?.farm.pid])
  const {
    data: { boostMultiplier },
  } = useUserPositionInfo(positionDetails?.tokenId?.toString() ?? '-1')

  const { status: boostedStatus } = useBoostStatus(pid, tokenId)
  const isBoosted = useMemo(() => boostedStatus === BoostStatus.Boosted, [boostedStatus])

  const closeModal = useCallback(() => setOpen(false), [])
  const onApply = useCallback(
    (position: RoiCalculatorPositionInfo) => {
      batch(() => {
        const isToken0Price =
          position.amountA?.wrapped?.currency &&
          position.amountB?.wrapped?.currency &&
          position.amountA.wrapped.currency.sortsBefore(position.amountB.wrapped.currency)
        if (position.fullRange) {
          onSetFullRange()
        } else {
          onBothRangeInput({
            leftTypedValue: isToken0Price ? position.priceLower : position?.priceUpper?.invert(),
            rightTypedValue: isToken0Price ? position.priceUpper : position?.priceLower?.invert(),
          })
        }

        onFieldAInput(position.amountA?.toExact() || '')
      })
      router.replace(
        {
          pathname: router.pathname,
          query: {
            ...router.query,
            currency: [
              position.amountA ? currencyId(position.amountA.currency) : '',
              position.amountB ? currencyId(position.amountB.currency) : '',
              feeAmount ? feeAmount.toString() : '',
            ],
          },
        },
        undefined,
        {
          shallow: true,
        },
      )
      closeModal()
    },
    [closeModal, feeAmount, onBothRangeInput, onFieldAInput, onSetFullRange, router],
  )

  if (!data || !data.length) {
    return null
  }

  const hasFarmApr = positionFarmApr && +positionFarmApr > 0
  const combinedApr = hasFarmApr ? +apr.toSignificant(6) + +positionFarmApr : +apr.toSignificant(6)
  const combinedAprWithBoosted = hasFarmApr
    ? +apr.toSignificant(6) + +positionFarmApr * (isBoosted ? boostMultiplier : 1)
    : +apr.toSignificant(6)
  const aprDisplay = combinedApr.toLocaleString(undefined, {
    maximumFractionDigits: 2,
    minimumFractionDigits: 0,
  })

  const boostedAprDisplay = combinedAprWithBoosted.toLocaleString(undefined, {
    maximumFractionDigits: 2,
    minimumFractionDigits: 0,
  })
  const farmAprTips = hasFarmApr ? (
    <>
      <Text bold>{t('This position must be staking in farm to apply the combined APR with farming rewards.')}</Text>
      <br />
    </>
  ) : null
  const AprText = hasFarmApr ? TooltipText : Text

  return (
    <>
      <Flex flexDirection="column">
        {showTitle && (
          <Text color="textSubtle" fontSize="12px">
            {hasFarmApr ? t('APR (with farming)') : t('APR')}
          </Text>
        )}
        <AprButtonContainer alignItems="center">
          <AprText onClick={() => setOpen(true)}>
            <Flex style={{ gap: 3 }}>
              {isBoosted && (
                <>
                  <RocketIcon color="success" />
                  <Text fontSize="14px" color="success">
                    {boostedAprDisplay}%
                  </Text>
                </>
              )}
              <Text fontSize="14px" style={{ textDecoration: isBoosted ? 'line-through' : 'none' }}>
                {aprDisplay}%
              </Text>
            </Flex>
          </AprText>
          <IconButton variant="text" scale="sm" onClick={() => setOpen(true)}>
            <CalculateIcon color="textSubtle" ml="0.25em" width="24px" />
          </IconButton>
          {showQuestion ? (
            <QuestionHelper
              text={
                <>
                  {farmAprTips}
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
              placement="top"
            />
          ) : null}
        </AprButtonContainer>
      </Flex>
      <RoiCalculatorModalV2
        allowApply={allowApply}
        isOpen={isOpen}
        onDismiss={closeModal}
        depositAmountInUsd={defaultDepositUsd || depositUsd}
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
        protocolFee={applyProtocolFee}
        ticks={data}
        volume24H={volume24H}
        priceUpper={priceUpper}
        priceLower={priceLower}
        priceSpan={priceSpan}
        onPriceSpanChange={setPriceSpan}
        onApply={onApply}
        isFarm={Boolean(hasFarmApr)}
        cakeAprFactor={positionFarmAprFactor.times(isBoosted ? boostMultiplier : 1)}
        cakePrice={cakePrice.toFixed(3)}
      />
    </>
  )
}
