import React from 'react'
import { Box, Button, Flex, Link, Text } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { LandingBodyWrapper, StyledWaveContainer } from 'views/PancakeSquad/styles'
import { useTheme } from 'styled-components'
import artistConfigBuilder from './config'
import { StyledArtistBioContainer, StyledArtistSectionContainer } from './styles'
import ArtistBottomWave from '../../assets/ArtistBottomWave'
import TriangleBio from '../../assets/TriangleBio'

const ArtistSection = () => {
  const { t } = useTranslation()
  const { isDark } = useTheme()

  const { headingText, bodyText, buttons, image } = artistConfigBuilder({ t })

  return (
    <StyledArtistSectionContainer justifyContent={['flex-start', null, null, 'center']}>
      <LandingBodyWrapper
        py={['64px', null, null, '100px']}
        alignItems={['center']}
        flexDirection={['column', null, null, 'row']}
      >
        <Box mb={['24px', null, null, '-3px']} maxWidth={['192px', null, '250px', '100%']}>
          <img src={image.src} alt={image.alt} />
        </Box>
        <Flex flexDirection="column" ml={[null, null, null, '64px']}>
          <StyledArtistBioContainer
            maxWidth="550px"
            flexDirection="column"
            alignSelf={['flex-start', null, null, 'center']}
            mb="40px"
          >
            <Text fontSize="40px" mr="4px" bold>
              {`${headingText}, `}{' '}
              <Text as="span" fontSize="40px" color="secondary" bold>
                Chef Cecy
              </Text>
            </Text>

            {bodyText.map((text) => (
              <Text key={text} color="textSubtle" mb="20px">
                {text}
              </Text>
            ))}
            <TriangleBio isDark={isDark} />
          </StyledArtistBioContainer>
          <Flex justifyContent={['center', null, null, 'flex-start']}>
            {buttons.map((button) => (
              <Link key={button.text} mr="16px" external={button.external} href={button.to}>
                <Button startIcon={button.icon}>
                  <Text color="card" bold fontSize="16px">
                    {button.text}
                  </Text>
                </Button>
              </Link>
            ))}
          </Flex>
        </Flex>
      </LandingBodyWrapper>
      <StyledWaveContainer bottom="-3px">
        <ArtistBottomWave isDark={isDark} />
      </StyledWaveContainer>
    </StyledArtistSectionContainer>
  )
}

export default ArtistSection
