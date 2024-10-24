import { memo } from 'react'

import { useSwapState } from 'state/swap/hooks'
import { useSwapActionHandlers } from 'state/swap/useSwapActionHandlers'

import { useAllowRecipient } from '../../Swap/V3Swap/hooks'
import AddressInputPanel from './AddressInputPanel'

export const Recipient = memo(function Recipient() {
  const { recipient } = useSwapState()
  const { onChangeRecipient } = useSwapActionHandlers()
  const allowRecipient = useAllowRecipient()

  if (!allowRecipient || recipient === null) {
    return null
  }

  return <AddressInputPanel id="recipient" value={recipient} onChange={onChangeRecipient} />
})
