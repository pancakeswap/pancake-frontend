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
import { styled } from 'styled-components'
import { Description } from 'views/Quest/components/Description'
import { ExploreMore } from 'views/Quest/components/ExploreMore'
import { RelatedQuest } from 'views/Quest/components/RelatedQuest'
import { Reward } from 'views/Quest/components/Reward'
import { Share } from 'views/Quest/components/Share'
import { Tasks } from 'views/Quest/components/Tasks'

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
          <Tag variant="success">{t('Ongoing')}</Tag>
          {/* <Tag variant="secondary">{t('Upcoming')}</Tag>
            <Tag variant="textDisabled">{t('Finished')}</Tag> */}
        </Box>
        <StyledHeading m="16px 0" as="h1">
          PancakeSwap Multichain Celebration - Base
        </StyledHeading>
        <Flex mb="32px">
          <CalenderIcon mr="8px" />
          <Text>0:700 Apr3 - 0:700 Apr 10 (UTC+00:00)</Text>
        </Flex>
        {!isDesktop && <Reward />}
        <Tasks />
        <Description />
        <RelatedQuest />
        <ExploreMore />
      </Box>
      {isDesktop && <Reward />}
    </QuestContainer>
  )
}
