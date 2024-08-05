import { useTranslation } from '@pancakeswap/localization'
import { Box, Button, Flex, FlexGap, Tag, Text, useModal } from '@pancakeswap/uikit'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { GAMIFICATION_PUBLIC_API } from 'config/constants/endpoints'
import { useProfile } from 'hooks/useProfile'
import { styled } from 'styled-components'
import { OptionIcon } from 'views/DashboardQuestEdit/components/Tasks/OptionIcon'
import { SingleQuestData } from 'views/DashboardQuestEdit/hooks/useGetSingleQuestData'
import { MakeProfileModal } from 'views/Quest/components/MakeProfileModal'
import { Task } from 'views/Quest/components/Tasks/Task'
import { VerifyTaskStatus } from 'views/Quest/hooks/useVerifyTaskStatus'
import { useAccount } from 'wagmi'

const OverlapContainer = styled(Box)`
  position: absolute;
  width: 100%;
  height: 100%;
  bottom: 0;
  left 0;
  border-radius: 24px;
  background: ${({ theme }) => `${theme.isDark ? 'rgba(32, 28, 41, 0.9)' : 'rgba(255, 255, 255, 0.9)'}`};

  > div {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 0 12px;
  }
`

interface TasksProps {
  quest: SingleQuestData
  hasIdRegister: boolean
  taskStatus: VerifyTaskStatus
  isQuestFinished: boolean
  isTasksCompleted: boolean
  isSocialHubFetched: boolean
  totalTaskCompleted: number
  hasOptionsInTasks: boolean
  isEnoughCompleted: boolean
  refreshSocialHub: () => void
  refreshVerifyTaskStatus: () => void
}

export const Tasks: React.FC<TasksProps> = ({
  quest,
  taskStatus,
  hasIdRegister,
  totalTaskCompleted,
  isQuestFinished,
  isTasksCompleted,
  isSocialHubFetched,
  hasOptionsInTasks,
  isEnoughCompleted,
  refreshSocialHub,
  refreshVerifyTaskStatus,
}) => {
  const { t } = useTranslation()
  const { address: account } = useAccount()
  const { id: questId, tasks } = quest
  const { isInitialized, profile } = useProfile()
  const hasProfile = isInitialized && !!profile
  const [onPressMakeProfileModal] = useModal(<MakeProfileModal type={t('quest')} />)

  const handleLinkUserToQuest = async () => {
    if (account) {
      try {
        const response = await fetch(`${GAMIFICATION_PUBLIC_API}/userInfo/v1/linkUserToQuest/${account}/${questId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        })
        if (response.ok) {
          refreshSocialHub()
        }
      } catch (error) {
        console.error(`Submit link user to quest error: ${error}`)
      }
    }
  }

  const handleStartQuest = () => {
    if (!hasProfile) {
      onPressMakeProfileModal()
    } else {
      handleLinkUserToQuest()
    }
  }

  return (
    <Box mb="32px">
      <Flex mb="16px">
        <Text fontSize={['24px']} bold mr="8px">
          {t('Tasks')}
        </Text>
        {tasks?.length > 0 && (
          <Box style={{ alignSelf: 'center' }}>
            {account ? (
              <>
                {isTasksCompleted ? (
                  <Tag variant="success" outline>
                    {t('Completed')}
                  </Tag>
                ) : hasOptionsInTasks && isEnoughCompleted ? (
                  <Tag variant="success" outline>
                    {t('Enough completed')}
                  </Tag>
                ) : (
                  <Tag variant="secondary" outline>
                    {t('%completed%/%totalTask% completed', {
                      completed: totalTaskCompleted,
                      totalTask: tasks?.length,
                    })}
                  </Tag>
                )}
              </>
            ) : (
              <Tag variant="textDisabled" outline>
                {tasks?.length}
              </Tag>
            )}
          </Box>
        )}
      </Flex>
      {tasks?.length > 0 && (
        <Box position="relative">
          <FlexGap flexDirection="column" gap="12px">
            {tasks?.map((task) => (
              <Task
                key={task?.id}
                questId={questId}
                task={task}
                taskStatus={taskStatus}
                hasIdRegister={hasIdRegister}
                isQuestFinished={isQuestFinished}
                refresh={refreshVerifyTaskStatus}
              />
            ))}
          </FlexGap>
          {hasOptionsInTasks && (
            <Box ml="8px">
              <Box>
                <Text fontSize="12px" bold as="span" color="textSubtle">
                  {t('Tasks marked with the')}
                </Text>
                <OptionIcon m="0 4px -5px 4px" color="textSubtle" width={28} />
                <Text fontSize="12px" bold as="span" color="textSubtle">
                  {t('badge are optional.')}
                </Text>
              </Box>
              {isTasksCompleted ? (
                <Text fontSize="12px" bold color="success">
                  {t('Your chances of winning have increased!')}
                </Text>
              ) : (
                <Text fontSize="12px" bold color="textSubtle">
                  {t('But your chances of winning will be increased if you complete all the tasks!')}
                </Text>
              )}
            </Box>
          )}
          {(!account || (isSocialHubFetched && !hasIdRegister)) && !isQuestFinished && (
            <OverlapContainer>
              {account ? (
                <>
                  {!hasIdRegister && (
                    <Flex flexDirection="column">
                      <Text bold fontSize="12px" textAlign="center" color="textSubtle">
                        {t('Start the quest to get access to the tasks')}
                      </Text>
                      <Button onClick={handleStartQuest}>{t('Start the Quest')}</Button>
                    </Flex>
                  )}
                </>
              ) : (
                <Box>
                  <ConnectWalletButton />
                </Box>
              )}
            </OverlapContainer>
          )}
        </Box>
      )}
    </Box>
  )
}
