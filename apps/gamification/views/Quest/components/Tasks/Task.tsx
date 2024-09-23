import { useTranslation } from '@pancakeswap/localization'
import { Native } from '@pancakeswap/sdk'
import {
  Box,
  Button,
  Card,
  CheckmarkCircleFillIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  ErrorFillIcon,
  Flex,
  FlexGap,
  Loading,
  OpenNewIcon,
  RefreshIcon,
  Text,
  useModal,
  useToast,
} from '@pancakeswap/uikit'
import { updateQuery } from '@pancakeswap/utils/clientRouter'
import { CHAIN_QUERY_NAME } from 'config/chains'
import { useDebounceCallback } from 'hooks/useDebouncedCallback'
import { useSiwe } from 'hooks/useSiwe'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { styled } from 'styled-components'
import { StyledOptionIcon } from 'views/DashboardQuestEdit/components/Tasks/StyledOptionIcon'
import {
  TaskBlogPostConfig,
  TaskConfigType,
  TaskHoldTokenConfig,
  TaskLiquidityConfig,
  TaskMakePredictionConfig,
  TaskSocialConfig,
  TaskSwapConfig,
} from 'views/DashboardQuestEdit/context/types'
import { useTaskInfo } from 'views/DashboardQuestEdit/hooks/useTaskInfo'
import { TaskType } from 'views/DashboardQuestEdit/type'
import { parseAction, useConnectTwitter } from 'views/Profile/hooks/settingsModal/useConnectTwitter'
import { useUserSocialHub } from 'views/Profile/hooks/settingsModal/useUserSocialHub'
import { TwitterFollowersId } from 'views/Profile/utils/verifyTwitterFollowersIds'
import { ConnectSocialAccountModal } from 'views/Quest/components/Tasks/ConnectSocialAccountModal'
import { VerifyTaskStatus } from 'views/Quest/hooks/useVerifyTaskStatus'
import { useAccount } from 'wagmi'
import { ADDRESS_ZERO } from '../../../../../../packages/v3-sdk/dist'

const VerifyButton = styled(Button)`
  background-color: ${({ theme }) => theme.colors.secondary};
`

interface TaskProps {
  questId: string
  task: TaskConfigType
  hasIdRegister: boolean
  taskStatus: VerifyTaskStatus
  isQuestFinished: boolean
  refresh: () => void
}

