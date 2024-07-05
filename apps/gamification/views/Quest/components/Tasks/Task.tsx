import { ChainId } from '@pancakeswap/chains'
import { useTranslation } from '@pancakeswap/localization'
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
import { getTwitterIdCookie } from 'views/Profile/utils/getTwitterIdCookie'
import { ConnectSocialAccountModal } from 'views/Quest/components/Tasks/ConnectSocialAccountModal'
import { VerifyTaskStatus } from 'views/Quest/hooks/useVerifyTaskStatus'
import { fetchMarkTaskStatus } from 'views/Quest/utils/fetchMarkTaskStatus'
import { TwitterFollowResponse, fetchVerifyTwitterFollow } from 'views/Quest/utils/fetchVerifyTwitterFollow'
import { useAccount } from 'wagmi'

const VerifyButton = styled(Button)`
  background-color: ${({ theme }) => theme.colors.secondary};
`

interface TaskProps {
  questId: string
  task: TaskConfigType
  taskStatus: VerifyTaskStatus
  isQuestFinished: boolean
  refresh: () => void
}

export const Task: React.FC<TaskProps> = ({ questId, task, taskStatus, isQuestFinished, refresh }) => {
  const { t } = useTranslation()
  const { toastError } = useToast()
  const { address: account } = useAccount()
  const { data: session } = useSession()
  const { taskType, title, description } = task
  const isVerified = taskStatus?.verificationStatusBySocialMedia?.[taskType]
  const { taskIcon, taskNaming } = useTaskInfo(false, 22)
  const { userInfo, isFetched: isSocialHubFetched } = useUserSocialHub()
  const { connect: connectTwitter } = useConnectTwitter({ userInfo })

  const [socialName, setSocialName] = useState('')
  const [isPending, setIsPending] = useState(false)
  const [actionPanelExpanded, setActionPanelExpanded] = useState(false)

  const handleVerifyTwitterAccount = useCallback(async () => {
    if (isPending) {
      return
    }

    setIsPending(true)
    const twitterId = userInfo?.socialHubToSocialUserIdMap?.Twitter

    if (twitterId && account) {
      const cookieId = getTwitterIdCookie(twitterId)
      const getTokenData = Cookie.get(cookieId)
      const tokenData = getTokenData ? JSON.parse(getTokenData) : null
      const token = tokenData?.token ?? (session as any)?.user?.twitter?.token
      const tokenSecret = tokenData?.tokenSecret ?? (session as any)?.user?.twitter?.tokenSecret

      if (token && tokenSecret) {
        if ((session as any)?.user?.twitter) {
          Cookie.set(cookieId, JSON.stringify({ token, tokenSecret }))
        }

        try {
          setActionPanelExpanded(false)
          const responseFetchVerifyTwitterFollow = await fetchVerifyTwitterFollow({
            userId: twitterId,
            token,
            tokenSecret,
            targetUserId: (task as TaskSocialConfig).accountId,
          })

          if (responseFetchVerifyTwitterFollow.ok) {
            const followResult = await responseFetchVerifyTwitterFollow.json()
            const followData: TwitterFollowResponse = followResult.data

            if (followData?.following) {
              const responseMarkTaskStatus = await fetchMarkTaskStatus(account, questId, TaskType.X_FOLLOW_ACCOUNT)
              if (responseMarkTaskStatus.ok) {
                refresh()
              }
            }
          }
        } catch (error) {
          toastError('Verify Twitter Fail: ')
        } finally {
          setIsPending(false)
        }
      } else {
        connectTwitter()
      }
    }
  }, [isPending, userInfo, account, session, task, questId, refresh, toastError, connectTwitter])

  useEffect(() => {
    const fetchApi = async () => {
      await handleVerifyTwitterAccount()
    }

    if (
      session &&
      isSocialHubFetched &&
      taskType === TaskType.X_FOLLOW_ACCOUNT &&
      new Date(session?.expires).getTime() > new Date().getTime()
    ) {
      if ((session as any)?.user?.twitter?.token && (session as any)?.user?.twitter?.tokenSecret) {
        fetchApi()
      }
    }
  }, [handleVerifyTwitterAccount, isSocialHubFetched, session, taskType])

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
      case TaskType.X_LINK_POST:
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
    const response = await fetchMarkTaskStatus(account ?? '', questId, TaskType.VISIT_BLOG_POST)

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
      const url = `https://pancakeswap.finance/swap?chain=${CHAIN_QUERY_NAME[network]}&inputCurrency=${tokenAddress}`
      window.open(url, '_blank', 'noopener noreferrer')
    }
  }

  const handleRedirectLiquidity = () => {
    const { network, lpAddress, minAmount } = task as TaskLiquidityConfig
    if (network && lpAddress) {
      // TODO: Confirm liquidity url
      const symbol = network === ChainId.BSC ? 'BNB' : 'ETH'
      const v3Url = `https://pancakeswap.finance/add/$${symbol}/${lpAddress}?chain=${CHAIN_QUERY_NAME[network]}&minPrice=${minAmount}`
      window.open(v3Url, '_blank', 'noopener noreferrer')
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
      case TaskType.X_LINK_POST:
      case TaskType.X_FOLLOW_ACCOUNT:
      case TaskType.X_REPOST_POST:
      case TaskType.TELEGRAM_JOIN_GROUP:
      case TaskType.DISCORD_JOIN_SERVER:
        return handleSocial()
      default:
        return null
    }
  }

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
                {taskType === TaskType.X_FOLLOW_ACCOUNT && isPending ? (
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
                    {t('Proceed to connect')}
                  </Button>
                  {taskType === TaskType.X_FOLLOW_ACCOUNT && (
                    <VerifyButton
                      scale="sm"
                      width="100%"
                      endIcon={isPending && <Loading width={16} height={16} />}
                      onClick={handleVerifyTwitterAccount}
                    >
                      {t('Verify')}
                    </VerifyButton>
                  )}
                </FlexGap>
              ) : (
                <Button
                  variant="success"
                  scale="sm"
                  width="100%"
                  endIcon={<CheckmarkCircleFillIcon color="invertedContrast" />}
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
