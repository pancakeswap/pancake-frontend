import { TrendingTagType } from '@pancakeswap/games'
import { useTranslation } from '@pancakeswap/localization'
import { Box, Button, Flex, Text } from '@pancakeswap/uikit'
import { styled } from 'styled-components'

export const StyledTag = styled(Button)<{ $isPurple?: boolean }>`
  padding: 4px 8px;
  font-size: 14px;
  font-weight: 400;
  box-shadow: 0px 0px 1px 0px #757575;
  border: ${({ theme, $isPurple }) => `solid 1px ${$isPurple ? theme.colors.secondary : theme.colors.textSubtle}`};
  color: ${({ theme }) => theme.colors.textSubtle};
  background-color: ${({ theme, $isPurple }) => ($isPurple ? theme.colors.secondary : theme.card.background)};
`

const StyledTagContainer = styled(Flex)`
  flex-wrap: wrap;
  ${StyledTag} {
    margin: 8px 4px 0 0;
  }
`

interface TrendingTags {
  trendingTags: TrendingTagType[]
}

export const TrendingTags: React.FC<React.PropsWithChildren<TrendingTags>> = ({ trendingTags }) => {
  const { t } = useTranslation()
  return (
    <Box>
      <Text fontSize={12} textTransform="uppercase">
        {t('trending tags for this game:')}
      </Text>
      <StyledTagContainer>
        {trendingTags.map((tag) => (
          <StyledTag key={tag} scale="sm">
            {tag}
          </StyledTag>
        ))}
      </StyledTagContainer>
    </Box>
  )
}
