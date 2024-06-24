import { useTranslation } from '@pancakeswap/localization'
import { Box, Button, Flex, FlexGap, Tag, Text } from '@pancakeswap/uikit'
import { GAMIFICATION_PUBLIC_API } from 'config/constants/endpoints'
import { useMemo } from 'react'
import { OptionIcon } from 'views/DashboardQuestEdit/components/Tasks/OptionIcon'
import { useUserSocialHub } from 'views/Profile/hooks/settingsModal/useUserSocialHub'
import { Task } from 'views/Quest/components/Tasks/Task'
import { useAccount } from 'wagmi'
// import { useVerifyTaskStatus } from 'views/Quest/hooks/useVerifyTaskStatus'

interface TasksProps {
  questId: string
}

export const Tasks: React.FC<TasksProps> = ({ questId }) => {
  const { t } = useTranslation()
  const { address: account } = useAccount()
  const { userInfo, refresh } = useUserSocialHub()
  // const { taskStatus } = useVerifyTaskStatus(questId)
  const hasIdRegister = useMemo(
    () => userInfo.questIds?.map((i) => i.toLowerCase())?.includes(questId.toLowerCase()),
    [questId, userInfo.questIds],
  )

  // TODO
  // 1) If not hasIdRegister should call userLinkUserToQuest
  // 2) If status finished no need to call action
  // 3) If account not yet connect social need direct to /profile let user connect it.

  const handleLinkUserToQuest = async () => {
    try {
      const response = await fetch(`${GAMIFICATION_PUBLIC_API}/userInfo/v1/linkUserToQuest/${account}/${questId}`)
      if (response.ok) {
        refresh()
      }
    } catch (error) {
      console.error(`Submit link user to quest error: ${error}`)
    }
  }

  return (
    <Box mb="32px">
      <Flex mb="16px">
        <Text fontSize={['24px']} bold mr="8px">
          {t('Tasks')}
        </Text>
        <Box style={{ alignSelf: 'center' }}>
          {account ? (
            <>
              <Tag variant="secondary" outline>
                1/6 completed
              </Tag>
              {/* <Tag variant="success" outline>
                {t('Completed')}
              </Tag> */}
            </>
          ) : (
            <Tag variant="textDisabled" outline>
              6
            </Tag>
          )}
        </Box>
      </Flex>
      <FlexGap flexDirection="column" gap="12px">
        <Task />
      </FlexGap>
      <Box>
        <Text bold as="span" color="textSubtle">
          {t('Tasks marked with the')}
        </Text>
        <OptionIcon m="0 4px -5px 4px" color="textSubtle" width={28} />
        <Text bold as="span" color="textSubtle">
          {t('badge are optional.')}
        </Text>
        <Text bold as="span" color="textSubtle">
          {t('But your chances of winning will be increased if you complete all the tasks!')}
        </Text>
      </Box>
      {!hasIdRegister && (
        <Flex flexDirection="column">
          <Text bold fontSize="12px" textAlign="center" color="textSubtle">
            {t('Start the quest to get access to the tasks')}
          </Text>
          <Button onClick={handleLinkUserToQuest}>{t('Start the Quest')}</Button>
        </Flex>
      )}
    </Box>
  )
}
