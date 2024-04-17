import { useTranslation } from '@pancakeswap/localization'
import { Box, CalenderIcon, Flex, Heading, MoreIcon, Tag, Text, useMatchBreakpoints } from '@pancakeswap/uikit'
import { styled } from 'styled-components'
import { Description } from 'views/Quest/components/Description'
import { Reward } from 'views/Quest/components/Reward'
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

export const Quest = () => {
  const { t } = useTranslation()
  const { isDesktop } = useMatchBreakpoints()

  return (
    <QuestContainer>
      <Box width="100%" p={['0', '0', '0', '0', '0 40px']}>
        <Flex mt={['16px', '16px', '16px', '16px', '40px']}>
          <Tag variant="success">{t('Ongoing')}</Tag>
          {/* <Tag variant="secondary">{t('Upcoming')}</Tag>
          <Tag variant="textDisabled">{t('Finished')}</Tag> */}
          <Flex ml="auto" style={{ cursor: 'pointer' }}>
            <Text color="primary" bold>
              {t('Share')}
            </Text>
            <MoreIcon ml="6px" color="primary" />
          </Flex>
        </Flex>
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
      </Box>
      {isDesktop && <Reward />}
    </QuestContainer>
  )
}
