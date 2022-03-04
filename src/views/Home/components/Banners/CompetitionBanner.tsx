import { ArrowForwardIcon, Button, Text } from '@pancakeswap/uikit'
import { NextLinkFromReactRouter } from 'components/NextLink'
import { useTranslation } from 'contexts/Localization'
import Image from 'next/image'
import { memo } from 'react'
import styled from 'styled-components'
import { competitionImage } from './images'
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
    right: 0px;
    bottom: 0;
    transform: unset;
    opacity: 1;
    top: unset;
  }
`
const CompetitionBanner = () => {
  const { t } = useTranslation()

  return (
    <S.Wrapper>
      <S.Inner>
        <S.LeftWrapper>
          <S.StyledSubheading>Soon</S.StyledSubheading>
          <S.StyledHeading scale="xl">Competition</S.StyledHeading>
          <NextLinkFromReactRouter to="/competition">
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
            src={competitionImage}
            alt="CompetitionBanner"
            onError={(event) => {
              // @ts-ignore
              // eslint-disable-next-line no-param-reassign
              event.target.style.display = 'none'
            }}
            width={1112}
            height={213}
            placeholder="blur"
          />
        </RightWrapper>
      </S.Inner>
    </S.Wrapper>
  )
}

export default memo(CompetitionBanner)
