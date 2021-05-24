import React from 'react'
import { Flex, Text, Heading, Image } from '@pancakeswap/uikit'
import styled from 'styled-components'
import { useTranslation } from 'contexts/Localization'
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
`

const StyledHeading2Text = styled(Heading2Text)`
  ${({ theme }) => TextStyles(theme)}
`

const StyledHeading = styled(Heading)`
  ${({ theme }) => TextStyles(theme)}
`

const BattleBanner = () => {
  const { t } = useTranslation()

  return (
    <Flex flexDirection="column">
      <ImageWrapper>
        <Image src={AllBunniesImage} alt="all the bunnies" width={1208} height={659} responsive />
      </ImageWrapper>
      <StyledText mb="16px" color="textSubtle" bold>
        {t('April')} 07—14, 2021
      </StyledText>
      <StyledHeading1Text>{t('Easter Battle')}</StyledHeading1Text>
      {/* TODO: Use uikit color here */}
      <StyledHeading2Text background="linear-gradient(180deg, #FFD800 0%, #FDAB32 100%)" $fill>
        {t('$200,000 in Prizes!')}
      </StyledHeading2Text>
      <StyledHeading scale="md" color="inputSecondary" mt="16px">
        {t('Compete with other teams to win CAKE, collectible NFTs, achievements & more!')}
      </StyledHeading>
    </Flex>
  )
}

export default BattleBanner
