import React, { useCallback, useMemo } from 'react'
import { BigNumber } from '@ethersproject/bignumber'
import { Currency, CurrencyAmount, Fraction, JSBI, Pair, Percent, Price, TokenAmount } from '@pancakeswap/sdk'
import { InjectedModalProps, Text, ArrowDownIcon, Button } from '@pancakeswap/uikit'
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
  zapSwapTokenField: Field
  zapSwapOutTokenField: Field
  zapInEstimated: {
    swapAmountIn: BigNumber
    swapAmountOut: BigNumber
    isToken0Sold: boolean
  }
}

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
}) => {
  const { t } = useTranslation()
  const { chainId } = useActiveWeb3React()

  const totalPoolTokens = useTotalSupply(pair.liquidityToken)
  const swapInCurrencyAmount = parsedAmounts[zapSwapTokenField]
  const swapOutCurrencyAmount = parsedAmounts[zapSwapOutTokenField]

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
      new TokenAmount(
        wrappedCurrency(currencies[zapSwapOutTokenField], chainId),
        zapInEstimated.swapAmountOut.toString(),
      ),
    [chainId, currencies, zapInEstimated.swapAmountOut, zapSwapOutTokenField],
  )

  const inputPercent = useMemo(
    () =>
      swapInCurrencyAmount && swapOutCurrencyAmount
        ? Math.min(
            Math.max(
              +new Price(
                swapInCurrencyAmount.currency,
                swapOutCurrencyAmount.currency,
                JSBI.add(swapInCurrencyAmount.raw, swapOutCurrencyAmount.raw),
                swapInCurrencyAmount.raw,
              ).toSignificant(2),
              0.02,
            ),
            1,
          )
        : swapInCurrencyAmount && !swapOutCurrencyAmount
        ? 1
        : undefined,
    [swapInCurrencyAmount, swapOutCurrencyAmount],
  )

  const tokenDeposited = useMemo(
    () => ({
      [zapSwapTokenField]: pair.token0.equals(swapInTokenAmount.token) ? token0Deposited : token1Deposited,
      [zapSwapOutTokenField]: pair.token1.equals(swapOutTokenAmount.token) ? token1Deposited : token0Deposited,
    }),
    [
      pair.token0,
      pair.token1,
      swapInTokenAmount.token,
      swapOutTokenAmount.token,
      token0Deposited,
      token1Deposited,
      zapSwapOutTokenField,
      zapSwapTokenField,
    ],
  )

  const pooledPercent = useMemo(
    () =>
      token0Deposited && token1Deposited
        ? Math.min(
            Math.max(
              +new Price(
                token0Deposited.currency,
                token1Deposited.currency,
                JSBI.add(token0Deposited.raw, token1Deposited.raw),
                token0Deposited.raw,
              ).toSignificant(2),
              0.02,
            ),
            0.98,
          )
        : undefined,
    [token0Deposited, token1Deposited],
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
          <PairDistribution
            title={t('Pooled')}
            percent={pooledPercent}
            currencyA={currencies[zapSwapTokenField]}
            currencyAValue={tokenDeposited[zapSwapTokenField]?.toSignificant(6)}
            currencyB={currencies[zapSwapOutTokenField]}
            currencyBValue={tokenDeposited[zapSwapOutTokenField]?.toSignificant(6)}
          />
        </AutoColumn>
      </AddLiquidityModalHeader>
    )
  }, [
    t,
    currencies,
    liquidityMinted,
    poolTokenPercentage,
    inputPercent,
    swapInCurrencyAmount,
    zapSwapTokenField,
    swapOutCurrencyAmount,
    zapSwapOutTokenField,
    swapOutTokenAmount,
    swapInTokenAmount,
    pooledPercent,
    tokenDeposited,
    price,
    allowedSlippage,
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
        <TransactionErrorContent onDismiss={onDismiss} message={liquidityErrorMessage} />
      ) : (
        <ConfirmationModalContent topContent={modalHeader} bottomContent={modalBottom} />
      ),
    [onDismiss, modalBottom, modalHeader, liquidityErrorMessage],
  )

  return (
    <TransactionConfirmationModal
      // @ts-ignore
      minWidth={['100%', '420px']}
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
