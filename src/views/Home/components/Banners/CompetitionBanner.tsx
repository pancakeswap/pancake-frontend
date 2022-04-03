import { ArrowForwardIcon, Button, Text, useMatchBreakpoints } from '@pancakeswap/uikit'
import { NextLinkFromReactRouter } from 'components/NextLink'
import { useTranslation } from 'contexts/Localization'
import Image from 'next/image'
import { memo } from 'react'
import styled from 'styled-components'
import { mboxImage, mboxMobileImage } from './images'
import * as S from './Styled'

const RightWrapper = styled.div`
  position: absolute;
  right: 0;
  bottom: 0px;
  ${({ theme }) => theme.mediaQueries.lg} {
    bottom: -30px;
  }
`
const CompetitionBanner = () => {
  const { t } = useTranslation()
  const { isDesktop } = useMatchBreakpoints()
  return (
    <S.Wrapper>
      <S.Inner>
        <S.LeftWrapper>
          <S.StyledSubheading>{t('Trading Competition')}</S.StyledSubheading>
          <S.StyledHeading scale="xl">{t('$80,000 in Prizes!')}</S.StyledHeading>
          <NextLinkFromReactRouter to="/competition">
            <Button>
              <Text color="invertedContrast" bold fontSize="16px" mr="4px">
                {t('Trade Now')}
              </Text>
              <ArrowForwardIcon color="invertedContrast" />
            </Button>
          </NextLinkFromReactRouter>
        </S.LeftWrapper>
        <RightWrapper>
          {isDesktop ? (
            <Image src={mboxImage} alt="CompetitionBanner" width={751} height={265} placeholder="blur" />
          ) : (
            <Image src={mboxMobileImage} alt="CompetitionBanner" width={338} height={207} placeholder="blur" />
          )}
        </RightWrapper>
      </S.Inner>
    </S.Wrapper>
  )
}

export default memo(CompetitionBanner)
