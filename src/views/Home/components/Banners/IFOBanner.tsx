import { ArrowForwardIcon, Button, Text } from '@pancakeswap/uikit'
import { NextLinkFromReactRouter } from 'components/NextLink'
import { useTranslation } from 'contexts/Localization'
import { useActiveIfoWithBlocks } from 'hooks/useActiveIfoWithBlocks'
import Image from 'next/image'
import { memo } from 'react'
import { useCurrentBlock } from 'state/block/hooks'
import styled from 'styled-components'
import { getStatus } from '../../../Ifos/hooks/helpers'
import { IFOImage } from './images'
import * as S from './Styled'

const RightWrapper = styled.div`
  position: absolute;
  right: -17px;
  opacity: 0.9;
  transform: translate(0, -50%);
  top: 50%;

  img {
    height: 100%;
    width: 500px;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    right: 24px;
    bottom: 0;
    transform: unset;
    opacity: 1;
    top: unset;
    height: 211px;
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

  return isIfoAlive && status ? (
    <S.Wrapper>
      <S.Inner>
        <S.LeftWrapper>
          <S.StyledSubheading>{status === 'live' ? t('Live') : t('Soon')}</S.StyledSubheading>
          <S.StyledHeading scale="xl">{activeIfoWithBlocks.id} IFO</S.StyledHeading>
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
          <Image
            src={IFOImage}
            alt={`IFO ${activeIfoWithBlocks.id}`}
            onError={(event) => {
              // @ts-ignore
              // eslint-disable-next-line no-param-reassign
              event.target.style.display = 'none'
            }}
            width={291}
            height={211}
            placeholder="blur"
          />
        </RightWrapper>
      </S.Inner>
    </S.Wrapper>
  ) : null
}

export default memo(IFOBanner)
