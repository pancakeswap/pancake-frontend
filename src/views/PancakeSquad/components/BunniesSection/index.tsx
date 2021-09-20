import { Box, Button, Flex, Link, Text } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import React from 'react'
import ColoredWordHeading from 'views/Home/components/ColoredWordHeading'
import { LandingBodyWrapper } from 'views/PancakeSquad/styles'
import bunniesConfig from './config'
import { StyledBunnySectionContainer } from './styles'

const BunniesSection = () => {
  const { t } = useTranslation()

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
        <Box mb={['24px', null, null, '-3px']} maxWidth={['192px', null, '250px', '100%']}>
          <img src={image.src} alt={image.alt} />
        </Box>
        <Flex flexDirection="column" ml={[null, null, null, '64px']} alignSelf={['flex-start', null, null, 'center']}>
          <ColoredWordHeading text={headingTranslatedText} mb="0" />
          <ColoredWordHeading text={subHeadingTranslatedText} color="failure" />
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
        </Flex>
      </LandingBodyWrapper>
    </StyledBunnySectionContainer>
  )
}

export default BunniesSection
