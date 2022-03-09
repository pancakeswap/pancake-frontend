import { ArrowForwardIcon, Button, Text, useMatchBreakpoints } from '@pancakeswap/uikit'
import { NextLinkFromReactRouter } from 'components/NextLink'
import { useTranslation } from 'contexts/Localization'
import { useActiveIfoWithBlocks } from 'hooks/useActiveIfoWithBlocks'
import Image from 'next/image'
import { memo } from 'react'
import { useCurrentBlock } from 'state/block/hooks'
import styled from 'styled-components'
import { getStatus } from '../../../Ifos/hooks/helpers'
import { IFOImage, IFOMobileImage } from './images'
import * as S from './Styled'

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
    right: 0;
  }
  ${({ theme }) => theme.mediaQueries.lg} {
    bottom: -3px;
    right: 0;
  }
`
const IFOIconImage = styled.img`
  position: absolute;
  width: 35px;
  bottom: 35px;
  right: 95px;
  z-index: 2;
  ${({ theme }) => theme.mediaQueries.sm} {
    width: 60px;
    bottom: 25px;
    right: 196px;
    z-index: 2;
  }
`

const IFOBanner = () => {
  const { t } = useTranslation()
  const currentBlock = useCurrentBlock()

  const activeIfoWithBlocks = useActiveIfoWithBlocks()

  const isIfoAlive = !!(currentBlock && activeIfoWithBlocks && activeIfoWithBlocks.endBlock > currentBlock)
  const status = isIfoAlive
    ? getStatus(currentBlock, activeIfoWithBlocks.startBlock, activeIfoWithBlocks.endBlock)
    : null
  const { isMobile } = useMatchBreakpoints()
  return isIfoAlive && status ? (
    <S.Wrapper>
      <S.Inner>
        <S.LeftWrapper>
          <S.StyledSubheading>{status === 'live' ? t('Live') : t('Soon')}</S.StyledSubheading>
          <S.StyledHeading scale="xl">
            {activeIfoWithBlocks?.id ?? 'XXX'} {t('IFO')}
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
            src={`/images/tokens/${activeIfoWithBlocks.token.address}.svg`}
            alt={`${activeIfoWithBlocks.id}-svg`}
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
