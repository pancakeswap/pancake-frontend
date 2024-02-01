import { useState, useMemo } from 'react'
import { SiweMessage } from 'siwe'
import { useAccount } from 'wagmi'
import { useSignMessage } from '@pancakeswap/wagmi'
import { Button } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { useQueryClient } from '@tanstack/react-query'

const LoginButton = () => {
  const { t } = useTranslation()
  const { address } = useAccount()
  const queryClient = useQueryClient()
  const { signMessageAsync } = useSignMessage()
  const { chainId } = useActiveChainId()
  const [isLoading, setIsLoading] = useState(false)

  const isReady = useMemo(() => address && chainId && !isLoading, [isLoading, address, chainId])

  const handleLogin = async () => {
    try {
      setIsLoading(true)
      const nonceResponse = await fetch('/api/affiliates-program/affiliate-nonce')
      const { nonce } = await nonceResponse.json()

      if (nonce) {
        const initMessage = new SiweMessage({
          domain: window.location.host,
          address,
          uri: window.location.origin,
          version: '1',
          chainId,
          nonce,
        })
        const message = initMessage.prepareMessage()
        const signature = await signMessageAsync({ message })

        const response = await fetch('/api/affiliates-program/affiliate-login', {
          method: 'POST',
          body: JSON.stringify({ affiliate: { message, signature } }),
        })
        const { status } = await response.json()

        if (status === 'success') {
          await queryClient.invalidateQueries({
            queryKey: ['affiliates-program', 'auth-affiliate', address],
          })
        }
      }
    } catch (error) {
      console.error(`Submit Dashboard Login Error: ${error}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button display="block" m="40px auto" width={180} disabled={!isReady} onClick={handleLogin}>
      {t('Login')}
    </Button>
  )
}

export default LoginButton
