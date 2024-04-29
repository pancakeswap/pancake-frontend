import { useTranslation } from '@pancakeswap/localization'
import {
  ArrowBackIcon,
  Box,
  CalenderIcon,
  Flex,
  Heading,
  Link,
  MoreIcon,
  Tag,
  Text,
  useMatchBreakpoints,
} from '@pancakeswap/uikit'
import { styled } from 'styled-components'
import { Description } from 'views/Campaign/components/Description'
import { Reward } from 'views/Campaign/components/Reward'

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

const StyledThumbnail = styled('div')`
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center center;
  background-repeat: no-repeat;
  transition: 0.5s;
`

export const Campaign = () => {
  const { t } = useTranslation()
  const { isDesktop } = useMatchBreakpoints()

  return (
    <QuestContainer>
      <Box width="100%" p={['0', '0', '0', '0', '0 40px']}>
        <Flex mt={['16px', '16px', '16px', '16px', '40px']}>
          <StyledBackButton href="/campaigns">
            <Flex>
              <ArrowBackIcon color="primary" />
              <Text ml="6px" color="primary" bold>
                {t('Back')}
              </Text>
            </Flex>
          </StyledBackButton>
          <Flex ml="auto" style={{ cursor: 'pointer' }}>
            <Text color="primary" bold>
              {t('Share')}
            </Text>
            <MoreIcon ml="6px" color="primary" />
          </Flex>
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
        <Box overflow="hidden" borderRadius="16px" height={['192px', '280px', '320px', '378px']} mb="32px">
          <StyledThumbnail
            className="thumbnail"
            style={{
              backgroundImage: `url('https://sgp1.digitaloceanspaces.com/strapi.space/ef14df0bf361ee3d0a0b604a54f0decb.jpg')`,
            }}
          />
        </Box>
        {!isDesktop && <Reward />}
        <Description />
      </Box>
      {isDesktop && <Reward />}
    </QuestContainer>
  )
}
