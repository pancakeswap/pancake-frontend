import { useTranslation } from '@pancakeswap/localization'
import { Currency, CurrencyAmount, Fraction, Percent, Token } from '@pancakeswap/sdk'
import { Button, InjectedModalProps } from '@pancakeswap/uikit'
import { ConfirmationModalContent } from '@pancakeswap/widgets-internal'
import TransactionConfirmationModal from 'components/TransactionConfirmationModal'
import _toNumber from 'lodash/toNumber'
import React, { useCallback } from 'react'
import { Field } from 'state/burn/actions'
import { AddLiquidityModalHeader, PairDistribution } from './common'

interface ConfirmAddLiquidityModalProps {
  title: string
  customOnDismiss: () => void
  attemptingTxn: boolean
  hash?: string
  pendingText: string
  currencies: { [field in Field]?: Currency }
  noLiquidity?: boolean
  allowedSlippage: number
  liquidityErrorMessage?: string
  price?: Fraction | null
  parsedAmounts: { [field in Field]?: CurrencyAmount<Currency> }
  onAdd: () => void
  poolTokenPercentage?: Percent
  liquidityMinted?: CurrencyAmount<Token>
  currencyToAdd?: Token | null
  isStable?: boolean
}

const ConfirmAddLiquidityModal: React.FC<
  React.PropsWithChildren<InjectedModalProps & ConfirmAddLiquidityModalProps>
> = ({
  title,
  onDismiss,
  customOnDismiss,
  attemptingTxn,
  hash,
  pendingText,
  price,
  currencies,
  noLiquidity,
  allowedSlippage,
  parsedAmounts,
  liquidityErrorMessage,
  onAdd,
  poolTokenPercentage,
  liquidityMinted,
  currencyToAdd,
  isStable,
}) => {
  const { t } = useTranslation()

  let percent = 0.5

  // Calculate distribution percentage for display
  if ((isStable && parsedAmounts[Field.CURRENCY_A]) || parsedAmounts[Field.CURRENCY_B]) {
    const amountCurrencyA = parsedAmounts[Field.CURRENCY_A]
      ? _toNumber(parsedAmounts[Field.CURRENCY_A]?.toSignificant(6))
      : 0
    // If there is no price fallback to compare only amounts
    const currencyAToCurrencyB = (price && parseFloat(price?.toSignificant(4))) || 1
    const normalizedAmountCurrencyA = currencyAToCurrencyB * amountCurrencyA
    const amountCurrencyB = parsedAmounts[Field.CURRENCY_B]
      ? _toNumber(parsedAmounts[Field.CURRENCY_B]?.toSignificant(6))
      : 0

    percent = normalizedAmountCurrencyA / (normalizedAmountCurrencyA + amountCurrencyB)
  }

  const modalHeader = useCallback(() => {
    return (
      <AddLiquidityModalHeader
        allowedSlippage={allowedSlippage}
        currencies={currencies}
        liquidityMinted={liquidityMinted}
        poolTokenPercentage={poolTokenPercentage}
        price={price}
        noLiquidity={noLiquidity}
      >
        <PairDistribution
          title={t('Input')}
          percent={percent}
          currencyA={currencies[Field.CURRENCY_A]}
          currencyAValue={parsedAmounts[Field.CURRENCY_A]?.toSignificant(6)}
          currencyB={currencies[Field.CURRENCY_B]}
          currencyBValue={parsedAmounts[Field.CURRENCY_B]?.toSignificant(6)}
        />
      </AddLiquidityModalHeader>
    )
  }, [allowedSlippage, percent, currencies, liquidityMinted, noLiquidity, parsedAmounts, poolTokenPercentage, price, t])

  const modalBottom = useCallback(() => {
    return (
      <Button width="100%" onClick={onAdd} mt="20px">
        {noLiquidity ? t('Create Pair & Supply') : t('Confirm Supply')}
      </Button>
    )
  }, [noLiquidity, onAdd, t])

  const confirmationContent = useCallback(
    () => <ConfirmationModalContent topContent={modalHeader} bottomContent={modalBottom} />,
    [modalHeader, modalBottom],
  )

  return (
    <TransactionConfirmationModal
      minWidth={['100%', '', '420px']}
      title={title}
      onDismiss={onDismiss}
      customOnDismiss={customOnDismiss}
      attemptingTxn={attemptingTxn}
      currencyToAdd={currencyToAdd}
      errorMessage={liquidityErrorMessage}
      hash={hash}
      content={confirmationContent}
      pendingText={pendingText}
    />
  )
}

export default ConfirmAddLiquidityModal
