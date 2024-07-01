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
  OpenNewIcon,
  Text,
  useModal,
  useToast,
} from '@pancakeswap/uikit'
import { GAMIFICATION_PUBLIC_API } from 'config/constants/endpoints'
import { useCallback, useMemo, useState } from 'react'
import { StyledOptionIcon } from 'views/DashboardQuestEdit/components/Tasks/StyledOptionIcon'
import { TaskBlogPostConfig, TaskConfigType, TaskSocialConfig } from 'views/DashboardQuestEdit/context/types'
import { useTaskInfo } from 'views/DashboardQuestEdit/hooks/useTaskInfo'
import { TaskType } from 'views/DashboardQuestEdit/type'
import { useUserSocialHub } from 'views/Profile/hooks/settingsModal/useUserSocialHub'
import { ConnectSocialAccountModal } from 'views/Quest/components/Tasks/ConnectSocialAccountModal'
import { VerifyTaskStatus } from 'views/Quest/hooks/useVerifyTaskStatus'
import { useAccount } from 'wagmi'

interface TaskProps {
  questId: string
  task: TaskConfigType
  taskStatus: VerifyTaskStatus
  isQuestFinished: boolean
}

export const Task: React.FC<TaskProps> = ({ questId, task, taskStatus, isQuestFinished }) => {
  const { t } = useTranslation()
  const { toastError } = useToast()
  const { address: account } = useAccount()
  const { taskType, title, description } = task
  const isVerified = taskStatus?.verificationStatusBySocialMedia?.[taskType]
  const { taskIcon, taskNaming } = useTaskInfo(false, 22)
  const [actionPanelExpanded, setActionPanelExpanded] = useState(false)
  const { userInfo } = useUserSocialHub()
  const [socialName, setSocialName] = useState('')

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
    if (account && questId) {
      try {
        const response = await fetch(`${GAMIFICATION_PUBLIC_API}/userInfo/v1/markTaskStatus/${account}/${questId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            taskName: TaskType.VISIT_BLOG_POST,
            isCompleted: true,
          }),
        })

        if (response.ok) {
          const url = (task as TaskBlogPostConfig).blogUrl
          window.open(url, '_blank', 'noopener noreferrer')
        }
      } catch (error) {
        console.error('Submit markTaskStatus error', error)
      }
    }
  }

  const handleSocial = () => {
    const url = (task as TaskSocialConfig).socialLink
    window.open(url, '_blank', 'noopener noreferrer')
  }

  const handleAction = () => {
    switch (taskType as TaskType) {
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
              {title ?? taskNaming(taskType)}
            </Text>
          </Flex>
          <Flex alignSelf="center">
            {isVerified ? (
              <CheckmarkCircleFillIcon color="success" />
            ) : (
              <>
                {actionPanelExpanded ? (
                  <ChevronUpIcon color="primary" width={20} height={20} />
                ) : (
                  <ChevronDownIcon color="primary" width={20} height={20} />
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
                <Button
                  width="100%"
                  scale="sm"
                  endIcon={<OpenNewIcon color="invertedContrast" />}
                  onClick={handleAction}
                >
                  {t('Proceed to connect')}
                </Button>
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
