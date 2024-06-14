import { useTranslation } from '@pancakeswap/localization'
import { useToast } from '@pancakeswap/uikit'
import { GAMIFICATION_API } from 'config/constants/endpoints'
import { useEffect } from 'react'
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
      (user: TelegramResponse) => {
        if (user) {
          // Handle the authenticated user information
          // You can send it to your backend server
          console.log(user.id)

          // refresh?.()
        } else {
          // User cancelled authentication, redirect to /profile
          window.location.href = '/profile'
        }
      },
    )
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
            Telegram: '',
          },
        }),
      })

      if (response.ok) {
        toastSuccess(t('Twitter Disconnected'))
        refresh?.()
      }
    } catch (error) {
      console.error('Disconnect telegram error: ', error)
      toastError(error instanceof Error && error?.message ? error.message : JSON.stringify(error))
    }
  }

  return {
    connect,
    disconnect,
  }
}
