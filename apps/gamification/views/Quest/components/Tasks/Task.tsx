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
import { useTaskInfo } from 'views/DashboardQuestEdit/hooks/useTaskInfo'
import { TaskType } from 'views/DashboardQuestEdit/type'

export const Task = () => {
  const { t } = useTranslation()
  const isVerified = true
  const taskType = TaskType.TELEGRAM_JOIN_GROUP
  const { taskIcon, taskNaming } = useTaskInfo(false, 22)

  return (
    <Card>
      <Flex flexDirection="column" padding="16px">
        <Flex>
          <Flex mr="auto">
            {taskIcon(taskType)}
            <Text ml="16px" bold>
              {taskNaming(taskType)}
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
          <Text bold m="8px 0 16px 0">
            description
          </Text>
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