export const Task: React.FC<TaskProps> = ({ questId, task, taskStatus, hasIdRegister, isQuestFinished, refresh }) => {
  const { asPath, replace } = useRouter()
  const { t } = useTranslation()
  const { toastError } = useToast()
  const { address: account } = useAccount()
  const { data: session, status } = useSession()
  const { query } = useRouter()
  const { taskType, title, description } = task
  const isVerified = useMemo(
    () => taskStatus.taskStatus.find((i) => i.taskId === task.id)?.completionStatus,
    [task, taskStatus],
  )
  const { taskIcon, taskNaming, userActionButtonText } = useTaskInfo(false, 22)
  const { userInfo, isFetched: isSocialHubFetched } = useUserSocialHub()
  const { randomConnect: connectTwitter } = useConnectTwitter({})
  const [socialName, setSocialName] = useState('')
  const [isPending, setIsPending] = useState(false)
  const [actionPanelExpanded, setActionPanelExpanded] = useState(false)
  const { fetchWithSiweAuth } = useSiwe()
  const [isError, setIsError] = useState(false)

  const twitterId = userInfo?.socialHubToSocialUserIdMap?.Twitter ?? ''

  const handleVerifyTwitterAccount = useDebounceCallback(
    async ({ providerId, token, tokenSecret }: { providerId?: string; token?: string; tokenSecret?: string }) => {
      if (isPending || !hasIdRegister || !account || !twitterId) {
        return
      }

      if (providerId && token && tokenSecret) {
        try {
          setIsPending(true)
          setActionPanelExpanded(false)
          const queryString = new URLSearchParams({
            account,
            questId,
            token,
            tokenSecret,
            userId: twitterId,
            providerId: providerId as TwitterFollowersId,
            targetUserId: (task as TaskSocialConfig).accountId.trim(),
            taskId: task?.id ?? '',
          }).toString()
          const response = await fetchWithSiweAuth(`/api/task/twitterFollow?${queryString}`)
          if (response.ok) {
            await refresh()
          } else {
            setIsError(true)
            const { message } = await response.json()
            throw new Error(message)
          }
        } catch (error) {
          setIsError(true)
          toastError(`Verify Twitter Followed Fail: ${error}`)
        } finally {
          setIsPending(false)
        }
      }
    },
    500,
  )

  const handleVerifyTwitterAccountLike = useDebounceCallback(
    async ({ providerId, token, tokenSecret }: { providerId?: string; token?: string; tokenSecret?: string }) => {
      if (isPending || !hasIdRegister || !account || !twitterId) {
        return
      }

      if (providerId && token && tokenSecret) {
        try {
          setIsPending(true)
          setActionPanelExpanded(false)
          const queryString = new URLSearchParams({
            account,
            questId,
            token,
            tokenSecret,
            userId: twitterId,
            taskId: task?.id ?? '',
            providerId: providerId as TwitterFollowersId,
            twitterPostId: (task as TaskSocialConfig).accountId.trim(),
          }).toString()
          const response = await fetchWithSiweAuth(`/api/task/twitterLiked?${queryString}`)
          if (response.ok) {
            await refresh()
          } else {
            const { message } = await response.json()
            setIsError(true)
            throw new Error(message)
          }
        } catch (error) {
          setIsError(true)
          toastError(`Verify Twitter Liked Fail: ${error}`)
        } finally {
          setIsPending(false)
        }
      }
    },
    500,
  )

  const handleVerifyTwitterAccountRetweet = useDebounceCallback(
    async ({ providerId, token, tokenSecret }: { providerId?: string; token?: string; tokenSecret?: string }) => {
      if (isPending || !hasIdRegister || !account || !twitterId) {
        return
      }

      if (providerId && token && tokenSecret) {
        try {
          setIsPending(true)
          setActionPanelExpanded(false)
          const queryString = new URLSearchParams({
            account,
            questId,
            token,
            tokenSecret,
            userId: twitterId,
            taskId: task?.id ?? '',
            providerId: providerId as TwitterFollowersId,
            twitterPostId: (task as TaskSocialConfig).accountId.trim(),
          }).toString()
          const response = await fetchWithSiweAuth(`/api/task/twitterRetweet?${queryString}`)
          if (response.ok) {
            await refresh()
          } else {
            setIsError(true)
            const { message } = await response.json()
            throw new Error(message)
          }
        } catch (error) {
          setIsError(true)
          toastError(`Verify Twitter Retweet Fail: ${error}`)
        } finally {
          setIsPending(false)
        }
      }
    },
    500,
  )

  // eslint-disable-next-line consistent-return
  async function handleTwitterActions(
    action: TaskType,
    { providerId, token, tokenSecret }: { providerId: string; token: string; tokenSecret: string },
  ): Promise<any | void> {
    const connectedTwitterAccount = userInfo.socialHubToSocialUserIdMap?.Twitter
    const isCorrectTwitterAccount = () =>
      connectedTwitterAccount && (session as any).user.twitter.twitterId === connectedTwitterAccount

    setIsError(false)
    switch (action) {
      case TaskType.X_LIKE_POST:
        if (isCorrectTwitterAccount()) {
          return handleVerifyTwitterAccountLike({
            providerId,
            token,
            tokenSecret,
          })
        }
        break
      case TaskType.X_FOLLOW_ACCOUNT:
        if (isCorrectTwitterAccount()) {
          return handleVerifyTwitterAccount({
            providerId: (session as any)?.user?.twitter?.providerId,
            token: (session as any)?.user?.twitter?.token,
            tokenSecret: (session as any)?.user?.twitter?.tokenSecret,
          })
        }
        break
      case TaskType.X_REPOST_POST:
        if (isCorrectTwitterAccount()) {
          return handleVerifyTwitterAccountRetweet({
            providerId: (session as any)?.user?.twitter?.providerId,
            token: (session as any)?.user?.twitter?.token,
            tokenSecret: (session as any)?.user?.twitter?.tokenSecret,
          })
        }
        break
      default:
        break
    }
  }

  useEffect(() => {
    if (status !== 'authenticated' || !isSocialHubFetched) {
      return
    }
    if (!session?.expires || new Date(session.expires).getTime() <= new Date().getTime()) {
      return
    }
    const parsedAction = parseAction(Array.isArray(query.action) ? query.action[0] : query.action ?? '')
    if (!parsedAction || task.id !== parsedAction.taskId) {
      return
    }
    const newPath = updateQuery(asPath, { action: undefined })
    replace(newPath, undefined, {
      shallow: true,
    })
    handleTwitterActions(parsedAction.action, {
      providerId: (session as any)?.user?.twitter?.providerId,
      token: (session as any)?.user?.twitter?.token,
      tokenSecret: (session as any)?.user?.twitter?.tokenSecret,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, isSocialHubFetched])

  const [onPresentConnectSocialAccountModal] = useModal(<ConnectSocialAccountModal socialName={socialName} />)

  const isUserConnectSocialConnected = useMemo(() => {
    switch (taskType as TaskType) {
      case TaskType.YOUTUBE_SUBSCRIBE:
        setSocialName('Youtube')
        return Boolean(userInfo.socialHubToSocialUserIdMap?.Youtube)
      case TaskType.TELEGRAM_JOIN_GROUP:
        setSocialName('Telegram')
        return Boolean(userInfo.socialHubToSocialUserIdMap?.Telegram)
      case TaskType.DISCORD_JOIN_SERVER:
        setSocialName('Discord')
        return Boolean(userInfo.socialHubToSocialUserIdMap?.Discord)
      case TaskType.IG_COMMENT_POST:
      case TaskType.IG_LIKE_POST:
      case TaskType.IG_FOLLOW_ACCOUNT:
        setSocialName('Instagram')
        return Boolean(userInfo.socialHubToSocialUserIdMap?.Instagram)
      case TaskType.X_FOLLOW_ACCOUNT:
      case TaskType.X_LIKE_POST:
      case TaskType.X_REPOST_POST:
        setSocialName('X')
        return Boolean(userInfo.socialHubToSocialUserIdMap?.Twitter)
      default:
        return true
    }
  }, [taskType, userInfo.socialHubToSocialUserIdMap])

  const toggleActionPanel = useCallback(() => {
    if (isQuestFinished) {
      toastError(t('This quest has expired.'))
    } else if (!isUserConnectSocialConnected) {
      onPresentConnectSocialAccountModal()
    } else {
      setActionPanelExpanded(!actionPanelExpanded)
    }
  }, [
    isQuestFinished,
    actionPanelExpanded,
    isUserConnectSocialConnected,
    t,
    toastError,
    onPresentConnectSocialAccountModal,
  ])

  const handleAddBlogPost = async () => {
    const queryString = new URLSearchParams({
      account: account ?? '',
      questId,
      taskId: task?.id ?? '',
      taskName: TaskType.VISIT_BLOG_POST,
    }).toString()
    const response = await fetchWithSiweAuth(`/api/task/completeVisitingWebTask?${queryString}`, {
      method: 'POST',
    })

    if (response.ok) {
      const url = (task as TaskBlogPostConfig).blogUrl
      window.open(url, '_blank', 'noopener noreferrer')
      refresh()
    }
  }

  const handleSocial = () => {
    const url = (task as TaskSocialConfig).socialLink
    window.open(url, '_blank', 'noopener noreferrer')
  }

  const handleRedirectSwap = () => {
    const { network, tokenAddress } = task as TaskSwapConfig | TaskHoldTokenConfig
    if (network && tokenAddress) {
      const nativeToken = Native.onChain(network)
      const isNativeToken = ADDRESS_ZERO.toLowerCase() === tokenAddress.toLowerCase()

      const url = isNativeToken
        ? `https://pancakeswap.finance/swap?chain=${CHAIN_QUERY_NAME[network]}&persistChain=${network}&outputCurrency=${nativeToken.symbol}`
        : `https://pancakeswap.finance/swap?chain=${CHAIN_QUERY_NAME[network]}&persistChain=${network}&outputCurrency=${tokenAddress}`
      window.open(url, '_blank', 'noopener noreferrer')
    }
  }

  const handleRedirectLiquidity = () => {
    const { network, lpAddressLink } = task as TaskLiquidityConfig
    if (lpAddressLink && network) {
      const url = new URL(lpAddressLink)

      if (!url.searchParams.has('chain')) {
        url.searchParams.set('chain', CHAIN_QUERY_NAME[network])
      }

      if (!url.searchParams.has('persistChain')) {
        url.searchParams.set('persistChain', network?.toString())
      }

      window.open(url.href, '_blank', 'noopener noreferrer')
    }
  }

  const handleVerifyButton = () => {
    setIsPending(true)
    setActionPanelExpanded(false)

    const providerId = (session as any)?.user?.twitter?.providerId
    const token = (session as any)?.user?.twitter?.token
    const tokenSecret = (session as any)?.user?.twitter?.tokenSecret
    if (providerId && token && tokenSecret) {
      handleTwitterActions(taskType, {
        providerId,
        token,
        tokenSecret,
      })
    } else if (
      taskType === TaskType.X_FOLLOW_ACCOUNT ||
      taskType === TaskType.X_LIKE_POST ||
      taskType === TaskType.X_REPOST_POST
    ) {
      connectTwitter({ action: taskType, taskId: task?.id })
    }
  }

  const handleRedirectPrediction = () => {
    const url = (task as TaskMakePredictionConfig)?.link
    if (url) {
      window.open(url, '_blank', 'noopener noreferrer')
    }
  }

  const handleAction = () => {
    switch (taskType as TaskType) {
      case TaskType.MAKE_A_SWAP:
      case TaskType.HOLD_A_TOKEN:
        return handleRedirectSwap()
      case TaskType.ADD_LIQUIDITY:
        return handleRedirectLiquidity()
      case TaskType.VISIT_BLOG_POST:
        return handleAddBlogPost()
      case TaskType.X_LIKE_POST:
      case TaskType.X_FOLLOW_ACCOUNT:
      case TaskType.X_REPOST_POST:
      case TaskType.TELEGRAM_JOIN_GROUP:
      case TaskType.DISCORD_JOIN_SERVER:
        return handleSocial()
      case TaskType.MAKE_A_PREDICTION:
        return handleRedirectPrediction()
      default:
        return null
    }
  }

  const shouldShowVerifyButton = useMemo(
    () =>
      taskType === TaskType.X_FOLLOW_ACCOUNT ||
      taskType === TaskType.X_LIKE_POST ||
      taskType === TaskType.X_REPOST_POST,
    [taskType],
  )

  return (
    <Card>
      <Flex flexDirection="column">
        <Flex
          padding={actionPanelExpanded ? '16px 16px 0 16px' : '16px'}
          style={{ cursor: 'pointer' }}
          onClick={toggleActionPanel}
        >
          <Flex mr="auto">
            <Flex position="relative">
              {taskIcon(taskType)}
              {task.isOptional && <StyledOptionIcon />}
            </Flex>
            <Text ml="16px" bold>
              {title || taskNaming(taskType)}
            </Text>
          </Flex>
          <Flex alignSelf="center">
            {isError ? (
              <ErrorFillIcon color="failure" />
            ) : isVerified ? (
              <CheckmarkCircleFillIcon color="success" />
            ) : (
              <>
                {shouldShowVerifyButton && isPending ? (
                  <Loading margin="auto" width={16} height={16} color="secondary" />
                ) : (
                  <>
                    {actionPanelExpanded ? (
                      <ChevronUpIcon color="primary" width={20} height={20} />
                    ) : (
                      <ChevronDownIcon color="primary" width={20} height={20} />
                    )}
                  </>
                )}
              </>
            )}
          </Flex>
        </Flex>
        {actionPanelExpanded && (
          <Box padding="0 16px 16px 16px">
            {description && (
              <Text bold mt="8px">
                {description}
              </Text>
            )}
            {isError && (
              <Box mt="16px">
                <Text fontSize="14px" color="failure" line-height="20px">
                  {t(
                    'It seems there may be an issue on our end. Please contact our support team promptly to resolve it.',
                  )}
                </Text>
                <Text color="primary" fontSize="14px" bold line-height="20px">
                  {t('Reach out to our support team')}
                </Text>
              </Box>
            )}
            <FlexGap gap="8px" mt="16px">
              {!isVerified ? (
                <FlexGap gap="8px" width="100%">
                  <Button
                    width="100%"
                    scale="md"
                    style={{ borderRadius: '999px' }}
                    endIcon={<OpenNewIcon color="invertedContrast" />}
                    onClick={handleAction}
                  >
                    {userActionButtonText(taskType)}
                  </Button>
                  {shouldShowVerifyButton && (
                    <>
                      {isError ? (
                        <Button
                          scale="md"
                          width="100%"
                          variant="danger"
                          style={{ borderRadius: '999px' }}
                          disabled={isPending}
                          endIcon={
                            <RefreshIcon
                              color="white"
                              width={20}
                              height={20}
                              style={{ transform: 'rotate(-180deg)' }}
                            />
                          }
                          onClick={handleVerifyButton}
                        >
                          {t('Retry')}
                        </Button>
                      ) : (
                        <VerifyButton
                          scale="md"
                          width="100%"
                          style={{ borderRadius: '999px' }}
                          disabled={isPending}
                          endIcon={isPending && <Loading width={16} height={16} />}
                          onClick={handleVerifyButton}
                        >
                          {t('Verify')}
                        </VerifyButton>
                      )}
                    </>
                  )}
                </FlexGap>
              ) : (
                <Button
                  scale="md"
                  width="100%"
                  variant="success"
                  style={{ borderRadius: '999px' }}
                  endIcon={<CheckmarkCircleFillIcon color="white" />}
                >
                  {t('Completed')}
                </Button>
              )}
            </FlexGap>
          </Box>
        )}
      </Flex>
    </Card>
  )
}
