import React, { useCallback, useMemo } from 'react'
import { BigNumber } from '@ethersproject/bignumber'
import { Currency, CurrencyAmount, Fraction, JSBI, Pair, Percent, Price, TokenAmount } from '@pancakeswap/sdk'
import { InjectedModalProps, Text, ArrowDownIcon, Button, useTooltip } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import TransactionConfirmationModal, {
  ConfirmationModalContent,
  TransactionErrorContent,
} from 'components/TransactionConfirmationModal'
import { AutoColumn } from 'components/Layout/Column'
import { AutoRow, RowFixed } from 'components/Layout/Row'
import { Field } from 'state/burn/actions'
import { CurrencyLogo } from 'components/Logo'
import useTotalSupply from 'hooks/useTotalSupply'
import { wrappedCurrency } from 'utils/wrappedCurrency'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { PairDistribution, AddLiquidityModalHeader } from './common'
import { ZapErrorMessages } from './ZapErrorMessage'

interface ConfirmZapInModalProps {
  title: string
  customOnDismiss: () => void
  attemptingTxn: boolean
  hash: string
  pendingText: string
  currencies: { [field in Field]?: Currency }
  allowedSlippage: number
  liquidityErrorMessage: string
  price: Fraction
  parsedAmounts: { [field in Field]?: CurrencyAmount }
  onAdd: () => void
  poolTokenPercentage: Percent
  liquidityMinted: TokenAmount
  pair: Pair
  rebalancing?: boolean
  zapSwapTokenField: Field
  zapSwapOutTokenField: Field
  zapInEstimated: {
    swapAmountIn: BigNumber
    swapAmountOut: BigNumber
    isToken0Sold: boolean
  }
}

const clamp = (num: number, min: number, max: number) => Math.min(Math.max(num, min), max)

