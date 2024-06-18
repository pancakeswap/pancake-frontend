import { useTranslation } from '@pancakeswap/localization'
import { useToast } from '@pancakeswap/uikit'
import { signIn } from 'next-auth/react'
import { SocialHubType } from 'views/Profile/hooks/settingsModal/useUserSocialHub'
import { disconnectSocial } from 'views/Profile/utils/disconnectSocial'
import { useAccount } from 'wagmi'

interface UseConnectDiscordProps {
  refresh: () => void
}

export const useConnectDiscord = ({ refresh }: UseConnectDiscordProps) => {
  const { address: account } = useAccount()
  const { t } = useTranslation()
  const { toastSuccess, toastError } = useToast()

  const connect = () => {
    signIn('discord')
  }

  const disconnect = async () => {
    try {
      if (account) {
        await disconnectSocial({
          account,
          type: SocialHubType.Discord,
          callback: () => {
            toastSuccess(t('%social% Disconnected', { social: SocialHubType.Discord }))
            refresh?.()
          },
        })
      }
    } catch (error) {
      console.error(`Disconnect ${SocialHubType.Discord} error: `, error)
      toastError(error instanceof Error && error?.message ? error.message : JSON.stringify(error))
    }
  }

  return {
    connect,
    disconnect,
  }
}
