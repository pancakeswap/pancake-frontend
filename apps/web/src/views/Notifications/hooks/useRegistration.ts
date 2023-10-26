import { useToast } from '@pancakeswap/uikit'
import { useW3iAccount, useInitWeb3InboxClient } from '@web3inbox/widget-react'
import { useCallback, useEffect } from 'react'
import { DEFAULT_PROJECT_ID, Events } from 'views/Notifications/constants'
import { useAccount, useSignMessage } from 'wagmi'

const useRegistration = () => {
  const { address } = useAccount()
  const { signMessageAsync } = useSignMessage()
  const { register: registerIdentity, identityKey, setAccount } = useW3iAccount()
  const toast = useToast()

  const isW3iInitialized = useInitWeb3InboxClient({
    projectId: DEFAULT_PROJECT_ID,
    domain: 'pc-custom-web-git-main-chefbingbong.vercel.app',
  })

  useEffect(() => {
    if (!address) return
    setAccount(`eip155:1:${address}`)
  }, [address, setAccount])

  const signMessage = useCallback(
    async (message: string) => {
      const res = await signMessageAsync({
        message,
      })

      return res as string
    },
    [signMessageAsync],
  )
  const handleRegistration = useCallback(async () => {
    if (!address) return
    try {
      await registerIdentity(signMessage)
    } catch (registerIdentityError) {
      toast.toastError(Events.SubscriptionRequestError.title, 'User Denied the request')
      console.error({ registerIdentityError })
    }
  }, [signMessage, registerIdentity, address, toast])

  return { handleRegistration, identityKey, address, isW3iInitialized }
}

export default useRegistration
