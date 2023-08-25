import { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { disconnect as wagmiDisconnect } from 'wagmi/actions'
import type PushClientProxy from 'PushNotificationClient'
import type InternalAuthProvider from 'PushNotificationClient/internalAuthProvider'

export const useAuthState = (w3iProxy: PushClientProxy, proxyReady: boolean) => {
  const [accountQueryParam, setAccountQueryParam] = useState('')
  const [userPubkey, setUserPubkey] = useState<string | undefined>(undefined)
  const [authClient, setAuthClient] = useState<InternalAuthProvider | null>(null)

  //   console.log(getAccount().address)

  useEffect(() => {
    if (proxyReady) {
      setAuthClient(w3iProxy.auth)
    }
  }, [w3iProxy, proxyReady])

  const router = useRouter()

  const disconnect = useCallback(() => {
    setUserPubkey(undefined)
    wagmiDisconnect()
  }, [setUserPubkey])

  useEffect(() => {
    const account = new URLSearchParams(router.asPath.split('?')[1]).get('account')

    if (account) {
      setAccountQueryParam(account)
    }
  }, [router.asPath])

  useEffect(() => {
    if (accountQueryParam && authClient) {
      authClient.setAccount(accountQueryParam)
    }
  }, [accountQueryParam, authClient])

  useEffect(() => {
    const account = authClient?.getAccount()
    if (account) {
      setUserPubkey(account)
    }
  }, [authClient])

  useEffect(() => {
    if (!authClient) return () => null
    authClient?.emitter.on('auth_set_account', ({ account }) => setUserPubkey(account))

    return () => authClient?.emitter.off('auth_set_account', ({ account }) => setUserPubkey(account))
  }, [authClient])

  return { userPubkey, setUserPubkey, disconnect }
}
