import { ArrowForwardIcon, Button, Text } from '@pancakeswap/uikit'
import { NextLinkFromReactRouter } from 'components/NextLink'
import { useTranslation } from 'contexts/Localization'
import useMediaQuery from 'hooks/useMediaQuery'
import useTheme from 'hooks/useTheme'
import Image from 'next/image'
import { memo } from 'react'
import styled from 'styled-components'
import { lotteryImage, lotteryMobileImage } from './images'
import * as S from './Styled'

const RightWrapper = styled.div`
  position: absolute;
  right: 0;
  bottom: 0px;
  ${({ theme }) => theme.mediaQueries.sm} {
    bottom: -5px;
  }
`
const LotteryBanner = () => {
  const { t } = useTranslation()
  const theme = useTheme()
  const isDeskTop = useMediaQuery(theme.theme.mediaQueries.sm.replace('@media screen and ', ''))
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
          {isDeskTop && (
            <Image
              src={lotteryImage}
              alt="LotteryBanner"
              onError={(event) => {
                // @ts-ignore
                // eslint-disable-next-line no-param-reassign
                event.target?.style.display = 'none'
              }}
              width={1112}
              height={192 + 32}
              placeholder="blur"
            />
          )}
          {!isDeskTop && (
            <Image
              className="mobile"
              src={lotteryMobileImage}
              alt="LotteryBanner"
              onError={(event) => {
                // @ts-ignore
                // eslint-disable-next-line no-param-reassign
                event.target?.style.display = 'none'
              }}
              width={215}
              height={144}
              placeholder="blur"
            />
          )}
        </RightWrapper>
      </S.Inner>
    </S.Wrapper>
  )
}

export default memo(LotteryBanner)
