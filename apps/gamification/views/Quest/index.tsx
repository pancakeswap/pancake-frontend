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
import { useEffect } from 'react'
import { convertTimestampToDate } from 'views/DashboardQuestEdit/utils/combineDateAndTime'
import { Reward } from 'views/Quest/components/Reward'
import { Share } from 'views/Quest/components/Share'
import { Tasks } from 'views/Quest/components/Tasks'
import { useGetQuestInfo } from 'views/Quest/hooks/useGetQuestInfo'

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
  const questId: string = (query.id as string) ?? ''
  const { quest, isError, isFetched } = useGetQuestInfo(questId)

  useEffect(() => {
    if (isError) {
      push('/quests')
    }
  }, [isError, push])

  if (!isFetched || isError) {
    return null
  }

  return (
    <QuestContainer>
      <Box width="100%" p={['0 0 150px 0', '0 0 150px 0', '0 0 150px 0', '0 0 150px 0', '0 40px 200px 40px']}>
        <Flex mt={['16px', '16px', '16px', '16px', '40px']}>
          <StyledBackButton href="/quests">
            <Flex>
              <ArrowBackIcon color="primary" />
              <Text ml="6px" color="primary" bold>
                {t('Back')}
              </Text>
            </Flex>
          </StyledBackButton>
          <Share />
        </Flex>
        <Box mt="16px">
          {quest?.completionStatus === CompletionStatus.ONGOING && <Tag variant="success">{t('Ongoing')}</Tag>}
          {quest?.completionStatus === CompletionStatus.FINISHED && <Tag variant="textDisabled">{t('Finished')}</Tag>}
        </Box>
        <StyledHeading m="16px 0" as="h1">
          {quest?.title}
        </StyledHeading>
        {quest?.startDateTime > 0 && quest?.endDateTime > 0 && (
          <Flex mb="32px">
            <CalenderIcon mr="8px" />
            <Text>{`${convertTimestampToDate(quest.startDateTime)} - ${convertTimestampToDate(
              quest.endDateTime,
            )}`}</Text>
          </Flex>
        )}
        {!isDesktop && <Reward quest={quest} />}
        <Tasks quest={quest} />
        <Description description={quest?.description} />
        {/* <RelatedQuest /> */}
        {/* <ExploreMore /> */}
      </Box>
      {isDesktop && <Reward quest={quest} />}
    </QuestContainer>
  )
}
