import { Box, PageSection, useMatchBreakpoints } from '@pancakeswap/uikit'
import { MENU_HEIGHT } from '@pancakeswap/uikit/widgets/Menu/config'
import useTheme from 'hooks/useTheme'
import { styled } from 'styled-components'
import EcoSystemSection from './components/EcoSystemSection'
import Hero from './components/Hero'

const StyledHeroSection = styled(PageSection)`
  padding-top: 24px;

  ${({ theme }) => theme.mediaQueries.md} {
    padding-top: 80px;
  }
`

const TestImageForBunnyWithChair = styled.img`
  position: absolute;
  right: 0;
  height: auto;
  bottom: 35px;
  width: 500px;
  z-index: -1;

  ${({ theme }) => theme.mediaQueries.sm} {
    bottom: 0px;
  }

  ${({ theme }) => theme.mediaQueries.lg} {
    width: 800px;
    right: -50px;
  }

  ${({ theme }) => theme.mediaQueries.xl} {
    width: 1000px;
  }
`

const Home: React.FC<React.PropsWithChildren> = () => {
  const { theme } = useTheme()
  const HomeSectionContainerStyles = { margin: '0', width: '100%', maxWidth: '968px', padding: '0px 16px' }
  const { isMobile } = useMatchBreakpoints()

  return (
    <Box style={{ width: isMobile ? '100vw' : 'calc(100vw - 8px)', overflow: 'hidden', boxSizing: 'border-box' }}>
      <style jsx global>
        {`
          #home-1 .page-bg {
            background: linear-gradient(180deg, #010101 0%, #414142 100%);
          }
          [data-theme='dark'] #home-1 .page-bg {
            background: linear-gradient(180deg, #010101 0%, #414142 100%);
          }
          #home-2 .page-bg {
            background: linear-gradient(180deg, #ffffff 22%, #d7caec 100%);
          }
          [data-theme='dark'] #home-2 .page-bg {
            background: linear-gradient(180deg, #09070c 22%, #201335 100%);
          }
          #home-3 .page-bg {
            background: linear-gradient(180deg, #6fb6f1 0%, #eaf2f6 100%);
          }
          [data-theme='dark'] #home-3 .page-bg {
            background: linear-gradient(180deg, #0b4576 0%, #091115 100%);
          }
          #home-4 .inner-wedge svg {
            fill: #d8cbed;
          }
          [data-theme='dark'] #home-4 .inner-wedge svg {
            fill: #201335;
          }

          #bottom-wedge4-2 svg {
            fill: #72b8f2;
          }
          [data-theme='dark'] #bottom-wedge4-2 svg {
            fill: #0b4576;
          }
        `}
      </style>
      <StyledHeroSection
        innerProps={{ style: { margin: '0', width: '100%', overflow: 'visible', padding: '0px' } }}
        containerProps={{
          id: 'home-1',
        }}
        index={2}
        style={{ position: 'relative', height: `calc(-${MENU_HEIGHT}px + 100dvh`, paddingBottom: '0px' }}
        hasCurvedDivider={false}
      >
        <Hero />
        <TestImageForBunnyWithChair src="/images/home/business-bunny/1.png" alt="bunny-with-chair" />
      </StyledHeroSection>
      <PageSection
        innerProps={{ style: { ...HomeSectionContainerStyles, maxWidth: 'auto' } }}
        background={theme.colors.background}
        containerProps={{
          id: 'home-4',
        }}
        index={2}
        hasCurvedDivider={false}
      >
        <EcoSystemSection />
      </PageSection>
    </Box>
  )
}

export default Home
