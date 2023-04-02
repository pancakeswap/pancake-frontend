import { ArrowDownIcon, Button } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import { memo } from 'react'

import { useSwapActionHandlers } from 'state/swap/useSwapActionHandlers'
import { useSwapState } from 'state/swap/hooks'
import { AutoRow } from 'components/Layout/Row'

import AddressInputPanel from '../../components/AddressInputPanel'
import { ArrowWrapper } from '../../components/styleds'
import { useAllowRecipient } from '../hooks'

export const Recipient = memo(function Recipient() {
  const { t } = useTranslation()
  const { recipient } = useSwapState()
  const { onChangeRecipient } = useSwapActionHandlers()
  const allowRecipient = useAllowRecipient()

  if (!allowRecipient || recipient === null) {
    return null
  }

  return (
    <>
      <AutoRow justify="space-between" style={{ padding: '0 1rem' }}>
        <ArrowWrapper clickable={false}>
          <ArrowDownIcon width="16px" />
        </ArrowWrapper>
        <Button variant="text" id="remove-recipient-button" onClick={() => onChangeRecipient(null)}>
          {t('- Remove send')}
        </Button>
      </AutoRow>
      <AddressInputPanel id="recipient" value={recipient} onChange={onChangeRecipient} />
    </>
  )
})
