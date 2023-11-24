import { useTranslation } from '@pancakeswap/localization'
import { Box, Button, Flex, Link, Text, useMatchBreakpoints } from '@pancakeswap/uikit'
import SunburstSvg from 'components/Game/Developers/SunburstSvg'
import ctaPancakeBig from 'components/Game/Developers/images/cta-pancake-big.png'
import ctaPancake from 'components/Game/Developers/images/cta-pancake.png'
import ctaRock2 from 'components/Game/Developers/images/cta-rock-2.png'
import ctaRock from 'components/Game/Developers/images/cta-rock.png'
import Image from 'next/image'
import { keyframes, styled } from 'styled-components'

const floatingAnim = (x: string, y: string) => keyframes`
  from {
    transform: translateX(0px) translateY(0px);
  }
  50% {
    transform: translate(${x}) translateY(${y});
  }
  to {
    transform: translateX(0px) translateY(0px);
  }
`

const StyledContainer = styled(Box)`
  position: relative;
  padding: 0 16px;
  background: linear-gradient(180deg, #7645d9 0%, #5121b1 100%);
`

const ImageWrapper = styled.div`
  z-index: 2;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  > * {
    will-change: transform;
  }
  .pancake {
    position: absolute;
    width: 120px;
    top: 20px;
    left: -40px;
    animation: ${floatingAnim('3px', '2px')} 3s ease-in-out 1s infinite;
    ${({ theme }) => theme.mediaQueries.sm} {
      display: block;
    }
    ${({ theme }) => theme.mediaQueries.lg} {
      top: 30px;
    }
  }
  .rock {
    position: absolute;
    width: 120px;
    top: 16px;
    right: 5px;
    animation: ${floatingAnim('3px', '3px')} 3s ease-in-out 0.5s infinite;
    ${({ theme }) => theme.mediaQueries.lg} {
      left: calc(50% - 60px + 240px);
    }
  }
  .big-pancake {
    width: 160px;
    position: absolute;
    bottom: 10px;
    right: -60px;
    animation: ${floatingAnim('8px', '6px')} 3s ease-in-out 2.5s infinite;
    ${({ theme }) => theme.mediaQueries.lg} {
      bottom: 40px;
    }
  }
  .rock2 {
    width: 140px;
    position: absolute;
    bottom: -40px;
    left: 20px;
    animation: ${floatingAnim('1px', '1px')} 3s ease-in-out 3.5s infinite;
    ${({ theme }) => theme.mediaQueries.lg} {
      left: calc(50% - 70px - 240px);
    }
  }
`

const BgWrapper = styled.div`
  overflow: hidden;
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0px;
  left: 0px;
  z-index: 1;
`

const StyledSunburst = styled(SunburstSvg)`
  height: 100%;
  width: 100%;
  transform: scale3d(3.5, 3.5, 1);
  transform-origin: center center;
  ${({ theme }) => theme.mediaQueries.xl} {
    transform: scale3d(4, 4, 1);
  }
`

const Wrapper = styled(Flex)`
  width: 100%;
  z-index: 2;
  position: relative;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  height: 480px;
  ${({ theme }) => theme.mediaQueries.sm} {
    height: 560px;
  }
  ${({ theme }) => theme.mediaQueries.lg} {
    height: 400px;
  }
`

export const Footer = () => {
  const { t } = useTranslation()
  const { isMobile } = useMatchBreakpoints()

  return (
    <StyledContainer>
      <BgWrapper>
        <Flex position="relative" zIndex={2} alignItems="center" justifyContent="center" width="100%" height="100%">
          <StyledSunburst />
        </Flex>
        <ImageWrapper>
          <Image className="pancake" src={ctaPancake} alt="pancake" />
          <Image className="rock" src={ctaRock} alt="rock" />
          <Image className="big-pancake" src={ctaPancakeBig} alt="big-pancake" />
          <Image className="rock2" src={ctaRock2} alt="rock2" />
        </ImageWrapper>
      </BgWrapper>

      <Wrapper>
        <Text mb="24px" fontWeight={600} color="#F4EEFF" textAlign="center" fontSize={isMobile ? 32 : 40}>
          {t('Build Games with PancakeSwap Now')}
        </Text>
        <Link external href="https://forms.gle/WXDhmbfRhQtz4eSt7">
          <Button mt="24px">{t('Start Building')}</Button>
        </Link>
      </Wrapper>
    </StyledContainer>
  )
}
