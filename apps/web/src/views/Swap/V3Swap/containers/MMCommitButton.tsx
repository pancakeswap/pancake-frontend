import { Currency } from '@pancakeswap/sdk'
import { useExpertMode } from '@pancakeswap/utils/user'
import { useCurrency } from 'hooks/Tokens'
import { useIsTransactionUnsupported } from 'hooks/Trades'
import useWrapCallback, { WrapType } from 'hooks/useWrapCallback'
import { memo, useMemo } from 'react'
import { Field } from 'state/swap/actions'
import { useSwapState } from 'state/swap/hooks'
import { useSwapActionHandlers } from 'state/swap/useSwapActionHandlers'
import { MMSwapCommitButton } from 'views/Swap/MMLinkPools/components/MMCommitButton'
import { MMOrder } from 'views/Swap/utils'
import { useAccount } from 'wagmi'
import { CommitButtonProps } from '../types'

const MMCommitButtonComp: React.FC<{ order: MMOrder } & CommitButtonProps> = ({ order, beforeCommit, afterCommit }) => {
  const {
    typedValue,
    recipient,
    [Field.INPUT]: { currencyId: inputCurrencyId },
    [Field.OUTPUT]: { currencyId: outputCurrencyId },
  } = useSwapState()

  const inputCurrency = useCurrency(inputCurrencyId) ?? undefined
  const outputCurrency = useCurrency(outputCurrencyId) ?? undefined
  const { address: account } = useAccount()
  const [isExpertMode] = useExpertMode()
  const currencies: { [field in Field]?: Currency } = useMemo(
    () => ({
      [Field.INPUT]: inputCurrency,
      [Field.OUTPUT]: outputCurrency,
    }),
    [inputCurrency, outputCurrency],
  )
  const swapIsUnsupported = useIsTransactionUnsupported(currencies?.INPUT, currencies?.OUTPUT)

  const {
    wrapType,
    execute: onWrap,
    inputError: wrapInputError,
  } = useWrapCallback(inputCurrency, outputCurrency, typedValue)
  const showWrap = wrapType !== WrapType.NOT_APPLICABLE
  const { onUserInput } = useSwapActionHandlers()

  return (
    <MMSwapCommitButton
      beforeCommit={beforeCommit}
      afterCommit={afterCommit}
      order={order}
      showWrap={showWrap}
      swapIsUnsupported={swapIsUnsupported}
      account={account}
      onWrap={onWrap}
      currencies={currencies}
      currencyBalances={order.mmOrderBookTrade!.currencyBalances}
      isExpertMode={isExpertMode}
      swapInputError={order.mmOrderBookTrade?.inputError}
      wrapType={wrapType}
      wrapInputError={wrapInputError}
      recipient={recipient}
      onUserInput={onUserInput}
      // isPendingError={isPendingError}
    />
  )
}

export const MMCommitButton = memo(MMCommitButtonComp)
