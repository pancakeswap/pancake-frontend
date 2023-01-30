import { ArrowForwardIcon, Button, Text, Link, useMatchBreakpoints } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import { memo } from 'react'
import styled from 'styled-components'
import * as S from './Styled'

const RightWrapper = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 0;
  top: 0;
  left: 0;

  > img {
    position: absolute;
  }

  & :nth-child(1) {
    right: 4%;
    bottom: 0%;
    z-index: 1;
  }

  & :nth-child(2),
  & :nth-child(3) {
    display: none;
  }

  & :nth-child(2) {
    top: 0;
    left: 42%;
  }

  & :nth-child(3) {
    bottom: 0;
    right: 18%;
  }

  ${({ theme }) => theme.mediaQueries.md} {
    & :nth-child(2),
    & :nth-child(3) {
      display: block;
    }

    & :nth-child(1) {
      width: 180px;
      height: 280px;
      bottom: -8%;
    }
  }
`
const Title = styled.div`
  font-family: 'Kanit';
  font-style: normal;
  font-weight: 600;
  font-size: 23px;
  line-height: 110%;
  color: #ffffff;
  text-shadow: 0px 2px 2px rgba(0, 0, 0, 0.25);
  margin-bottom: 21px;

  @media screen and (max-width: 375px) {
    font-size: 21px;
  }
  ${({ theme }) => theme.mediaQueries.sm} {
    font-size: 35px;
  }
  ${({ theme }) => theme.mediaQueries.md} {
    font-size: 40px;
  }
`

const CnyBanner = () => {
  const { t } = useTranslation()
  const { isMobile } = useMatchBreakpoints()
  return (
    <S.Wrapper
      style={{
        marginTop: '0px',
        padding: isMobile ? '2px 0' : '0',
        background: 'linear-gradient(180deg, #ED6D42 0%, #8D1F0B 100%)',
      }}
    >
      <S.Inner>
        <S.LeftWrapper>
          <S.StyledSubheading>{t('CNY Lottery Draw')}</S.StyledSubheading>
          <Title>{t('Up to $150K in Prizes')}</Title>
          <Link href="/lottery">
            <Button>
              <Text color="invertedContrast" bold fontSize="16px" mr="4px">
                {t('Lottery')}
              </Text>
              <ArrowForwardIcon color="invertedContrast" />
            </Button>
          </Link>
        </S.LeftWrapper>
        <RightWrapper>
          <img src="/images/cny-asset/banner-1.png" alt="" width={130} height={180} />
          <img src="/images/cny-asset/banner-2.png" alt="" width={294} height={67.33} />
          <img src="/images/cny-asset/banner-3.png" alt="" width={294} height={67.33} />
        </RightWrapper>
      </S.Inner>
    </S.Wrapper>
  )
}

export default memo(CnyBanner)
