import React from 'react'
import styled, { keyframes } from 'styled-components'
import { Flex, Heading, Text, Link, Box } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import UnlockButton from 'components/UnlockButton'
import Container from 'components/Layout/Container'
import { useWeb3React } from '@web3-react/core'
import Star from './Star'
import CompositeImage from './CompositeImage'

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`

const BgWrapper = styled.div`
  overflow: hidden;
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0px;
  left: 0px;
`

const StyledStar = styled(Star)`
  height: 350%;
  width: 350%;
  animation: 60s ${rotate} linear infinite;

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

const Footer = () => {
  const { t } = useTranslation()
  const { account } = useWeb3React()

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

  return (
    <>
      <BgWrapper>
        <Flex alignItems="center" justifyContent="center" width="100%" height="100%">
          <StyledStar />
        </Flex>
      </BgWrapper>
      <FloatingPancakesWrapper>
        <TopLeftImgWrapper>
          <CompositeImage {...topLeftImage} maxHeight="256px" />
        </TopLeftImgWrapper>
        <BottomRightImgWrapper>
          <CompositeImage {...bottomRightImage} maxHeight="256px" />
        </BottomRightImgWrapper>
      </FloatingPancakesWrapper>
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
        {!account && <UnlockButton mt="24px" />}
      </Wrapper>
    </>
  )
}

export default Footer
