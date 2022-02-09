import { Flex, Text, Heading } from '@pancakeswap/uikit'
import Image from 'next/image'
import styled from 'styled-components'
import { useTranslation } from 'contexts/Localization'
import useTheme from 'hooks/useTheme'
import AllBunniesImage from '../../pngs/all-bunnies.png'
import { Heading1Text, Heading2Text } from '../CompetitionHeadingText'

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
  white-space: normal;
`

const StyledHeading2Text = styled(Heading2Text)`
  ${({ theme }) => TextStyles(theme)}
`

const StyledHeading = styled(Heading)`
  ${({ theme }) => TextStyles(theme)}
`

const BattleBanner = () => {
  const {
    t,
    currentLanguage: { locale },
  } = useTranslation()
  const { theme } = useTheme()

  return (
    <Flex flexDirection="column">
      <ImageWrapper>
        <Image src={AllBunniesImage} alt="all the bunnies" width={1208} height={659} />
      </ImageWrapper>
      <StyledText mb="16px" color="textSubtle" bold>
        {new Date(2020, 11).toLocaleString(locale, {
          month: 'short',
        })}{' '}
        14-20, 2021
      </StyledText>
      <StyledHeading1Text>{t('Binance Fan Token Trading Competition')}</StyledHeading1Text>
      <StyledHeading2Text background={theme.colors.gradients.gold} $fill>
        {t('$120,000 in Prizes!')}
      </StyledHeading2Text>
      <StyledHeading scale="md" color={theme.isDark ? 'textSubtle' : 'inputSecondary'} mt="16px">
        {t('Compete with other teams for the highest trading volume!')}
      </StyledHeading>
    </Flex>
  )
}

export default BattleBanner
