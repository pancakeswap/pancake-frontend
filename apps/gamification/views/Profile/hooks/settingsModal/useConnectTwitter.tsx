import { useTranslation } from '@pancakeswap/localization'
import { useToast } from '@pancakeswap/uikit'
import { useSiwe } from 'hooks/useSiwe'
import { signIn } from 'next-auth/react'
import { encodePacked, keccak256 } from 'viem'
import { TaskType } from 'views/DashboardQuestEdit/type'
import { SocialHubType } from 'views/Profile/hooks/settingsModal/useUserSocialHub'
import { disconnectSocial, DisconnectUserSocialInfoConfig } from 'views/Profile/utils/disconnectSocial'
import { verifyTwitterFollowersIds } from 'views/Profile/utils/verifyTwitterFollowersIds'
import { useAccount, useSignMessage } from 'wagmi'

interface UseConnectTwitterProps {
  refresh?: () => void
}

type ActionType = TaskType.X_LIKE_POST | TaskType.X_FOLLOW_ACCOUNT | TaskType.X_REPOST_POST

type ActionAfterConnect = {
  taskId?: string
  action: ActionType
}

const ACTION_SERIALIZER_SEPARATOR = '__'

export function serializeAction({ action, taskId }: ActionAfterConnect): string {
  return [taskId, action].join(ACTION_SERIALIZER_SEPARATOR)
}

export function parseAction(serializedAction: string): ActionAfterConnect | undefined {
  const [taskId, action] = serializedAction.split(ACTION_SERIALIZER_SEPARATOR)
  if (!taskId || !action) {
    return undefined
  }

  return {
    taskId,
    action: action as ActionType,
  }
}

const getCallbackUrl = (callbackUrl: string, action?: ActionAfterConnect) => {
  if (!action) return callbackUrl
  const url = new URL(callbackUrl)

  url.searchParams.set('action', serializeAction(action))
  return url.toString()
}

export const useConnectTwitter = ({ refresh }: UseConnectTwitterProps) => {
  const { address: account, connector } = useAccount()
  const { t } = useTranslation()
  const { toastSuccess } = useToast()
  const { signMessageAsync } = useSignMessage()
  const { fetchWithSiweAuth } = useSiwe()

  const connect = async () => {
    signIn('twitter')
  }

  const randomConnect = async (action?: ActionAfterConnect) => {
    const randomIndex = Math.floor(Math.random() * verifyTwitterFollowersIds.length)
    signIn(verifyTwitterFollowersIds[randomIndex], {
      callbackUrl: getCallbackUrl(window.location.href, action),
    })
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
            socialHub: SocialHubType.Twitter,
            signedData: { walletAddress, timestamp },
            signature,
          } as DisconnectUserSocialInfoConfig,
          fetchWithSiweAuth,
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
