import { useTranslation } from '@pancakeswap/localization'
import { useToast } from '@pancakeswap/uikit'
import { signIn } from 'next-auth/react'
import { encodePacked, keccak256 } from 'viem'
import { SocialHubType } from 'views/Profile/hooks/settingsModal/useUserSocialHub'
import { disconnectSocial, DisconnectUserSocialInfoConfig } from 'views/Profile/utils/disconnectSocial'
import { verifyTwitterFollowersIds } from 'views/Profile/utils/verifyTwitterFollowersIds'
import { useAccount, useSignMessage } from 'wagmi'

interface UseConnectTwitterProps {
  refresh?: () => void
}

export const useConnectTwitter = ({ refresh }: UseConnectTwitterProps) => {
  const { address: account } = useAccount()
  const { t } = useTranslation()
  const { toastSuccess } = useToast()
  const { signMessageAsync } = useSignMessage()

  const connect = async () => {
    signIn('twitter')
  }

  const randomConnect = async () => {
    const randomIndex = Math.floor(Math.random() * verifyTwitterFollowersIds.length)
    signIn(verifyTwitterFollowersIds[randomIndex])
  }

  const disconnect = async () => {
    try {
      if (account) {
        const walletAddress = account
        const timestamp = Math.floor(new Date().getTime() / 1000)
        const message = keccak256(encodePacked(['address', 'uint256'], [walletAddress ?? '0x', BigInt(timestamp)]))
        const signature = await signMessageAsync({ message })

        await disconnectSocial({
          data: {
            userId: walletAddress,
            socialHub: SocialHubType.Twitter,
            signedData: { walletAddress, timestamp },
            signature,
          } as DisconnectUserSocialInfoConfig,
          callback: () => {
            toastSuccess(t('%social% Disconnected', { social: SocialHubType.Twitter }))
            refresh?.()
          },
        })
      }
    } catch (error) {
      console.error(`Disconnect ${SocialHubType.Twitter} error: `, error)
    }
  }

  return {
    connect,
    randomConnect,
    disconnect,
  }
}
