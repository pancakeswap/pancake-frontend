import { AutoColumn, Button } from '@pancakeswap/uikit'
import { SwapUIV2 } from '@pancakeswap/widgets-internal'

import { useTranslation } from '@pancakeswap/localization'
import replaceBrowserHistory from '@pancakeswap/utils/replaceBrowserHistory'
import { memo, useCallback } from 'react'

import { AutoRow } from 'components/Layout/Row'
import { Field } from 'state/swap/actions'
import { useSwapState } from 'state/swap/hooks'
import { useSwapActionHandlers } from 'state/swap/useSwapActionHandlers'
import { styled } from 'styled-components'

import { useAllowRecipient } from '../../Swap/V3Swap/hooks'

export const Line = styled.div`
  position: absolute;
  left: -16px;
  right: -16px;
  height: 1px;
  background-color: ${({ theme }) => theme.colors.cardBorder};
  top: calc(50% + 6px);
`

export const FlipButton = memo(function FlipButton() {
  const { onSwitchTokens } = useSwapActionHandlers()
  const {
    [Field.INPUT]: { currencyId: inputCurrencyId },
    [Field.OUTPUT]: { currencyId: outputCurrencyId },
  } = useSwapState()

  const onFlip = useCallback(() => {
    onSwitchTokens()
    replaceBrowserHistory('inputCurrency', outputCurrencyId)
    replaceBrowserHistory('outputCurrency', inputCurrencyId)
  }, [onSwitchTokens, inputCurrencyId, outputCurrencyId])

  return (
    <AutoColumn justify="space-between" position="relative">
      <Line />
      <AutoRow justify="center" style={{ padding: '0 1rem', marginTop: '1em' }}>
        <SwapUIV2.SwitchButtonV2 onClick={onFlip} />
      </AutoRow>
    </AutoColumn>
  )
})

export const AssignRecipientButton: React.FC = memo(() => {
  const { t } = useTranslation()
  const { recipient } = useSwapState()
  const { onChangeRecipient } = useSwapActionHandlers()
  const allowRecipient = useAllowRecipient()
  if (!allowRecipient || recipient !== null) return null
  return (
    <Button
      variant="text"
      id="add-recipient-button"
      onClick={() => onChangeRecipient('')}
      data-dd-action-name="Swap flip button"
      width="100%"
    >
      {t('+ Assign Recipient')}
    </Button>
  )
})
