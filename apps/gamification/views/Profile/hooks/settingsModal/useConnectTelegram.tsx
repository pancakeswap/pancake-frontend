import { useTranslation } from '@pancakeswap/localization'
import { useToast } from '@pancakeswap/uikit'
import { useSiwe } from 'hooks/useSiwe'
import { useEffect } from 'react'
import { encodePacked, keccak256 } from 'viem'
import { SocialHubType, UserInfo } from 'views/Profile/hooks/settingsModal/useUserSocialHub'
import { connectSocial, VerificationTelegramConfig } from 'views/Profile/utils/connectSocial'
import { disconnectSocial, DisconnectUserSocialInfoConfig } from 'views/Profile/utils/disconnectSocial'
import { useAccount, useSignMessage } from 'wagmi'

interface TelegramResponse {
  auth_date: number
  first_name: string
  hash: string
  id: number
  username: string
  photo_url?: string // Add photo_url to the interface
}

// const YOUR_BOT_TOKEN = get from telegram
// https://api.telegram.org/botYOUR_BOT_TOKEN/getMe

interface UseConnectTelegramProps {
  userInfo: UserInfo
  refresh: () => void
}

export const useConnectTelegram = ({ userInfo, refresh }: UseConnectTelegramProps) => {
  const { address: account, connector } = useAccount()
  const { t } = useTranslation()
  const { toastSuccess, toastError } = useToast()
  const { signMessageAsync } = useSignMessage()
  const { fetchWithSiweAuth } = useSiwe()

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
        if (user && account && connector && typeof connector.getChainId === 'function') {
          try {
            const walletAddress = account
            const timestamp = Math.floor(new Date().getTime() / 1000)
            const message = keccak256(encodePacked(['address', 'uint256'], [walletAddress ?? '0x', BigInt(timestamp)]))
            const signature = await signMessageAsync({ message })

            await connectSocial({
              userInfo,
              data: {
                socialMedia: SocialHubType.Telegram,
                userId: walletAddress,
                signedData: { walletAddress, timestamp },
                verificationData: {
                  ...user,
                } as unknown as VerificationTelegramConfig,
                signature,
              },
              fetchWithSiweAuth,
              callback: () => {
                toastSuccess(t('%social% Connected', { social: SocialHubType.Telegram }))
                refresh?.()
              },
            })
          } catch (error) {
            console.error(`Connect ${SocialHubType.Telegram} error: `, error)
            toastError(
              `Failed to connect ${SocialHubType.Telegram}: ${
                error instanceof Error && error?.message ? error.message : JSON.stringify(error)
              }`,
            )
          }
        }
      },
    )
  }

  const disconnect = async () => {
    try {
      if (account && connector && typeof connector.getChainId === 'function') {
        const walletAddress = account
        const timestamp = Math.floor(new Date().getTime() / 1000)
        const message = keccak256(encodePacked(['address', 'uint256'], [walletAddress ?? '0x', BigInt(timestamp)]))
        const signature = await signMessageAsync({ message })

        await disconnectSocial({
          data: {
            userId: walletAddress,
            socialHub: SocialHubType.Telegram,
            signedData: { walletAddress, timestamp },
            signature,
          } as DisconnectUserSocialInfoConfig,
          fetchWithSiweAuth,
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
