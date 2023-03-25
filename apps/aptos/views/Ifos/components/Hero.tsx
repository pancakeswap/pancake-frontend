import { useTranslation } from '@pancakeswap/localization'
import { Box, Container, Flex, Heading, Text } from '@pancakeswap/uikit'
import styled from 'styled-components'

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

const StyledSubTitle = styled(Text)`
  font-size: 16px;

  ${({ theme }) => theme.mediaQueries.md} {
    font-size: 20px;
  }
`

const Hero = () => {
  const { t } = useTranslation()

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
              <StyledSubTitle bold>{t('Buy new tokens launching on Aptos')}</StyledSubTitle>
            </Box>
          </Flex>
        </Container>
      </StyledHero>
    </Box>
  )
}

export default Hero
