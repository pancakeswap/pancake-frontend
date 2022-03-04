import { ArrowForwardIcon, Button, Text } from '@pancakeswap/uikit'
import { NextLinkFromReactRouter } from 'components/NextLink'
import { useTranslation } from 'contexts/Localization'
import Image from 'next/image'
import { memo } from 'react'
import styled from 'styled-components'
import { lotteryImage } from './images'
import * as S from './Styled'

const RightWrapper = styled.div`
  position: absolute;
  right: -17px;
  opacity: 0.9;
  transform: translate(0, -50%);
  top: 50%;

  & img {
    height: 100%;
    width: 174px;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    position: absolute;
    right: 0;
    top: unset;
    bottom: -5px;
    transform: unset;
    opacity: 1;

    & img {
      height: 130%;
      width: unset;
    }
  }
`
const LotteryBanner = () => {
  const { t } = useTranslation()

  return (
    <S.Wrapper>
      <S.Inner>
        <S.LeftWrapper>
          <S.StyledSubheading>{t('Soon')}</S.StyledSubheading>
          <S.StyledHeading scale="xl">Lottery</S.StyledHeading>
          <NextLinkFromReactRouter to="/lottery">
            <Button>
              <Text color="invertedContrast" bold fontSize="16px" mr="4px">
                {t('Play Now')}
              </Text>
              <ArrowForwardIcon color="invertedContrast" />
            </Button>
          </NextLinkFromReactRouter>
        </S.LeftWrapper>
        <RightWrapper>
          <Image
            src={lotteryImage}
            alt="LotteryBanner"
            onError={(event) => {
              // @ts-ignore
              // eslint-disable-next-line no-param-reassign
              event.target.style.display = 'none'
            }}
            width={1112}
            height={192 + 32}
            placeholder="blur"
          />
        </RightWrapper>
      </S.Inner>
    </S.Wrapper>
  )
}

export default memo(LotteryBanner)
