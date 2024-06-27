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
} from '@pancakeswap/uikit'
import { TaskConfigType } from 'views/DashboardQuestEdit/context/types'
import { useTaskInfo } from 'views/DashboardQuestEdit/hooks/useTaskInfo'
import { CompletionStatus } from 'views/DashboardQuestEdit/type'

interface TaskProps {
  task: TaskConfigType
  completionStatus: CompletionStatus
  isQuestFinished: boolean
}

export const Task: React.FC<TaskProps> = ({ task, completionStatus, isQuestFinished }) => {
  const { t } = useTranslation()
  const isVerified = true
  const { taskType, title, description } = task
  const { taskIcon, taskNaming } = useTaskInfo(false, 22)

  return (
    <Card>
      <Flex flexDirection="column" padding="16px">
        <Flex>
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
        <Box>
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
      </Flex>
    </Card>
  )
}
