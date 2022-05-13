import { Flex, Text, Heading } from '@pancakeswap/uikit'
import Image from 'next/image'
import styled from 'styled-components'
import { useTranslation } from 'contexts/Localization'
import useTheme from 'hooks/useTheme'
import MoboxAllBunniesImage from '../../../pngs/mobox-all-bunnies.png'
import { Heading1Text, Heading2Text } from '../../../components/CompetitionHeadingText'

const TextStyles = (theme) => `
  text-align: center;
  ${theme.mediaQueries.md} {
    text-align: left;
  }
`

const StarImage = styled.div`
  display: none;
  position: absolute;
  z-index: -1;
  bottom: 0;
  background-size: 150%;
  background-position: top center;
  background-repeat: no-repeat;
  background-image: url('/images/competition/banner-star.png');
  opacity: 0.4;
  ${({ theme }) => theme.mediaQueries.md} {
    display: block;
    height: 70%;
    width: 50%;
    right: 0px;
  }
  ${({ theme }) => theme.mediaQueries.xl} {
    width: 40%;
    height: 80%;
    right: 25px;
  }
  @media screen and (min-width: 1440px) {
    height: 100%;
    right: 12%;
  }
  @media screen and (min-width: 1680px) {
    right: 20%;
  }
`

const ImageWrapper = styled.div`
  width: 75%;
  margin: 0 auto;
  ${({ theme }) => theme.mediaQueries.md} {
    position: absolute;
    width: auto;
    bottom: -5%;
    z-index: -1;
    right: 10px;
  }
  ${({ theme }) => theme.mediaQueries.xl} {
    right: 25px;
  }
  @media screen and (min-width: 1440px) {
    right: 15%;
  }
  @media screen and (min-width: 1680px) {
    right: 23%;
  }
`

const StyledText = styled(Text)`
  ${({ theme }) => TextStyles(theme)}
`

const StyledHeading1Text = styled(Heading1Text)`
  width: 100%;
  white-space: normal;
  ${({ theme }) => TextStyles(theme)}

  ${({ theme }) => theme.mediaQueries.lg} {
    width: 780px;
  }
`

const StyledHeading2Text = styled(Heading2Text)`
  width: 100%;
  white-space: initial;
  -webkit-text-stroke-width: 1.2px;
  -webkit-text-stroke-color: #462091;
  ${({ theme }) => TextStyles(theme)};

  ${({ theme }) => theme.mediaQueries.lg} {
    width: 410px;
  }
`

const StyledHeading = styled(Heading)`
  ${({ theme }) => TextStyles(theme)}
`

const MoboxBattleBanner = () => {
  const {
    t,
    currentLanguage: { locale },
  } = useTranslation()
  const { theme } = useTheme()

  return (
    <Flex flexDirection="column">
      <StarImage />
      <ImageWrapper>
        <Image src={MoboxAllBunniesImage} alt="all the bunnies" width={523} height={395} />
      </ImageWrapper>
      <StyledText mb="16px" color="textSubtle" bold>
        {new Date(2022, 3).toLocaleString(locale, {
          month: 'short',
        })}{' '}
        13-19, 2022
      </StyledText>
      <StyledHeading1Text>{t('Mobox Trading Competition')}</StyledHeading1Text>
      <StyledHeading2Text background={theme.colors.gradients.gold} $fill>
        {t('$80,000 in Prizes with Tokens and NFTs!')}
      </StyledHeading2Text>
      <StyledHeading scale="md" color={theme.isDark ? 'textSubtle' : 'inputSecondary'} mt="16px">
        {t('Compete with other teams for the highest trading volume!')}
      </StyledHeading>
      <Flex height="100px" />
    </Flex>
  )
}

export default MoboxBattleBanner
