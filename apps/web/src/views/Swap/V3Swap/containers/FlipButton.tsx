import { AutoColumn, Swap as SwapUI, Button } from '@pancakeswap/uikit'
import { useCallback } from 'react'
import replaceBrowserHistory from '@pancakeswap/utils/replaceBrowserHistory'
import { useTranslation } from '@pancakeswap/localization'

import { useExpertModeManager } from 'state/user/hooks'
import { useSwapActionHandlers } from 'state/swap/useSwapActionHandlers'
import { useSwapState } from 'state/swap/hooks'
import { Field } from 'state/swap/actions'
import { AutoRow } from 'components/Layout/Row'

import { useIsWrapping } from '../hooks'

export function FlipButton() {
  const { t } = useTranslation()
  const [isExpertMode] = useExpertModeManager()
  const { onSwitchTokens, onChangeRecipient } = useSwapActionHandlers()
  const {
    recipient,
    [Field.INPUT]: { currencyId: inputCurrencyId },
    [Field.OUTPUT]: { currencyId: outputCurrencyId },
  } = useSwapState()
  const isWrapping = useIsWrapping(inputCurrencyId, outputCurrencyId)
  const allowRecipient = isExpertMode && !isWrapping

  const onFlip = useCallback(() => {
    onSwitchTokens()
    replaceBrowserHistory('inputCurrency', outputCurrencyId)
    replaceBrowserHistory('outputCurrency', inputCurrencyId)
  }, [onSwitchTokens, inputCurrencyId, outputCurrencyId])

  return (
    <AutoColumn justify="space-between">
      <AutoRow justify={isExpertMode ? 'space-between' : 'center'} style={{ padding: '0 1rem' }}>
        <SwapUI.SwitchButton onClick={onFlip} />
        {allowRecipient && recipient === null ? (
          <Button variant="text" id="add-recipient-button" onClick={() => onChangeRecipient('')}>
            {t('+ Add a send (optional)')}
          </Button>
        ) : null}
      </AutoRow>
    </AutoColumn>
  )
}
