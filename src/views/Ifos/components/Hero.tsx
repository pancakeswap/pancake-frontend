import React from 'react'
import styled from 'styled-components'
import { Box, Heading, Text, Button, Flex, useMatchBreakpoints } from '@pancakeswap/uikit'
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

const StyledButton = styled(Button)`
  background-color: ${({ theme }) => theme.colors.tertiary};
  color: ${({ theme }) => theme.colors.primary};
  padding: 4px 13px;
  height: auto;
  text-transform: uppercase;
  align-self: flex-start;
  font-size: 12px;
  box-shadow: ${({ theme }) => theme.shadows.inset};
  border-radius: 8px;
  margin-left: 8px;
`

const DesktopButton = styled(Button)`
  align-self: flex-end;
`

const StyledSubTitle = styled(Text)`
  font-size: 16px;

  ${({ theme }) => theme.mediaQueries.md} {
    font-size: 20px;
  }
`

const Hero = () => {
  const { t } = useTranslation()

  const { isMobile } = useMatchBreakpoints()

  const handleClick = () => {
    document.getElementById('ifo-how-to')?.scrollIntoView()
  }

  return (
    <Box mb="8px">
      <StyledHero py={['16px', '16px', '32px']} minHeight={['212px', '212px', '197px']}>
        <Container>
          <Flex
            justifyContent="space-between"
            flexDirection={['column', 'column', 'column', 'row']}
            style={{ gap: '4px' }}
          >
            <Box>
              <StyledHeading as="h1" mb={['12px', '12px', '16px']}>
                {t('IFO: Initial Farm Offerings')}
              </StyledHeading>
              <StyledSubTitle bold>
                {t('Buy new tokens launching on Binance Smart Chain')}
                {isMobile && <StyledButton onClick={handleClick}>{t('How does it work?')}</StyledButton>}
              </StyledSubTitle>
            </Box>
            {!isMobile && (
              <DesktopButton onClick={handleClick} variant="subtle">
                {t('How does it work?')}
              </DesktopButton>
            )}
          </Flex>
        </Container>
      </StyledHero>
    </Box>
  )
}

export default Hero
