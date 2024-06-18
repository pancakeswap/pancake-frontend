import { useTranslation } from '@pancakeswap/localization'
import { useToast } from '@pancakeswap/uikit'
import { useEffect } from 'react'
import { SocialHubType } from 'views/Profile/hooks/settingsModal/useUserSocialHub'
import { connectSocial } from 'views/Profile/utils/connectSocial'
import { disconnectSocial } from 'views/Profile/utils/disconnectSocial'
import { useAccount } from 'wagmi'

interface TelegramResponse {
  auth_date: number
  first_name: string
  hash: string
  id: number
  username: string
}

// const YOUR_BOT_TOKEN = get from telegram
// https://api.telegram.org/botYOUR_BOT_TOKEN/getMe

interface UseConnectTelegramProps {
  refresh: () => void
}

export const useConnectTelegram = ({ refresh }: UseConnectTelegramProps) => {
  const { address: account } = useAccount()
  const { t } = useTranslation()
  const { toastSuccess, toastError } = useToast()

  useEffect(() => {
    // Load the Telegram Login Widget script
    const script = document.createElement('script')
    script.src = 'https://telegram.org/js/telegram-widget.js?22'
    script.async = true
    document.body.appendChild(script)

    return () => {
      document.body.removeChild(script)
    }
  }, [])

  const connect = () => {
    // Telegram login button click handler
    window.Telegram.Login.auth(
      {
        bot_id: process.env.NEXT_PUBLIC_TELEGRAM_BOT_TOKEN, // Replace with your bot's ID
        request_access: true,
      },
      async (user: TelegramResponse) => {
        if (user && account) {
          try {
            await connectSocial({
              account,
              id: user.id.toString(),
              type: SocialHubType.Telegram,
              callback: () => {
                toastSuccess(t('%social% Connected', { social: SocialHubType.Telegram }))
                refresh?.()
              },
            })
          } catch (error) {
            console.error(`Connect ${SocialHubType.Telegram} error: `, error)
            toastError(error instanceof Error && error?.message ? error.message : JSON.stringify(error))
          }
        } else {
          // User cancelled authentication, redirect to /profile
          window.location.href = '/profile'
        }
      },
    )
  }

  const disconnect = async () => {
    try {
      if (account) {
        await disconnectSocial({
          account,
          type: SocialHubType.Telegram,
          callback: () => {
            toastSuccess(t('%social% Disconnected', { social: SocialHubType.Telegram }))
            refresh?.()
          },
        })
      }
    } catch (error) {
      console.error(`Disconnect ${SocialHubType.Telegram} error: `, error)
      toastError(error instanceof Error && error?.message ? error.message : JSON.stringify(error))
    }
  }

  return {
    connect,
    disconnect,
  }
}
