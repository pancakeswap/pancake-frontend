import { useTranslation } from '@pancakeswap/localization'
import { useToast } from '@pancakeswap/uikit'
import { signIn } from 'next-auth/react'
import { SocialHubType } from 'views/Profile/hooks/settingsModal/useUserSocialHub'
import { disconnectSocial } from 'views/Profile/utils/disconnectSocial'
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
      if (account) {
        await disconnectSocial({
          account,
          type: SocialHubType.Twitter,
          callback: () => {
            toastSuccess(t('%social% Disconnected', { social: SocialHubType.Twitter }))
            refresh?.()
          },
        })
      }
    } catch (error) {
      console.error(`Disconnect ${SocialHubType.Twitter} error: `, error)
      toastError(error instanceof Error && error?.message ? error.message : JSON.stringify(error))
    }
  }

  return {
    connect,
    disconnect,
  }
}
