import React from 'react'
import styled from 'styled-components'
import { Box, Heading, Text } from '@pancakeswap/uikit'
import Container from 'components/Layout/Container'
import { useTranslation } from 'contexts/Localization'

const StyledHero = styled(Box)`
  background-image: url('/images/ifos/assets/ifo-banner-${({ theme }) => (theme.isDark ? 'dark' : 'light')}.png');
  background-position: top, center;
  background-repeat: no-repeat;
  background-size: auto 100%;
`

const StyledHeading = styled(Heading)`
  font-size: 40px;

  ${({ theme }) => theme.mediaQueries.md} {
    font-size: 64px;
  }
`

const Hero = () => {
  const { t } = useTranslation()

  return (
    <Box mb="8px">
      <StyledHero py={['16px', '16px', '32px']} minHeight={['212px', '212px', '197px']}>
        <Container>
          <StyledHeading as="h1" mb="16px">
            {t('IFO: Initial Farm Offerings')}
          </StyledHeading>
          <Text bold fontSize="20px">
            {t('Buy new tokens launching on Binance Smart Chain')}
          </Text>
        </Container>
      </StyledHero>
    </Box>
  )
}

export default Hero
