import { Box, Button, Flex, Link, Text } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import { LandingBodyWrapper } from 'views/PancakeSquad/styles'
import eventDescriptionConfigBuilder from './config'
import {
  StyledBodyTextElement,
  StyledBodyTextList,
  StyledBunnyAccessoriesContainer,
  StyledBunnyAccessory,
  StyledEventDescriptionSectionContainer,
} from './styles'

const EventDescriptionSection = () => {
  const { t } = useTranslation()

  const { headingText, subHeadingText, bodyTextHeader, bodyText, primaryButton, image, accessoriesImages } =
    eventDescriptionConfigBuilder({ t })

  return (
    <StyledEventDescriptionSectionContainer justifyContent={['flex-start', null, null, 'center']}>
      <LandingBodyWrapper
        alignItems={['flex-end', null, 'center', null]}
        flexDirection={['column', null, null, 'row']}
        pt={['64px', null, '104px']}
        pb="60px"
      >
        <Flex
          flex={1}
          order={[2, null, null, 1]}
          flexDirection="column"
          mr={[null, null, null, '64px']}
          alignSelf={['flex-start', null, null, 'center']}
          width={['100%', null, null, '50%']}
        >
          <Text color="text" fontSize="40px" mb="24px" bold>
            {headingText}
          </Text>
          <Text color="textSubtle" mb="24px">
            {subHeadingText}
          </Text>
          <Text color="textSubtle">{bodyTextHeader}</Text>
          <StyledBodyTextList>
            {bodyText.map((text) => (
              <StyledBodyTextElement key={text.id}>{text.content}</StyledBodyTextElement>
            ))}
          </StyledBodyTextList>
          {primaryButton?.isDisplayed && (
            <Flex>
              <Link mr="16px" external={primaryButton.external} href={primaryButton.to}>
                <Button variant="secondary">
                  <Text color="card" bold fontSize="16px">
                    {t(primaryButton.text)}
                  </Text>
                </Button>
              </Link>
            </Flex>
          )}
        </Flex>
        <Flex
          position="relative"
          order={[1, null, null, 2]}
          mb={['24px', null, '-3px']}
          width={['192px', null, '250px', '50%']}
        >
          <Box>
            <img src={image.src} alt={image.alt} />
          </Box>
          <StyledBunnyAccessoriesContainer>
            {accessoriesImages.map((accessory) => (
              <StyledBunnyAccessory key={accessory.alt} src={accessory.src} alt={accessory.alt} />
            ))}
          </StyledBunnyAccessoriesContainer>
        </Flex>
      </LandingBodyWrapper>
    </StyledEventDescriptionSectionContainer>
  )
}

export default EventDescriptionSection
