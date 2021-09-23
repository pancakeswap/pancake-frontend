import { Box, Button, Flex, Link, Text } from '@pancakeswap/uikit'
import React from 'react'
import { useTranslation } from 'contexts/Localization'
import ColoredWordHeading from 'views/Home/components/ColoredWordHeading'
import { LandingBodyWrapper } from 'views/PancakeSquad/styles'
import { SlideSvgDark, SlideSvgLight } from 'views/Home/components/SlideSvg'
import useTheme from 'hooks/useTheme'
import bunniesConfig from './config'
import { StyledBunnySectionContainer, StyledImageContainer, StyledTextContainer } from './styles'

const BunniesSection = () => {
  const { t } = useTranslation()
  const { isDark } = useTheme()

  const { headingText, bodyText, subHeadingText, primaryButton, image } = bunniesConfig

  const headingTranslatedText = t(headingText)
  const subHeadingTranslatedText = t(subHeadingText)
  return (
    <StyledBunnySectionContainer justifyContent={['flex-start', null, null, 'center']}>
      <LandingBodyWrapper
        py={['64px', null, null, '0']}
        alignItems={['flex-end', null, 'center', null]}
        flexDirection={['column', null, null, 'row']}
      >
        <StyledImageContainer mb={['24px', null, null, '-3px']} width={['192px', null, '250px', '50%']}>
          <img src={image.src} alt={image.alt} />
        </StyledImageContainer>
        <StyledTextContainer
          flexDirection="column"
          alignSelf={['flex-start', null, null, 'center']}
          width={['100%', null, null, '50%']}
        >
          <ColoredWordHeading text={headingTranslatedText} color="text" mb="0" />
          <ColoredWordHeading text={subHeadingTranslatedText} color="text" firstColor="failure" />
          {bodyText.map((text) => (
            <Text key={text} color="textSubtle" mb="20px">
              {text}
            </Text>
          ))}
          <Flex>
            <Link mr="16px" external={primaryButton.external} href={primaryButton.to}>
              <Button>
                <Text color="card" bold fontSize="16px">
                  {t(primaryButton.text)}
                </Text>
              </Button>
            </Link>
          </Flex>
        </StyledTextContainer>
      </LandingBodyWrapper>
      <Box position="absolute" bottom="-2px" width="100%">
        {isDark ? <SlideSvgDark width="100%" /> : <SlideSvgLight width="100%" />}
      </Box>
    </StyledBunnySectionContainer>
  )
}

export default BunniesSection
