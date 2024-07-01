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
  useToast,
} from '@pancakeswap/uikit'
import { GAMIFICATION_PUBLIC_API } from 'config/constants/endpoints'
import { useCallback, useState } from 'react'
import { TaskBlogPostConfig, TaskConfigType, TaskSocialConfig } from 'views/DashboardQuestEdit/context/types'
import { useTaskInfo } from 'views/DashboardQuestEdit/hooks/useTaskInfo'
import { TaskType } from 'views/DashboardQuestEdit/type'
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
  const { address: account } = useAccount()
  const isVerified = taskStatus?.verificationStatusBySocialMedia?.[task.taskType]
  const isUserConnectSocial = false
  const { taskType, title, description } = task
  const { taskIcon, taskNaming } = useTaskInfo(false, 22)
  const [actionPanelExpanded, setActionPanelExpanded] = useState(false)
  const { toastError } = useToast()

  const toggleActionPanel = useCallback(() => {
    if (isQuestFinished) {
      toastError(t('This quest has expired.'))
    } else if (isUserConnectSocial) {
      console.log('User should connect social redirect to profile page')
    } else {
      setActionPanelExpanded(!actionPanelExpanded)
    }
  }, [actionPanelExpanded, isQuestFinished, isUserConnectSocial, t, toastError])

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
            {taskIcon(taskType)}
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
