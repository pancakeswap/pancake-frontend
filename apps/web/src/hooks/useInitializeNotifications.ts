import { useWeb3InboxAccount, useWeb3InboxClient } from '@web3inbox/react'
import { useMemo } from 'react'
import { useAccount } from 'wagmi'

export const useInitializeNotifications = () => {
  const { address } = useAccount()

  const { data: client } = useWeb3InboxClient()
  const { data: account, isRegistered } = useWeb3InboxAccount(address ? `eip155:1:${address}` : undefined)

  const isReady = useMemo(() => Boolean(client && account), [account, client])

  return { isReady, isRegistered }
}
