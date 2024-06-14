import { useTranslation } from '@pancakeswap/localization'
import { useToast } from '@pancakeswap/uikit'
import { GAMIFICATION_API } from 'config/constants/endpoints'
import { signIn } from 'next-auth/react'
import { useAccount } from 'wagmi'

interface UseConnectTwitterProps {
  refresh: () => void
}

export const useConnectTwitter = ({ refresh }: UseConnectTwitterProps) => {
  const { address: account } = useAccount()
  const { t } = useTranslation()
  const { toastSuccess, toastError } = useToast()

  const connect = async () => {
    signIn('twitter')
  }

  const disconnect = async () => {
    try {
      const response = await fetch(`${GAMIFICATION_API}/userInfo/v1/updateUserInfo`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: account,
          socialHubToSocialUserIdMap: {
            Twitter: '',
          },
        }),
      })

      if (response.ok) {
        toastSuccess(t('Twitter Disconnected'))
        refresh?.()
      }
    } catch (error) {
      console.error('Disconnect twitter error: ', error)
      toastError(error instanceof Error && error?.message ? error.message : JSON.stringify(error))
    }
  }

  return {
    connect,
    disconnect,
  }
}
