import React, { useCallback } from 'react'
import { Currency, CurrencyAmount, Pair, Percent, Token } from '@pancakeswap/aptos-swap-sdk'
import { AddIcon, AutoColumn, Button, InjectedModalProps, RowBetween, RowFixed, Text } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import TransactionConfirmationModal, {
  ConfirmationModalContent,
  TransactionErrorContent,
} from 'components/TransactionConfirmationModal'
import { CurrencyLogo, DoubleCurrencyLogo } from 'components/Logo'
import { useUserSlippage } from 'state/user'

import { Field } from '../type'

interface ConfirmRemoveLiquidityModalProps {
  title: string
  customOnDismiss: () => void
  attemptingTxn: boolean
  pair?: Pair
  hash: string
  parsedAmounts: {
    [Field.LIQUIDITY_PERCENT]: Percent
    [Field.LIQUIDITY]?: CurrencyAmount<Token>
    [Field.CURRENCY_A]?: CurrencyAmount<Currency>
    [Field.CURRENCY_B]?: CurrencyAmount<Currency>
  }
  onRemove: () => void
  liquidityErrorMessage: string
  signatureData?: any
  tokenA: Token
  tokenB: Token
  currencyA: Currency | undefined
  currencyB: Currency | undefined
}

const ConfirmRemoveLiquidityModal: React.FC<
  React.PropsWithChildren<InjectedModalProps & ConfirmRemoveLiquidityModalProps>
> = ({
  title,
  onDismiss,
  customOnDismiss,
  attemptingTxn,
  pair,
  hash,
  parsedAmounts,
  onRemove,
  liquidityErrorMessage,
  tokenA,
  tokenB,
  currencyA,
  currencyB,
}) => {
  const { t } = useTranslation()
  const [allowedSlippage] = useUserSlippage() // custom from users

  const pendingText = t('Removing %amountA% %symbolA% and %amountB% %symbolB%', {
    amountA: parsedAmounts[Field.CURRENCY_A]?.toSignificant(6) ?? '',
    symbolA: currencyA?.symbol ?? '',
    amountB: parsedAmounts[Field.CURRENCY_B]?.toSignificant(6) ?? '',
    symbolB: currencyB?.symbol ?? '',
  })

  const modalHeader = useCallback(() => {
    return (
      <AutoColumn gap="md">
        {parsedAmounts[Field.CURRENCY_A] && (
          <RowBetween justifyContent="flex-end">
            <Text fontSize="24px">{parsedAmounts[Field.CURRENCY_A]?.toSignificant(6)}</Text>
            <RowFixed gap="4px">
              <CurrencyLogo currency={currencyA} size="24px" />
              <Text fontSize="24px" ml="10px">
                {currencyA?.symbol}
              </Text>
            </RowFixed>
          </RowBetween>
        )}
        {parsedAmounts[Field.CURRENCY_A] && parsedAmounts[Field.CURRENCY_B] && (
          <RowFixed>
            <AddIcon width="16px" />
          </RowFixed>
        )}
        {parsedAmounts[Field.CURRENCY_B] && (
          <RowBetween justifyContent="flex-end">
            <Text fontSize="24px">{parsedAmounts[Field.CURRENCY_B]?.toSignificant(6)}</Text>
            <RowFixed gap="4px">
              <CurrencyLogo currency={currencyB} size="24px" />
              <Text fontSize="24px" ml="10px">
                {currencyB?.symbol}
              </Text>
            </RowFixed>
          </RowBetween>
        )}

        <Text small textAlign="left" pt="12px">
          {t('Output is estimated. If the price changes by more than %slippage%% your transaction will revert.', {
            slippage: allowedSlippage / 100,
          })}
        </Text>
      </AutoColumn>
    )
  }, [allowedSlippage, currencyA, currencyB, parsedAmounts, t])

  const modalBottom = useCallback(() => {
    return (
      <>
        <RowBetween>
          <Text>
            {t('%assetA%/%assetB% Burned', { assetA: currencyA?.symbol ?? '', assetB: currencyB?.symbol ?? '' })}
          </Text>
          <RowFixed>
            <DoubleCurrencyLogo currency0={currencyA} currency1={currencyB} margin />
            <Text>{parsedAmounts[Field.LIQUIDITY]?.toSignificant(6)}</Text>
          </RowFixed>
        </RowBetween>
        {pair && (
          <>
            <RowBetween>
              <Text>{t('Price')}</Text>
              <Text>
                1 {currencyA?.symbol} = {tokenA ? pair.priceOf(tokenA).toSignificant(6) : '-'} {currencyB?.symbol}
              </Text>
            </RowBetween>
            <RowBetween>
              <div />
              <Text>
                1 {currencyB?.symbol} = {tokenB ? pair.priceOf(tokenB).toSignificant(6) : '-'} {currencyA?.symbol}
              </Text>
            </RowBetween>
          </>
        )}
        <Button width="100%" mt="20px" onClick={onRemove}>
          {t('Confirm')}
        </Button>
      </>
    )
  }, [currencyA, currencyB, parsedAmounts, onRemove, pair, tokenA, tokenB, t])

  const confirmationContent = useCallback(
    () =>
      liquidityErrorMessage ? (
        <>
          <TransactionErrorContent onDismiss={onDismiss} message={liquidityErrorMessage} />
        </>
      ) : (
        <ConfirmationModalContent topContent={modalHeader} bottomContent={modalBottom} />
      ),
    [liquidityErrorMessage, onDismiss, modalHeader, modalBottom],
  )

  return (
    <TransactionConfirmationModal
      title={title}
      onDismiss={onDismiss}
      customOnDismiss={customOnDismiss}
      attemptingTxn={attemptingTxn}
      hash={hash}
      content={confirmationContent}
      pendingText={pendingText}
    />
  )
}

export default ConfirmRemoveLiquidityModal
