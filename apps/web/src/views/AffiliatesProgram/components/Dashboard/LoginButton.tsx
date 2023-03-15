import { useState, useMemo } from 'react'
import { SiweMessage } from 'siwe'
import { useSWRConfig } from 'swr'
import { useAccount, useSignMessage } from 'wagmi'
import { getCookie, deleteCookie, setCookie } from 'cookies-next'
import { Button } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { AFFILIATE_SID, AFFILIATE_NONCE_SID } from 'pages/api/affiliates-program/affiliate-login'

const LoginButton = () => {
  const { t } = useTranslation()
  const { address } = useAccount()
  const { mutate } = useSWRConfig()
  const { signMessageAsync } = useSignMessage()
  const { chainId } = useActiveChainId()
  const [isLoading, setIsLoading] = useState(false)
  const cookie = getCookie(AFFILIATE_SID)

  const isReady = useMemo(() => address && chainId && !isLoading, [isLoading, address, chainId])

  const handleLogin = async () => {
    try {
      setIsLoading(true)
      const nonceResponse = await fetch('/api/affiliates-program/affiliate-nonce')
      const { nonce, [AFFILIATE_NONCE_SID]: affiliateNonceSid } = await nonceResponse.json()

      if (affiliateNonceSid) {
        setCookie(AFFILIATE_NONCE_SID, affiliateNonceSid)

        const initMessage = new SiweMessage({
          domain: 'Pancakeswap',
          address,
          uri: 'http://pancakeswap.finance',
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
        const { status, [AFFILIATE_SID]: AdminSid } = await response.json()

        if (status === 'success' && AdminSid) {
          deleteCookie(AFFILIATE_NONCE_SID)
          setCookie(AFFILIATE_SID, AdminSid)
          await mutate(['/auth-affiliate', address, cookie])
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
