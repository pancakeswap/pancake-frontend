import { useW3iAccount } from '@web3inbox/widget-react'
import { useCallback, useEffect } from 'react'
import { useAccount, useSignMessage } from 'wagmi'

const useRegistration = () => {
  const { address } = useAccount()
  const { signMessageAsync } = useSignMessage()
  const { account, register: registerIdentity, identityKey, setAccount } = useW3iAccount()

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
    if (!account) return
    try {
      await registerIdentity(signMessage)
    } catch (registerIdentityError) {
      console.error({ registerIdentityError })
    }
  }, [signMessage, registerIdentity, account])

  return { handleRegistration, identityKey, account, setAccount }
}

export default useRegistration
