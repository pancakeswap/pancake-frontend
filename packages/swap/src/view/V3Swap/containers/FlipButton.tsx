import { AutoColumn, AutoRow, Button } from '@pancakeswap/uikit'
import { Swap as SwapUI } from '@pancakeswap/widgets-internal'

import React, { useCallback, memo } from 'react'
import replaceBrowserHistory from '@pancakeswap/utils/replaceBrowserHistory'
import { useTranslation } from '@pancakeswap/localization'

import { useExpertMode } from '@pancakeswap/utils/user'

import { useAllowRecipient } from '../hooks'
import { Field } from '../../../state/actions'
import { useSwapState } from '../../../state/hooks'
import { useSwapActionHandlers } from '../../../state/useSwapActionHandlers'

export const FlipButton = memo(function FlipButton() {
  const { t } = useTranslation()
  const [isExpertMode] = useExpertMode()
  const { onSwitchTokens, onChangeRecipient } = useSwapActionHandlers()
  const {
    recipient,
    [Field.INPUT]: { currencyId: inputCurrencyId },
    [Field.OUTPUT]: { currencyId: outputCurrencyId },
  } = useSwapState()
  const allowRecipient = useAllowRecipient()

  const onFlip = useCallback(() => {
    onSwitchTokens()
    replaceBrowserHistory('inputCurrency', outputCurrencyId)
    replaceBrowserHistory('outputCurrency', inputCurrencyId)
  }, [onSwitchTokens, inputCurrencyId, outputCurrencyId])

  return (
    <AutoColumn justify="space-between">
      <AutoRow
        justifyContent={isExpertMode ? 'space-between' : 'center'}
        style={{ padding: '0 1rem', marginTop: '1em' }}
      >
        <SwapUI.SwitchButton onClick={onFlip} />
        {allowRecipient && recipient === null ? (
          <Button
            variant="text"
            id="add-recipient-button"
            onClick={() => onChangeRecipient('')}
            data-dd-action-name="Swap flip button"
          >
            {t('+ Add a send (optional)')}
          </Button>
        ) : null}
      </AutoRow>
    </AutoColumn>
  )
})
