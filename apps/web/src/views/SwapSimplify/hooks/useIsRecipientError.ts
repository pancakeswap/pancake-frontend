import { useDebounce } from '@pancakeswap/hooks'
import { useGetENSAddressByName } from 'hooks/useGetENSAddressByName'
import { useMemo } from 'react'
import { useSwapState } from 'state/swap/hooks'
import { safeGetAddress } from 'utils'
import { useAllowRecipient } from '../../Swap/V3Swap/hooks'

export const useIsRecipientError = () => {
  const { recipient } = useSwapState()
  const allowRecipient = useAllowRecipient()
  const debounceEnsName = useDebounce(recipient, 500)
  const recipientENSAddress = useGetENSAddressByName(debounceEnsName ?? undefined)

  const isRecipientError = useMemo(() => {
    if (!allowRecipient || recipient === null) return false
    const address = safeGetAddress(recipient) ? recipient : safeGetAddress(recipientENSAddress)
    return Boolean(recipient.length > 0 && !address)
  }, [recipient, allowRecipient, recipientENSAddress])

  const isRecipientEmpty = useMemo(() => {
    if (!allowRecipient || recipient === null) return false
    return recipient.length === 0
  }, [allowRecipient, recipient])

  return { isRecipientError, isRecipientEmpty }
}
