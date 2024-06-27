import { useTranslation } from '@pancakeswap/localization'
import {
  Box,
  Button,
  Card,
  CheckmarkCircleFillIcon,
  ChevronDownIcon,
  Flex,
  FlexGap,
  OpenNewIcon,
  Text,
  useToast,
} from '@pancakeswap/uikit'
import { useCallback, useState } from 'react'
import { TaskConfigType } from 'views/DashboardQuestEdit/context/types'
import { useTaskInfo } from 'views/DashboardQuestEdit/hooks/useTaskInfo'
import { VerifyTaskStatus } from 'views/Quest/hooks/useVerifyTaskStatus'

interface TaskProps {
  task: TaskConfigType
  taskStatus: VerifyTaskStatus
  isQuestFinished: boolean
}

export const Task: React.FC<TaskProps> = ({ task, taskStatus, isQuestFinished }) => {
  const { t } = useTranslation()
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
              <ChevronDownIcon color="primary" width={20} height={20} />
            )}
          </Flex>
        </Flex>
        {actionPanelExpanded && (
          <Box padding="0 16px 16px 16px">
            {description && (
              <Text bold m="8px 0 16px 0">
                {description}
              </Text>
            )}
            <FlexGap gap="8px">
              {!isVerified ? (
                <Button width="100%" scale="sm" endIcon={<OpenNewIcon color="invertedContrast" />}>
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
