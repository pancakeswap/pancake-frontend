import { useTranslation } from '@pancakeswap/localization'
import { useToast } from '@pancakeswap/uikit'
import { useSiwe } from 'hooks/useSiwe'
import { signIn } from 'next-auth/react'
import { encodePacked, keccak256 } from 'viem'
import { SocialHubType } from 'views/Profile/hooks/settingsModal/useUserSocialHub'
import { disconnectSocial, DisconnectUserSocialInfoConfig } from 'views/Profile/utils/disconnectSocial'
import { useAccount, useSignMessage } from 'wagmi'

interface UseConnectDiscordProps {
  refresh: () => void
}

export const useConnectDiscord = ({ refresh }: UseConnectDiscordProps) => {
  const { address: account, connector } = useAccount()
  const { t } = useTranslation()
  const { toastSuccess } = useToast()
  const { fetchWithSiweAuth } = useSiwe()
  const { signMessageAsync } = useSignMessage()

  const connect = () => {
    signIn('discord')
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
            socialHub: SocialHubType.Discord,
            signedData: { walletAddress, timestamp },
            signature,
          } as DisconnectUserSocialInfoConfig,
          fetchWithSiweAuth,
          callback: () => {
            toastSuccess(t('%social% Disconnected', { social: SocialHubType.Discord }))
            refresh?.()
          },
        })
      }
    } catch (error) {
      console.error(`Disconnect ${SocialHubType.Discord} error: `, error)
    }
  }

  return {
    connect,
    disconnect,
  }
}
