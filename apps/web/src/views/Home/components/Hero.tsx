import { Button, Flex, Heading, NextLinkFromReactRouter } from '@pancakeswap/uikit'
import { useAccount } from 'wagmi'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { useTranslation } from '@pancakeswap/localization'
import Image from 'next/legacy/image'
import { ChainId } from '@pancakeswap/sdk'
import { useActiveChainId } from 'hooks/useActiveChainId'
import styled, { keyframes } from 'styled-components'
import { ASSET_CDN } from 'config/constants/endpoints'
import CompositeImage, { CompositeImageProps } from './CompositeImage'
import { SlideSvgDark, SlideSvgLight } from './SlideSvg'
import astronautBunny from '../images/astronaut-bunny.png'

const flyingAnim = () => keyframes`
  from {
    transform: translate(0,  0px);
  }
  50% {
    transform: translate(-5px, -5px);
  }
  to {
    transform: translate(0, 0px);
  }
`

const fading = () => keyframes`
  from {
    opacity: 0.9;
  }
  50% {
    opacity: 0.1;
  }
  to {
    opacity: 0.9;
  }
`

const BgWrapper = styled.div`
  z-index: -1;
  overflow: hidden;
  position: absolute;
  width: 100%;
  height: 100%;
  bottom: 0px;
  left: 0px;
`

const InnerWrapper = styled.div`
  position: absolute;
  width: 100%;
  bottom: -3px;
`

const BunnyWrapper = styled.div`
  width: 100%;
  animation: ${flyingAnim} 3.5s ease-in-out infinite;
  will-change: transform;
  > span {
    overflow: visible !important; // make sure the next-image pre-build blur image not be cropped
  }
`

const StarsWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;

  & :nth-child(2) {
    animation: ${fading} 2s ease-in-out infinite;
    animation-delay: 1s;
  }

  & :nth-child(3) {
    animation: ${fading} 5s ease-in-out infinite;
    animation-delay: 0.66s;
  }

  & :nth-child(4) {
    animation: ${fading} 2.5s ease-in-out infinite;
    animation-delay: 0.33s;
  }
`

const starsImage: CompositeImageProps = {
  path: '/images/home/lunar-bunny/',
  attributes: [
    { src: 'star-l', alt: '3D Star' },
    { src: 'star-r', alt: '3D Star' },
    { src: 'star-top-r', alt: '3D Star' },
  ],
}

const Hero = () => {
  const { t } = useTranslation()
  const { address: account } = useAccount()
  const { chainId } = useActiveChainId()

  return (
    <>
      <style jsx global>
        {`
          .slide-svg-dark {
            display: none;
          }
          .slide-svg-light {
            display: block;
          }
          [data-theme='dark'] .slide-svg-dark {
            display: block;
          }
          [data-theme='dark'] .slide-svg-light {
            display: none;
          }
        `}
      </style>
      <BgWrapper>
        <InnerWrapper>
          <SlideSvgDark className="slide-svg-dark" width="100%" />
          <SlideSvgLight className="slide-svg-light" width="100%" />
        </InnerWrapper>
      </BgWrapper>
      <Flex
        position="relative"
        flexDirection={['column-reverse', null, null, 'row']}
        alignItems={['flex-end', null, null, 'center']}
        justifyContent="center"
        mt={[account && chainId === ChainId.BSC ? '280px' : '50px', null, 0]}
        id="homepage-hero"
      >
        <Flex flex="1.1" flexDirection="column">
          <Heading scale="xxl" color="secondary" mb="24px">
            {t('Experience the Power of All-In-One Multichain DEX')}
          </Heading>
          <Heading scale="md" mb="24px">
            {t("Trade and Earn Crypto on Ev3ryone's Favourite D3X")}
          </Heading>
          <Flex>
            {!account && <ConnectWalletButton mr="8px" />}
            <NextLinkFromReactRouter to="/swap">
              <Button variant={!account ? 'secondary' : 'primary'}>{t('Trade Now')}</Button>
            </NextLinkFromReactRouter>
          </Flex>
        </Flex>
        <Flex
          height={['192px', null, null, '100%']}
          width={['192px', null, null, '100%']}
          flex={[null, null, null, '1']}
          mb={['24px', null, null, '0']}
          position="relative"
        >
          <BunnyWrapper>
            <Image
              src={astronautBunny}
              priority
              // https://blurred.dev/
              blurDataURL="data:image/png;base64,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"
              width={397}
              height={573}
              alt={t('Lunar bunny')}
              unoptimized
            />
          </BunnyWrapper>
          <StarsWrapper>
            <CompositeImage {...starsImage} />
          </StarsWrapper>
        </Flex>
      </Flex>
    </>
  )
}

export default Hero