const ConfirmZapInModal: React.FC<InjectedModalProps & ConfirmZapInModalProps> = ({
  title,
  onDismiss,
  customOnDismiss,
  attemptingTxn,
  hash,
  pendingText,
  price,
  currencies,
  zapSwapTokenField,
  zapSwapOutTokenField,
  allowedSlippage,
  parsedAmounts,
  liquidityErrorMessage,
  onAdd,
  poolTokenPercentage,
  liquidityMinted,
  pair,
  zapInEstimated,
  rebalancing,
}) => {
  const { t } = useTranslation()
  const { chainId } = useActiveWeb3React()

  const totalPoolTokens = useTotalSupply(pair.liquidityToken)
  const swapInCurrencyAmount = parsedAmounts[zapSwapTokenField]
  const swapOutCurrencyAmount = parsedAmounts[zapSwapOutTokenField]

  const { targetRef, tooltip, tooltipVisible } = useTooltip(
    swapInCurrencyAmount && !swapOutCurrencyAmount
      ? t('There is no %token1% input. Half of %token0% input is converted into %token1% to add liquidity.', {
          token0: currencies[zapSwapTokenField]?.symbol,
          token1: currencies[zapSwapOutTokenField]?.symbol,
        })
      : t('There is not enough %token1% input to match 50/50. Some of %token0% will be converted to %token1%', {
          token0: currencies[zapSwapTokenField]?.symbol,
          token1: currencies[zapSwapOutTokenField]?.symbol,
        }),
    {
      placement: 'auto-start',
    },
  )

  const [token0Deposited, token1Deposited] =
    !!pair &&
    !!totalPoolTokens &&
    !!liquidityMinted &&
    // this condition is a short-circuit in the case where useTokenBalance updates sooner than useTotalSupply
    JSBI.greaterThanOrEqual(totalPoolTokens.raw, liquidityMinted.raw)
      ? [
          pair.getLiquidityValue(pair.token0, totalPoolTokens, liquidityMinted, false),
          pair.getLiquidityValue(pair.token1, totalPoolTokens, liquidityMinted, false),
        ]
      : [undefined, undefined]

  const swapInTokenAmount = useMemo(
    () =>
      zapInEstimated &&
      new TokenAmount(wrappedCurrency(currencies[zapSwapTokenField], chainId), zapInEstimated.swapAmountIn.toString()),
    [chainId, currencies, zapInEstimated, zapSwapTokenField],
  )

  const swapOutTokenAmount = useMemo(
    () =>
      zapInEstimated?.swapAmountOut &&
      new TokenAmount(
        wrappedCurrency(currencies[zapSwapOutTokenField], chainId),
        zapInEstimated.swapAmountOut.toString(),
      ),
    [chainId, currencies, zapInEstimated?.swapAmountOut, zapSwapOutTokenField],
  )

  const inputPercent = useMemo(
    () =>
      swapInCurrencyAmount && swapOutCurrencyAmount
        ? clamp(
            +pair
              .priceOf(wrappedCurrency(swapOutCurrencyAmount.currency, chainId))
              .raw.divide(
                new Price(
                  swapInCurrencyAmount.currency,
                  swapOutCurrencyAmount.currency,
                  JSBI.add(swapInCurrencyAmount.raw, swapOutCurrencyAmount.raw),
                  swapInCurrencyAmount.raw,
                ),
              )
              .toSignificant(2),
            0.05,
            0.95,
          )
        : swapInCurrencyAmount && !swapOutCurrencyAmount
        ? 1
        : undefined,
    [chainId, pair, swapInCurrencyAmount, swapOutCurrencyAmount],
  )

  const tokenDeposited = useMemo(
    () => ({
      [zapSwapTokenField]:
        swapInTokenAmount?.token && pair?.token0
          ? pair.token0.equals(swapInTokenAmount.token)
            ? token0Deposited
            : token1Deposited
          : undefined,
      [zapSwapOutTokenField]:
        swapOutTokenAmount?.token && pair?.token1
          ? pair.token1.equals(swapOutTokenAmount.token)
            ? token1Deposited
            : token0Deposited
          : undefined,
    }),
    [
      pair.token0,
      pair.token1,
      swapInTokenAmount?.token,
      swapOutTokenAmount?.token,
      token0Deposited,
      token1Deposited,
      zapSwapOutTokenField,
      zapSwapTokenField,
    ],
  )

  const modalHeader = useCallback(() => {
    return (
      <AddLiquidityModalHeader
        allowedSlippage={allowedSlippage}
        currencies={currencies}
        liquidityMinted={liquidityMinted}
        poolTokenPercentage={poolTokenPercentage}
        price={price}
      >
        <PairDistribution
          title={t('Input')}
          percent={inputPercent}
          currencyA={swapInCurrencyAmount ? currencies[zapSwapTokenField] : undefined}
          currencyAValue={swapInCurrencyAmount?.toSignificant(6)}
          currencyB={swapOutCurrencyAmount ? currencies[zapSwapOutTokenField] : undefined}
          currencyBValue={swapOutCurrencyAmount?.toSignificant(6)}
        />
        {swapOutTokenAmount && swapInTokenAmount && currencies[zapSwapTokenField] && currencies[zapSwapOutTokenField] && (
          <AutoColumn justify="center" gap="16px">
            <ArrowDownIcon color="textSubtle" />
            <AutoRow gap="6px" justify="center">
              <RowFixed gap="2px">
                <Text>{swapInTokenAmount?.toSignificant(6)}</Text>
                <CurrencyLogo currency={currencies[zapSwapTokenField]} />
                <Text>{currencies[zapSwapTokenField].symbol}</Text>
              </RowFixed>
              <Text>{t('to')}</Text>
              <RowFixed gap="2px">
                <Text>{swapOutTokenAmount?.toSignificant(6)}</Text>
                <CurrencyLogo currency={currencies[zapSwapOutTokenField]} />
                <Text>{currencies[zapSwapOutTokenField].symbol}</Text>
              </RowFixed>
            </AutoRow>
            <ArrowDownIcon color="textSubtle" />
          </AutoColumn>
        )}
        <AutoColumn gap="4px">
          {tooltipVisible && tooltip}
          <PairDistribution
            tooltipTargetRef={targetRef}
            title={t('Pooled')}
            percent={0.5}
            currencyA={currencies[zapSwapTokenField]}
            currencyAValue={tokenDeposited?.[zapSwapTokenField]?.toSignificant(6)}
            currencyB={currencies[zapSwapOutTokenField]}
            currencyBValue={tokenDeposited?.[zapSwapOutTokenField]?.toSignificant(6)}
          />
        </AutoColumn>
      </AddLiquidityModalHeader>
    )
  }, [
    allowedSlippage,
    currencies,
    liquidityMinted,
    poolTokenPercentage,
    price,
    t,
    inputPercent,
    swapInCurrencyAmount,
    zapSwapTokenField,
    swapOutCurrencyAmount,
    zapSwapOutTokenField,
    swapOutTokenAmount,
    swapInTokenAmount,
    tooltip,
    tooltipVisible,
    targetRef,
    tokenDeposited,
  ])

  const modalBottom = useCallback(() => {
    return (
      <Button width="100%" onClick={onAdd} mt="20px">
        {t('Confirm Supply')}
      </Button>
    )
  }, [onAdd, t])

  const confirmationContent = useCallback(
    () =>
      liquidityErrorMessage ? (
        <>
          <ZapErrorMessages isSingleToken={!rebalancing} />
          <TransactionErrorContent onDismiss={onDismiss} message={liquidityErrorMessage} />
        </>
      ) : (
        <ConfirmationModalContent topContent={modalHeader} bottomContent={modalBottom} />
      ),
    [liquidityErrorMessage, rebalancing, onDismiss, modalHeader, modalBottom],
  )

  return (
    <TransactionConfirmationModal
      minWidth={['100%', , '420px']}
      title={title}
      onDismiss={onDismiss}
      customOnDismiss={customOnDismiss}
      attemptingTxn={attemptingTxn}
      currencyToAdd={pair?.liquidityToken}
      hash={hash}
      content={confirmationContent}
      pendingText={pendingText}
    />
  )
}

export default ConfirmZapInModal
