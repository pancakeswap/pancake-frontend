import { useTranslation } from '@pancakeswap/localization'
import { AutoColumn, useModal } from '@pancakeswap/uikit'
import { CommitButton } from 'components/CommitButton'
import _noop from 'lodash/noop'
import { useCallback, useContext } from 'react'
import { useIsExpertMode } from 'state/user/expertMode'
import useAddLiquidityHanlder from '../hooks/useAddLiquidityHandler'
import { CurrencySelectorContext } from '../hooks/useCurrencySelectRoute'
import ConfirmAddLiquidityModal from './ConfirmAddLiquidityModal'

export default function AddLiquidityButton({
  noLiquidity,
  price,
  poolTokenPercentage,
  liquidityMinted,
  liquidityToken,
  errorText,
  parsedAmounts,
  onFieldAInput,
}) {
  const expertMode = useIsExpertMode()
  const { t } = useTranslation()
  const currencies = useContext(CurrencySelectorContext)

  const { onAdd, attemptingTxn, txHash, liquidityErrorMessage, setLiquidityState } = useAddLiquidityHanlder({
    parsedAmounts,
    noLiquidity,
  })

  const handleDismissConfirmation = useCallback(() => {
    // if there was a tx hash, we want to clear the input
    if (txHash) {
      onFieldAInput('')
    }
  }, [onFieldAInput, txHash])

  const [onPresentAddLiquidityModal] = useModal(
    <ConfirmAddLiquidityModal
      parsedAmounts={parsedAmounts}
      title={noLiquidity ? t('You are creating a pool') : t('You will receive')}
      customOnDismiss={handleDismissConfirmation}
      attemptingTxn={attemptingTxn}
      hash={txHash}
      currencyToAdd={liquidityToken}
      onAdd={onAdd}
      liquidityErrorMessage={liquidityErrorMessage}
      price={price}
      noLiquidity={noLiquidity}
      poolTokenPercentage={poolTokenPercentage}
      liquidityMinted={liquidityMinted}
      currencies={currencies}
    />,
    true,
    true,
    'addLiquidityModal',
  )

  return (
    <AutoColumn gap="md">
      <CommitButton
        variant={errorText ? 'danger' : 'primary'}
        onClick={() => {
          if (expertMode) {
            onAdd()
          } else {
            setLiquidityState({
              attemptingTxn: false,
              liquidityErrorMessage: undefined,
              txHash: undefined,
            })
            onPresentAddLiquidityModal()
          }
        }}
        disabled={errorText}
      >
        {errorText || t('Supply')}
      </CommitButton>
    </AutoColumn>
  )
}
