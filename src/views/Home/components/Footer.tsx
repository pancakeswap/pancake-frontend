import styled from 'styled-components'
import { Flex, Heading, Text, Link, useMatchBreakpointsContext } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import ConnectWalletButton from 'components/ConnectWalletButton'
import Container from 'components/Layout/Container'
import { useWeb3React } from '@web3-react/core'
import SunburstSvg from './SunburstSvg'
import CompositeImage from './CompositeImage'

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
  z-index: 1;
  position: relative;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`

const FloatingPancakesWrapper = styled(Container)`
  overflow: hidden;
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  visibility: hidden;

  ${({ theme }) => theme.mediaQueries.md} {
    visibility: visible;
  }
`

const TopLeftImgWrapper = styled(Flex)`
  position: absolute;
  left: 0;
  top: 0;
`

const BottomRightImgWrapper = styled(Flex)`
  position: absolute;
  right: 0;
  bottom: 0;
`

const topLeftImage = {
  path: '/images/home/flying-pancakes/',
  attributes: [
    { src: '1-bottom', alt: 'Pancake flying on the bottom' },
    { src: '1-left', alt: 'Pancake flying on the left' },
    { src: '1-top', alt: 'Pancake flying on the top' },
  ],
}

const bottomRightImage = {
  path: '/images/home/flying-pancakes/',
  attributes: [
    { src: '2-bottom', alt: 'Pancake flying on the bottom' },
    { src: '2-top', alt: 'Pancake flying on the top' },
    { src: '2-right', alt: 'Pancake flying on the right' },
  ],
}

const Footer = () => {
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const { isTablet, isDesktop } = useMatchBreakpointsContext()

  return (
    <>
      <BgWrapper>
        <Flex alignItems="center" justifyContent="center" width="100%" height="100%">
          <StyledSunburst />
        </Flex>
      </BgWrapper>
      {(isTablet || isDesktop) && (
        <FloatingPancakesWrapper>
          <TopLeftImgWrapper>
            <CompositeImage {...topLeftImage} maxHeight="256px" />
          </TopLeftImgWrapper>
          <BottomRightImgWrapper>
            <CompositeImage {...bottomRightImage} maxHeight="256px" />
          </BottomRightImgWrapper>
        </FloatingPancakesWrapper>
      )}
      <Wrapper>
        <Heading mb="24px" scale="xl" color="white">
          {t('Start in seconds.')}
        </Heading>
        <Text textAlign="center" color="white">
          {t('Connect your crypto wallet to start using the app in seconds.')}
        </Text>
        <Text mb="24px" bold color="white">
          {t('No registration needed.')}
        </Text>

        <Link external href="https://docs.pancakeswap.finance/">
          {t('Learn how to start')}
        </Link>
        {!account && <ConnectWalletButton mt="24px" />}
      </Wrapper>
    </>
  )
}

export default Footer
