import { useTranslation } from '@pancakeswap/localization'
import {
  ArrowBackIcon,
  Box,
  CalenderIcon,
  Flex,
  Heading,
  Link,
  Tag,
  Text,
  useMatchBreakpoints,
} from '@pancakeswap/uikit'
import { useRouter } from 'next/router'
import { styled } from 'styled-components'
import { CompletionStatus } from 'views/DashboardQuestEdit/type'
import { Description } from 'views/Quest/components/Description'
// import { ExploreMore } from 'views/Quest/components/ExploreMore'
// import { RelatedQuest } from 'views/Quest/components/RelatedQuest'
import { ChainId } from '@pancakeswap/chains'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useEffect, useMemo } from 'react'
import { convertTimestampToDate } from 'views/DashboardQuestEdit/utils/combineDateAndTime'
import { useUserSocialHub } from 'views/Profile/hooks/settingsModal/useUserSocialHub'
import { Reward } from 'views/Quest/components/Reward'
import { Questers } from 'views/Quest/components/Reward/Questers'
import { Share } from 'views/Quest/components/Share'
import { Tasks } from 'views/Quest/components/Tasks'
import { useGetQuestInfo } from 'views/Quest/hooks/useGetQuestInfo'
import { useVerifyTaskStatus } from 'views/Quest/hooks/useVerifyTaskStatus'

const QuestContainer = styled(Flex)`
  padding: 16px;
  margin: auto;
  max-width: 1200px;

  ${({ theme }) => theme.mediaQueries.lg} {
    padding: 0;
  }
`

const StyledHeading = styled(Heading)`
  font-size: 28px;

  ${({ theme }) => theme.mediaQueries.md} {
    font-size: 36px;
  }
`

const StyledBackButton = styled(Link)`
  &:hover {
    text-decoration: none;
  }
`

export const Quest = () => {
  const { t } = useTranslation()
  const { isDesktop } = useMatchBreakpoints()
  const { query, push } = useRouter()
  const { account } = useActiveWeb3React()
  const questId: string = (query.id as string) ?? ''
  const backToProfile: boolean = (query?.backToProfile as string) === 'true'
  const { quest, isError, isFetched } = useGetQuestInfo(questId)
  const { userInfo, isFetched: isSocialHubFetched, refresh: refreshSocialHub } = useUserSocialHub()

  useEffect(() => {
    if (isError) {
      push('/quests')
    }
  }, [isError, push])

  const backUrl = useMemo(() => (backToProfile ? '/profile' : '/quests'), [backToProfile])

  const { id, completionStatus, endDateTime, tasks } = quest

  const hasIdRegister = useMemo(() => {
    const registered = userInfo.questIds?.map((i) => i.toLowerCase())?.includes(questId.toLowerCase())
    return Boolean(registered)
  }, [questId, userInfo.questIds])

  const isQuestFinished = useMemo(
    () => new Date().getTime() / 1000 >= endDateTime || completionStatus === CompletionStatus.FINISHED,
    [completionStatus, endDateTime],
  )

  const { taskStatus: data, refresh: refreshVerifyTaskStatus } = useVerifyTaskStatus({
    questId: id,
    isQuestFinished,
    hasIdRegister,
  })

  const hasOptionsInTasks = useMemo(() => tasks?.find((i) => i.isOptional === true), [tasks])

  const totalTaskCompleted = useMemo(() => {
    const { taskStatus } = data
    return taskStatus.reduce((acc, { completionStatus: isComplete }) => acc + (isComplete ? 1 : 0), 0)
  }, [data])

  const isEnoughCompleted = useMemo(() => {
    const allRequestTaskTotal = tasks.filter((i) => !i.isOptional)
    const totalRequestComplete = data.taskStatus
      .filter((i) => !i.isOptional)
      .reduce((acc, { completionStatus: isComplete }) => acc + (isComplete ? 1 : 0), 0)

    return allRequestTaskTotal.length === totalRequestComplete && hasIdRegister
  }, [data, tasks, hasIdRegister])

  const isTasksCompleted = useMemo(
    () => totalTaskCompleted >= tasks?.length && hasIdRegister,
    [hasIdRegister, tasks?.length, totalTaskCompleted],
  )

  if (!isFetched || isError || !questId) {
    return null
  }

  return (
    <QuestContainer>
      <Box width="100%" p={['0 0 150px 0', '0 0 150px 0', '0 0 150px 0', '0 0 150px 0', '0 40px 200px 40px']}>
        <Flex mt={['16px', '16px', '16px', '16px', '40px']}>
          <StyledBackButton href={backUrl}>
            <Flex>
              <ArrowBackIcon color="primary" />
              <Text ml="6px" color="primary" bold>
                {t('Back')}
              </Text>
            </Flex>
          </StyledBackButton>
          <Share
            title={quest.title}
            contractChainId={quest.reward?.currency?.network as ChainId}
            contractAddress={quest.rewardSCAddress}
          />
        </Flex>
        <Box mt="16px">
          {quest?.completionStatus === CompletionStatus.ONGOING ? (
            <>
              {account && (isEnoughCompleted || isTasksCompleted) ? (
                <Tag variant="success">{t('Completed')}</Tag>
              ) : (
                <Tag variant="secondary">{t('Ongoing')}</Tag>
              )}
            </>
          ) : null}
          {quest?.completionStatus === CompletionStatus.FINISHED && <Tag variant="textDisabled">{t('Finished')}</Tag>}
        </Box>
        <StyledHeading m="16px 0" as="h1">
          {quest?.title}
        </StyledHeading>
        <Flex flexDirection={['column', 'column', 'column', 'column', 'column', 'row']} mb="32px" width="100%">
          {quest?.startDateTime > 0 && quest?.endDateTime > 0 && (
            <Flex width="100%" maxWidth="270px">
              <CalenderIcon width={16} mr="8px" />
              <Text style={{ alignSelf: 'center' }} fontSize="14px">{`${convertTimestampToDate(
                quest.startDateTime,
              )} - ${convertTimestampToDate(quest.endDateTime)}`}</Text>
            </Flex>
          )}
          {!quest?.reward?.currency && (
            <Box width="100%" m={['18px 0 0 0', '18px 0 0 0', '18px 0 0 0', '18px 0 0 0', '18px 0 0 0', '0 0 0 8px']}>
              <Questers questId={questId} size={24} fontSize={14} />
            </Box>
          )}
        </Flex>
        {!isDesktop && quest?.reward?.currency && (
          <Reward
            quest={quest}
            isTasksCompleted={isEnoughCompleted || isTasksCompleted}
            isQuestFinished={isQuestFinished}
          />
        )}
        <Tasks
          quest={quest}
          taskStatus={data}
          hasIdRegister={hasIdRegister}
          isQuestFinished={isQuestFinished}
          isTasksCompleted={isTasksCompleted}
          hasOptionsInTasks={Boolean(hasOptionsInTasks)}
          totalTaskCompleted={totalTaskCompleted}
          isSocialHubFetched={isSocialHubFetched}
          isEnoughCompleted={isEnoughCompleted}
          refreshSocialHub={refreshSocialHub}
          refreshVerifyTaskStatus={refreshVerifyTaskStatus}
        />
        <Description description={quest?.description} />
        {/* <RelatedQuest /> */}
        {/* <ExploreMore /> */}
      </Box>
      {isDesktop && quest?.reward?.currency && (
        <Reward
          quest={quest}
          isTasksCompleted={isEnoughCompleted || isTasksCompleted}
          isQuestFinished={isQuestFinished}
        />
      )}
    </QuestContainer>
  )
}
