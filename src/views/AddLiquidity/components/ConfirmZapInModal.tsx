import React, { useCallback, useMemo } from 'react'
import { BigNumber } from '@ethersproject/bignumber'
import { Currency, CurrencyAmount, Fraction, JSBI, Pair, Percent, Price, TokenAmount } from '@pancakeswap/sdk'
import {
  Box,
  Flex,
  InjectedModalProps,
  Text,
  useTooltip,
  TooltipText,
  ArrowDownIcon,
  Button,
  Svg,
  SvgProps,
} from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import TransactionConfirmationModal, {
  ConfirmationModalContent,
  TransactionErrorContent,
} from 'components/TransactionConfirmationModal'
import { AutoColumn } from 'components/Layout/Column'
import { AutoRow, RowBetween, RowFixed } from 'components/Layout/Row'
import { Field } from 'state/burn/actions'
import { DoubleCurrencyLogo, CurrencyLogo } from 'components/Logo'
import { GreyCard } from 'components/Card'
import { getLPSymbol } from 'utils/getLpSymbol'
import styled from 'styled-components'
import useTotalSupply from 'hooks/useTotalSupply'
import { wrappedCurrency } from 'utils/wrappedCurrency'
import useActiveWeb3React from 'hooks/useActiveWeb3React'

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

const Dot = styled(Box)<{ scale?: 'sm' | 'md' }>`
  width: 12px;
  height: 12px;
  border-radius: 50%;
`

const CircleSvg = ({ percent = 1, ...props }: SvgProps & { percent?: number }) => (
  <Svg width="60px" height="60px" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <g filter="url(#filter0_i_1147_113741)">
      <circle r="10" cx="10" cy="10" fill="#7645D9" />
      <circle
        r="5"
        cx="10"
        cy="10"
        fill="transparent"
        stroke="#1FC7D4"
        strokeWidth="10"
        strokeDasharray={`calc(${percent * 100} * 31.4 / 100) 31.4`}
        transform="rotate(-90) translate(-20)"
      />
    </g>
    <defs>
      <filter
        id="filter0_i_1147_113741"
        x={0}
        y={0}
        width={60}
        height={60}
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity={0} result="BackgroundImageFix" />
        <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
        <feColorMatrix in="SourceAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
        <feOffset dy={-2} />
        <feComposite in2="hardAlpha" operator="arithmetic" k2={-1} k3={1} />
        <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0" />
        <feBlend in2="shape" result="effect1_innerShadow_1147_113741" />
      </filter>
    </defs>
  </Svg>
)

const Subtitle: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <Text fontSize="12px" textTransform="uppercase" bold color="secondary">
      {children}
    </Text>
  )
}

const PairDistribution = ({ title, percent, currencyA, currencyB, currencyAValue, currencyBValue }) => {
  return (
    <AutoColumn gap="8px">
      <Subtitle>{title}</Subtitle>
      <Flex>
        {typeof percent !== 'undefined' && <CircleSvg percent={percent} mr="34px" />}
        <AutoColumn style={{ width: '100%' }}>
          {currencyA && (
            <RowBetween>
              <AutoRow gap="4px">
                <Dot bg="primary" />
                <CurrencyLogo currency={currencyA} />
                <Text>{currencyA?.symbol}</Text>
              </AutoRow>
              <Text>{currencyAValue}</Text>
            </RowBetween>
          )}

          {currencyB && (
            <RowBetween>
              <AutoRow gap="4px">
                <Dot bg="secondary" />
                <CurrencyLogo currency={currencyB} />
                <Text>{currencyB?.symbol}</Text>
              </AutoRow>
              <Text>{currencyBValue}</Text>
            </RowBetween>
          )}
        </AutoColumn>
      </Flex>
    </AutoColumn>
  )
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

  const { tooltip, tooltipVisible, targetRef } = useTooltip(
    t('Output is estimated. If the price changes by more than %slippage%% your transaction will revert.', {
      slippage: allowedSlippage / 100,
    }),
    { placement: 'auto' },
  )

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
            1,
          )
        : undefined,
    [token0Deposited, token1Deposited],
  )

  const modalHeader = useCallback(() => {
    return (
      <AutoColumn gap="24px">
        <AutoColumn>
          <Text small textTransform="uppercase" bold color="secondary">
            {t('You will receive')}
          </Text>
          <GreyCard>
            <RowBetween>
              <AutoRow gap="4px">
                <DoubleCurrencyLogo
                  currency0={currencies[Field.CURRENCY_A]}
                  currency1={currencies[Field.CURRENCY_B]}
                  size={24}
                />
                <Text color="textSubtle">
                  {currencies[Field.CURRENCY_A]?.symbol &&
                    currencies[Field.CURRENCY_B]?.symbol &&
                    getLPSymbol(currencies[Field.CURRENCY_A]?.symbol, currencies[Field.CURRENCY_B]?.symbol)}
                </Text>
              </AutoRow>
              {liquidityMinted?.toSignificant(6)}
            </RowBetween>
          </GreyCard>
        </AutoColumn>
        <RowBetween>
          <Text small textTransform="uppercase" bold color="secondary">
            {t('Your pool share')}
          </Text>
          <Text>{poolTokenPercentage?.toSignificant(4)}%</Text>
        </RowBetween>
        <AutoColumn gap="8px">
          <PairDistribution
            title={t('Input')}
            percent={inputPercent}
            currencyA={swapInCurrencyAmount ? currencies[zapSwapTokenField] : undefined}
            currencyAValue={swapInCurrencyAmount?.toSignificant(6)}
            currencyB={swapOutCurrencyAmount ? currencies[zapSwapOutTokenField] : undefined}
            currencyBValue={swapOutCurrencyAmount?.toSignificant(6)}
          />
          {swapOutTokenAmount &&
            swapInTokenAmount &&
            currencies[zapSwapTokenField] &&
            currencies[zapSwapOutTokenField] && (
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
        </AutoColumn>
        <AutoColumn>
          <RowBetween>
            <Text small textTransform="uppercase" bold color="secondary">
              {t('Rates')}
            </Text>
            <Text>
              {`1 ${currencies[Field.CURRENCY_A]?.symbol} = ${price?.toSignificant(4)} ${
                currencies[Field.CURRENCY_B]?.symbol
              }`}
            </Text>
          </RowBetween>
          <RowBetween style={{ justifyContent: 'flex-end' }}>
            <Text>
              {`1 ${currencies[Field.CURRENCY_B]?.symbol} = ${price?.invert().toSignificant(4)} ${
                currencies[Field.CURRENCY_A]?.symbol
              }`}
            </Text>
          </RowBetween>
        </AutoColumn>
        <RowBetween>
          <Text small textTransform="uppercase" bold color="secondary">
            {t('Slippage Tolerance')}
          </Text>
          <TooltipText ref={targetRef}>{allowedSlippage / 100}%</TooltipText>
          {tooltipVisible && tooltip}
        </RowBetween>
      </AutoColumn>
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
    targetRef,
    allowedSlippage,
    tooltipVisible,
    tooltip,
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
      minWidth={['100%', , , '420px']}
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
