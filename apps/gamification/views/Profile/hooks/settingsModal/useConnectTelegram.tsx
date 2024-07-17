import { useTranslation } from '@pancakeswap/localization'
import { useToast } from '@pancakeswap/uikit'
import CryptoJS from 'crypto-js'
import { useEffect } from 'react'
import { SocialHubType, UserInfo } from 'views/Profile/hooks/settingsModal/useUserSocialHub'
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
  userInfo: UserInfo
  refresh: () => void
}

export const useConnectTelegram = ({ userInfo, refresh }: UseConnectTelegramProps) => {
  const { address: account } = useAccount()
  const { t } = useTranslation()
  const { toastSuccess, toastError } = useToast()

  const validateAuth = async (authData: any) => {
    const { auth_date: authDate, first_name: firstName, hash, id, username } = authData as any
    // Step 1: Create data_check_string
    const dataCheckString = `auth_date=${authDate}\nfirst_name=${firstName}\nid=${id}\nusername=${username}`

    // Step 2: Generate secret_key
    const secretKey = CryptoJS.SHA256(process.env.NEXT_PUBLIC_TELEGRAM_BOT_TOKEN).toString(CryptoJS.enc.Hex)

    // Step 3: Generate HMAC-SHA-256 signature
    const hmac = CryptoJS.HmacSHA256(dataCheckString, secretKey).toString(CryptoJS.enc.Hex)

    // Step 4: Compare the generated HMAC with the received hash
    if (hmac === hash) {
      console.log('Data is from Telegram')
    } else {
      console.log('Data validation failed')
    }

    // Step 5: Verify the timestamp to prevent outdated data usage
    const currentTime = Math.floor(Date.now() / 1000)
    const timeDiff = currentTime - authDate
    const maxTimeDiff = 86400 // 24 hours in seconds

    if (timeDiff > maxTimeDiff) {
      console.log('Auth data is outdated')
    } else {
      console.log('Auth data is within valid time frame')
    }
  }

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
            console.log(user)
            validateAuth(user)
            await connectSocial({
              account,
              userInfo,
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
          userInfo,
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
