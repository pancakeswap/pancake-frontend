import { ArrowForwardIcon, Button, Text, useMatchBreakpointsContext } from '@pancakeswap/uikit'
import { NextLinkFromReactRouter } from 'components/NextLink'
import { useTranslation } from 'contexts/Localization'
import { useActiveIfoWithBlocks } from 'hooks/useActiveIfoWithBlocks'
import Image from 'next/image'
import { memo, useEffect, useRef } from 'react'
import { useCurrentBlock } from 'state/block/hooks'
import styled, { keyframes } from 'styled-components'
import { getStatus } from '../../../Ifos/hooks/helpers'
import { IFOImage, IFOMobileImage } from './images'
import * as S from './Styled'

const IFOHeaderMobileLimitHeight = 36
const IFOHeaderMobileLimitWidth = 335

const shineAnimation = keyframes`
	0% {transform:translateX(-100%);}
  20% {transform:translateX(100%);}
	100% {transform:translateX(100%);}
`

const RightWrapper = styled.div`
  position: absolute;
  right: 1px;
  bottom: 18px;
  ${({ theme }) => theme.mediaQueries.sm} {
    bottom: -3px;
    right: 0;
  }
  ${({ theme }) => theme.mediaQueries.md} {
    bottom: 9px;
    right: 67px;
  }
  ${({ theme }) => theme.mediaQueries.lg} {
    bottom: -3px;
    right: 67px;
  }
  z-index: 0;
`
const IFOIconImage = styled.div<{ src: string }>`
  position: absolute;
  background-image: ${({ src }) => `url("${src}")`};
  background-size: cover;
  background-repeat: no-repeat;
  width: 35px;
  height: 35px;
  bottom: 35px;
  right: 95px;
  overflow: hidden;
  border-radius: 50%;
  z-index: 2;
  ${({ theme }) => theme.mediaQueries.sm} {
    width: 60px;
    height: 60px;
    bottom: 25px;
    right: 196px;
    z-index: 2;
  }
  &::after {
    content: '';
    top: 0;
    transform: translateX(100%);
    width: 100%;
    height: 100%;
    position: absolute;
    z-index: 1;
    animation: ${shineAnimation} 5s infinite 1s;
    background: -webkit-linear-gradient(
      left,
      rgba(255, 255, 255, 0) 0%,
      rgba(255, 255, 255, 0.8) 50%,
      rgba(128, 186, 232, 0) 99%,
      rgba(125, 185, 232, 0) 100%
    );
  }
`

const IFOBanner = () => {
  const { t } = useTranslation()
  const headingRef = useRef<HTMLDivElement>(null)
  const currentBlock = useCurrentBlock()

  const activeIfoWithBlocks = useActiveIfoWithBlocks()

  const ifoName = activeIfoWithBlocks?.name ?? 'XXX'

  const isIfoAlive = !!(currentBlock && activeIfoWithBlocks && activeIfoWithBlocks.endBlock > currentBlock)
  const status = isIfoAlive
    ? getStatus(currentBlock, activeIfoWithBlocks.startBlock, activeIfoWithBlocks.endBlock)
    : null
  const { isMobile } = useMatchBreakpointsContext()
  useEffect(() => {
    if (!headingRef.current) return
    if (!isMobile) headingRef.current.style.fontSize = ''
    else if (
      headingRef.current.offsetHeight > IFOHeaderMobileLimitHeight ||
      headingRef.current.offsetWidth > IFOHeaderMobileLimitWidth
    ) {
      headingRef.current.style.fontSize = '20px'
    }
  }, [isMobile])
  return isIfoAlive && status ? (
    <S.Wrapper>
      <S.Inner>
        <S.LeftWrapper>
          <S.StyledSubheading>{status === 'live' ? t('Live') : t('Soon')}</S.StyledSubheading>
          <S.StyledHeading scale="xl" ref={headingRef}>
            {ifoName} {t('IFO')}
          </S.StyledHeading>
          <NextLinkFromReactRouter to="/ifo">
            <Button>
              <Text color="invertedContrast" bold fontSize="16px" mr="4px">
                {t('Go to IFO')}
              </Text>
              <ArrowForwardIcon color="invertedContrast" />
            </Button>
          </NextLinkFromReactRouter>
        </S.LeftWrapper>
        <RightWrapper>
          <IFOIconImage
            src={`/images/tokens/${activeIfoWithBlocks.token.address}.png`}
            onError={(event) => {
              // @ts-ignore
              // eslint-disable-next-line no-param-reassign
              event.target.style.display = 'none'
            }}
          />
          {!isMobile ? (
            <Image
              src={IFOImage}
              alt={`IFO ${activeIfoWithBlocks?.id ?? 'XXX'}`}
              width={291}
              height={211}
              placeholder="blur"
            />
          ) : (
            <Image
              src={IFOMobileImage}
              alt={`IFO ${activeIfoWithBlocks?.id ?? 'XXX'}`}
              width={150}
              height={150}
              placeholder="blur"
            />
          )}
        </RightWrapper>
      </S.Inner>
    </S.Wrapper>
  ) : null
}

export default memo(IFOBanner)
