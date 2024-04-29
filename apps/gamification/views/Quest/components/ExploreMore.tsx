import { useTranslation } from '@pancakeswap/localization'
import { Box, FlexGap, Text } from '@pancakeswap/uikit'
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

export const ExploreMore = () => {
  const { t } = useTranslation()

  return (
    <Box mt="32px">
      <Text fontSize="24px" lineHeight="28px" bold mb="16px">
        {t('Explore more')}
      </Text>
      <StyledFlexGap>
        <Quest />
        <Quest />
        <Quest />
        <Quest />
        <Quest />
        <Quest />
        <Quest />
      </StyledFlexGap>
    </Box>
  )
}
