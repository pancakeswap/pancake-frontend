import { useTranslation } from '@pancakeswap/localization'
import { Box, Button, FlexGap, Link, OpenNewIcon, Text } from '@pancakeswap/uikit'
import { styled } from 'styled-components'
import { Quest } from 'views/Quests/components/Quest'

const StyledFlexGap = styled(FlexGap)`
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 16px;

  > a {
    width: 100%;
    margin: auto;

    &:hover {
      text-decoration: none;
    }
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    > a {
      width: calc(50% - 8px);
      margin: 0;
    }
  }
`

const StyledLink = styled(Link)`
  &:hover {
    text-decoration: none;
  }
`

export const ExploreMore = () => {
  const { t } = useTranslation()

  return (
    <Box mt="32px">
      <Text fontSize="24px" lineHeight="28px" bold mb="16px">
        {t('Explore more')}
      </Text>
      <Box width="100%">
        <StyledFlexGap>
          <Quest showStatus />
          <Quest />
          <Quest />
          <Quest />
          <Quest />
          <Quest />
          <Quest />
        </StyledFlexGap>
        <StyledLink external href="/quests" display="flex" margin="120px auto 0 auto">
          <Button endIcon={<OpenNewIcon width="20px" height="20px" color="invertedContrast" />}>
            {t('Explore all quests')}
          </Button>
        </StyledLink>
      </Box>
    </Box>
  )
}
