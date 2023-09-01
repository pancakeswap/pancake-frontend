import { Flex, Text, Heading } from '@pancakeswap/uikit'
import Image from 'next/image'
import { styled } from 'styled-components'
import { useTranslation } from '@pancakeswap/localization'
import useTheme from 'hooks/useTheme'
import EasterAllBunniesImage from '../../../pngs/fan-token-all-bunnies.png'
import { Heading1Text, Heading2Text } from '../../../components/CompetitionHeadingText'

const TextStyles = (theme) => `
  text-align: center;
  ${theme.mediaQueries.md} {
    text-align: left;
  }
`

const ImageWrapper = styled.div`
  width: 75%;
  margin: 0 auto;
  ${({ theme }) => theme.mediaQueries.md} {
    display: none;
  }
`

const StyledText = styled(Text)`
  ${({ theme }) => TextStyles(theme)}
`

const StyledHeading1Text = styled(Heading1Text)`
  ${({ theme }) => TextStyles(theme)}
`

const StyledHeading2Text = styled(Heading2Text)`
  ${({ theme }) => TextStyles(theme)}
`

const StyledHeading = styled(Heading)`
  ${({ theme }) => TextStyles(theme)}
`

const EasterBattleBanner = () => {
  const { t } = useTranslation()
  const { theme } = useTheme()

  return (
    <Flex flexDirection="column">
      <ImageWrapper>
        <Image src={EasterAllBunniesImage} alt="all the bunnies" width={1208} height={659} />
      </ImageWrapper>
      <StyledText mb="16px" color="textSubtle" bold>
        {t('April')} 07—14, 2021
      </StyledText>
      <StyledHeading1Text>{t('Easter Battle')}</StyledHeading1Text>
      <StyledHeading2Text background={theme.colors.gradientGold} $fill>
        {t('$200,000 in Prizes!')}
      </StyledHeading2Text>
      <StyledHeading scale="md" color={theme.isDark ? 'textSubtle' : 'inputSecondary'} mt="16px">
        {t('Compete with other teams to win CAKE, collectible NFTs, achievements & more!')}
      </StyledHeading>
    </Flex>
  )
}

export default EasterBattleBanner
