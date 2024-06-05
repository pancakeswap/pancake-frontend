import { useEffect } from 'react'

declare global {
  interface Window {
    onTelegramAuth?: any
  }
}

const YOUR_BOT_USERNAME = 'pancakeswap_testnet_bot'
const YOUR_CALLBACK_URL = 'https://gamification-git-pan-2650-gamification.pancake.run/api/auth/telegram'

export const useConnectTwitter = () => {
  useEffect(() => {
    // Define a global callback function
    window.onTelegramAuth = (user) => {
      console.log(user)
      // Here you can handle the authenticated user information
      // For example, you can send it to your backend server
    }

    // Dynamically add the Telegram Login Widget script
    const script = document.createElement('script')
    script.src = 'https://telegram.org/js/telegram-widget.js?22'
    script.setAttribute('data-telegram-login', YOUR_BOT_USERNAME) // Replace with your bot's username
    script.setAttribute('data-size', 'large')
    script.setAttribute('data-auth-url', YOUR_CALLBACK_URL) // Replace with your callback URL
    script.setAttribute('data-request-access', 'write')
    script.async = true
    ;(document as any).getElementById('telegram-login-container').appendChild(script)
  }, [])

  const connect = () => {}

  return {
    connect,
  }
}
