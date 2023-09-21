import { useTranslation } from '@pancakeswap/localization'
import { Box, Flex, Text, useMatchBreakpoints } from '@pancakeswap/uikit'
import ConnectWalletButton from 'components/ConnectWalletButton'
import Container from 'components/Layout/Container'
import { styled } from 'styled-components'
import { useAccount } from 'wagmi'
import Image from 'next/image'
import CompositeImage from './CompositeImage'
import SunburstSvg from './SunburstSvg'
import ctaPancake from '../images/cta-pancake.png'
import ctaPancakeBig from '../images/cta-pancake-big.png'
import ctaRock from '../images/cta-rock.png'
import ctaRock2 from '../images/cta-rock-2.png'

const ImageWrapper = styled.div`
  z-index: 2;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  .pancake {
    position: absolute;
    width: 120px;
    top: 20px;
    left: -40px;
  }
  .rock {
    position: absolute;
    width: 120px;
    top: 16px;
    right: 5px;
  }
  .big-pancake {
    width: 160px;
    position: absolute;
    bottom: 10px;
    right: -60px;
  }
  .rock2 {
    width: 140px;
    position: absolute;
    bottom: 10px;
    left: 20px;
  }
`

const ImageBox: React.FC = () => {
  return (
    <ImageWrapper>
      <Image className="pancake" src={ctaPancake} alt="pancake" />
      <Image className="rock" src={ctaRock} alt="rock" />
      <Image className="big-pancake" src={ctaPancakeBig} alt="big-pancake" />
      <Image className="rock2" src={ctaRock2} alt="rock2" />
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
`

const StyledSunburst = styled(SunburstSvg)`
  height: 350%;
  width: 350%;

  ${({ theme }) => theme.mediaQueries.xl} {
    height: 400%;
    width: 400%;
  }
`

const Wrapper = styled(Flex)`
  width: 100%;
  z-index: 1;
  position: relative;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`

const Footer = () => {
  const { t } = useTranslation()
  const { address: account } = useAccount()
  const { isMobile } = useMatchBreakpoints()

  return (
    <Box p="48px">
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
