import { useEffect } from 'react'

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

  return {
    connect,
  }
}
