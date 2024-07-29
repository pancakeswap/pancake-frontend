import { useTranslation } from '@pancakeswap/localization'
import { Native } from '@pancakeswap/sdk'
import {
  Box,
  Button,
  Card,
  CheckmarkCircleFillIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  Flex,
  FlexGap,
  Loading,
  OpenNewIcon,
  Text,
  useModal,
  useToast,
} from '@pancakeswap/uikit'
import { CHAIN_QUERY_NAME } from 'config/chains'
import Cookie from 'js-cookie'
import { useSession } from 'next-auth/react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { styled } from 'styled-components'
import { StyledOptionIcon } from 'views/DashboardQuestEdit/components/Tasks/StyledOptionIcon'
import {
  TaskBlogPostConfig,
  TaskConfigType,
  TaskHoldTokenConfig,
  TaskLiquidityConfig,
  TaskSocialConfig,
  TaskSwapConfig,
} from 'views/DashboardQuestEdit/context/types'
import { useTaskInfo } from 'views/DashboardQuestEdit/hooks/useTaskInfo'
import { TaskType } from 'views/DashboardQuestEdit/type'
import { useConnectTwitter } from 'views/Profile/hooks/settingsModal/useConnectTwitter'
import { useUserSocialHub } from 'views/Profile/hooks/settingsModal/useUserSocialHub'
import { getSingleTaskTwitterIdCookie } from 'views/Profile/utils/getTwitterIdCookie'
import { TwitterFollowersId } from 'views/Profile/utils/verifyTwitterFollowersIds'
import { ConnectSocialAccountModal } from 'views/Quest/components/Tasks/ConnectSocialAccountModal'
import { VerifyTaskStatus } from 'views/Quest/hooks/useVerifyTaskStatus'
import { completeVisitingWebTask } from 'views/Quest/utils/completeVisitingWebTask'
import { useAccount } from 'wagmi'

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
  const { t } = useTranslation()
  const { toastError } = useToast()
  const { address: account } = useAccount()
  const { data: session } = useSession()
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

  const twitterId = userInfo?.socialHubToSocialUserIdMap?.Twitter ?? ''
  const providerId = (session as any)?.user?.twitter?.providerId
  const token = (session as any)?.user?.twitter?.token
  const tokenSecret = (session as any)?.user?.twitter?.tokenSecret

  const cookieId = getSingleTaskTwitterIdCookie(twitterId, questId)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const getCookie: { taskType?: TaskType } = Cookie.get(cookieId) ? JSON?.parse?.(Cookie.get(cookieId)) : {}

  const handleVerifyTwitterAccount = useCallback(async () => {
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
          targetUserId: (task as TaskSocialConfig).accountId,
          taskId: task?.id ?? '',
        }).toString()
        const response = await fetch(`/api/twitterFollow?${queryString}`)
        if (response.ok) {
          await refresh()
        }
      } catch (error) {
        toastError(`Verify Twitter Followed Fail: ${error}`)
      } finally {
        setIsPending(false)
      }
    }
  }, [account, hasIdRegister, isPending, providerId, questId, refresh, task, toastError, token, tokenSecret, twitterId])

  const handleVerifyTwitterAccountLike = useCallback(async () => {
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
          twitterPostId: (task as TaskSocialConfig).accountId,
        }).toString()
        const response = await fetch(`/api/twitterLiked?${queryString}`)
        if (response.ok) {
          await refresh()
        }
      } catch (error) {
        toastError(`Verify Twitter Liked Fail: ${error}`)
      } finally {
        setIsPending(false)
      }
    }
  }, [account, hasIdRegister, isPending, providerId, questId, refresh, task, toastError, token, tokenSecret, twitterId])

  useEffect(() => {
    const fetchApi = async () => {
      if (cookieId) {
        Cookie.remove(cookieId)
      }

      switch (getCookie?.taskType as TaskType) {
        case TaskType.X_FOLLOW_ACCOUNT:
          await handleVerifyTwitterAccount()
          break
        case TaskType.X_LIKE_POST:
          await handleVerifyTwitterAccountLike()
          break
        default:
          break
      }
    }

    if (
      session &&
      isSocialHubFetched &&
      new Date(session?.expires).getTime() > new Date().getTime() &&
      (getCookie?.taskType === TaskType.X_FOLLOW_ACCOUNT || getCookie?.taskType === TaskType.X_LIKE_POST)
    ) {
      fetchApi()
    }
  }, [
    cookieId,
    getCookie,
    isSocialHubFetched,
    session,
    taskType,
    handleVerifyTwitterAccount,
    handleVerifyTwitterAccountLike,
  ])

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
    const response = await completeVisitingWebTask(account ?? '', questId, task?.id ?? '')

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
      const isNativeToken = nativeToken?.wrapped?.address?.toLowerCase() === tokenAddress.toLowerCase()

      const url = isNativeToken
        ? `https://pancakeswap.finance/swap?chain=${CHAIN_QUERY_NAME[network]}&inputCurrency=${nativeToken.symbol}`
        : `https://pancakeswap.finance/swap?chain=${CHAIN_QUERY_NAME[network]}&inputCurrency=${tokenAddress}`
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

      window.open(url.href, '_blank', 'noopener noreferrer')
    }
  }

  const handleVerifyButton = () => {
    setIsPending(true)
    setActionPanelExpanded(false)

    if (providerId && token && tokenSecret) {
      handleVerifyTwitterAccount()
    } else {
      Cookie.set(cookieId, JSON.stringify({ taskType: TaskType.X_LIKE_POST }))
      connectTwitter()
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
      default:
        return null
    }
  }

  const shouldShowVerifyButton = useMemo(
    () => taskType === TaskType.X_FOLLOW_ACCOUNT || taskType === TaskType.X_LIKE_POST,
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
            {isVerified ? (
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
            <FlexGap gap="8px" mt="16px">
              {!isVerified ? (
                <FlexGap gap="8px" width="100%">
                  <Button
                    width="100%"
                    scale="sm"
                    endIcon={<OpenNewIcon color="invertedContrast" />}
                    onClick={handleAction}
                  >
                    {userActionButtonText(taskType)}
                  </Button>
                  {shouldShowVerifyButton && (
                    <VerifyButton
                      scale="sm"
                      width="100%"
                      disabled={isPending}
                      endIcon={isPending && <Loading width={16} height={16} />}
                      onClick={handleVerifyButton}
                    >
                      {t('Verify')}
                    </VerifyButton>
                  )}
                </FlexGap>
              ) : (
                <Button variant="success" scale="sm" width="100%" endIcon={<CheckmarkCircleFillIcon color="white" />}>
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
