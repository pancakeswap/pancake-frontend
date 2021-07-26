import React from 'react'
import styled from 'styled-components'
import { Flex, Heading, Link, Button } from '@pancakeswap/uikit'
import { useWeb3React } from '@web3-react/core'
import { useTranslation } from 'contexts/Localization'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { SlideSvgLight } from './SlideSvg'
import { getSrcSet } from './CompositeImage'

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
  bottom: -2px;
`

const ImageWrapper = styled.div`
  width: 100%;
`

const Hero = () => {
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const imagePath = '/images/home/'
  const imageSrc = 'lunar-bunny'

  return (
    <>
      <BgWrapper>
        <InnerWrapper>
          <SlideSvgLight width="100%" />
        </InnerWrapper>
      </BgWrapper>
      <Flex alignItems="center" justifyContent="center">
        <Flex flex="1" flexDirection="column">
          <Heading scale="xxl" color="secondary" mb="24px">
            {t('The moon is made of pancakes.')}
          </Heading>
          <Heading scale="md" mb="24px">
            {t('Trade, earn, and win crypto on the most popular decentralized platform in the galaxy.')}
          </Heading>
          <Flex>
            {!account && <ConnectWalletButton mr="8px" />}
            <Link mr="16px" href="/swap">
              <Button variant="secondary">{t('Trade Now')}</Button>
            </Link>
          </Flex>
        </Flex>
        <Flex flex="1">
          <ImageWrapper>
            <img src={`${imagePath}${imageSrc}.png`} srcSet={getSrcSet(imagePath, imageSrc)} alt={t('Lunar bunny')} />
          </ImageWrapper>
        </Flex>
      </Flex>
    </>
  )
}

export default Hero
