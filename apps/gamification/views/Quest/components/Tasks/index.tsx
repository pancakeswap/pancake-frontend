import { useTranslation } from '@pancakeswap/localization'
import { Box, Flex, FlexGap, Tag, Text } from '@pancakeswap/uikit'
import { useMemo } from 'react'
import { useUserSocialHub } from 'views/Profile/hooks/settingsModal/useUserSocialHub'
import { Task } from 'views/Quest/components/Tasks/Task'
// import { useVerifyTaskStatus } from 'views/Quest/hooks/useVerifyTaskStatus'

interface TasksProps {
  questId: string
}

export const Tasks: React.FC<TasksProps> = ({ questId }) => {
  const { t } = useTranslation()
  const { userInfo } = useUserSocialHub()
  // const { taskStatus } = useVerifyTaskStatus(questId)
  const hasIdRegister = useMemo(
    () => userInfo.questIds?.map((i) => i.toLowerCase())?.includes(questId.toLowerCase()),
    [questId, userInfo.questIds],
  )

  return (
    <Box mb="32px">
      <Flex mb="16px">
        <Text fontSize={['24px']} bold mr="8px">
          {t('Tasks')}
        </Text>
        <Box style={{ alignSelf: 'center' }}>
          <Tag variant="secondary" outline>
            1/6 completed
          </Tag>
          <Tag variant="textDisabled" outline>
            6
          </Tag>
          <Tag variant="success" outline>
            {t('Completed')}
          </Tag>
        </Box>
      </Flex>
      <FlexGap flexDirection="column" gap="12px">
        <Task />
      </FlexGap>
    </Box>
  )
}
