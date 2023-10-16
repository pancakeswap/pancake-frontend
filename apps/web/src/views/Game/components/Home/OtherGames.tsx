import { styled } from 'styled-components'
import { useTranslation } from '@pancakeswap/localization'
import { Box, Text } from '@pancakeswap/uikit'
import { Game } from 'views/Game/components/Home/Game'

const StyledContainer = styled(Box)`
  width: 100%;
  padding: 68px 16px 107px 16px;
  background: ${({ theme }) => theme.colors.gradientVioletAlt};
`

export const OtherGames = () => {
  const { t } = useTranslation()

  return (
    <StyledContainer>
      <Text bold mb="32px" lineHeight="110%" textAlign="center" fontSize={['40px']}>
        {t('Explore Other Games')}
      </Text>
      <Game isHorizontal />
    </StyledContainer>
  )
}
