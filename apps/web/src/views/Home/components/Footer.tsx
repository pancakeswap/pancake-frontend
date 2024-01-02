import { useTranslation } from '@pancakeswap/localization'
import { Box, Flex, Text, useMatchBreakpoints } from '@pancakeswap/uikit'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { ASSET_CDN } from 'config/constants/endpoints'
import { keyframes, styled } from 'styled-components'
import { useAccount } from 'wagmi'
import SunburstSvg from './SunburstSvg'

const Image = styled.img``

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
    display: none;
    animation: ${floatingAnim('3px', '2px')} 3s ease-in-out 1s infinite;
    ${({ theme }) => theme.mediaQueries.sm} {
      display: block;
    }
    ${({ theme }) => theme.mediaQueries.lg} {
      left: calc(50% - 60px - 300px);
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
      left: calc(50% - 80px + 270px);
    }
  }
  .rock2 {
    width: 140px;
    position: absolute;
    bottom: 10px;
    left: 20px;
    animation: ${floatingAnim('1px', '1px')} 3s ease-in-out 3.5s infinite;
    ${({ theme }) => theme.mediaQueries.lg} {
      left: calc(50% - 70px - 240px);
    }
  }
`

const ImageBox: React.FC = () => {
  return (
    <ImageWrapper>
      <Image className="pancake" src={`${ASSET_CDN}/web/landing/cta-pancake.png`} alt="pancake" />
      <Image className="rock" src={`${ASSET_CDN}/web/landing/cta-rock.png`} alt="rock" />
      <Image className="big-pancake" src={`${ASSET_CDN}/web/landing/cta-pancake-big.png`} alt="big-pancake" />
      <Image className="rock2" src={`${ASSET_CDN}/web/landing/cta-rock-2.png`} alt="rock2" />
    </ImageWrapper>
  )
}

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

const Footer = () => {
  const { t } = useTranslation()
  const { address: account } = useAccount()
  const { isMobile } = useMatchBreakpoints()

  return (
    <Box>
      <BgWrapper>
        <Flex position="relative" zIndex={2} alignItems="center" justifyContent="center" width="100%" height="100%">
          <StyledSunburst />
        </Flex>
        <ImageBox />
      </BgWrapper>

      <Wrapper>
        <Text mb="24px" fontWeight={600} color="#F4EEFF" textAlign="center" fontSize={isMobile ? 32 : 40}>
          {t("Join Everyone's Favorite DEX Now!")}
        </Text>
        {!account && <ConnectWalletButton mt="24px" />}
      </Wrapper>
    </Box>
  )
}

export default Footer
