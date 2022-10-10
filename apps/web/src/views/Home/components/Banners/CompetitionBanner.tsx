import { Flex, ArrowForwardIcon, Button, Text, useMatchBreakpoints } from '@pancakeswap/uikit'
import { NextLinkFromReactRouter } from 'components/NextLink'
import { useTranslation } from '@pancakeswap/localization'
import Image from 'next/image'
import { memo } from 'react'
import styled from 'styled-components'
import { modImage, modMobileImage, modWhiteLogo } from './images'
import * as S from './Styled'

const RightWrapper = styled.div`
  position: absolute;
  right: 0;
  bottom: -7px;
  ${({ theme }) => theme.mediaQueries.sm} {
    bottom: 0px;
  }
  ${({ theme }) => theme.mediaQueries.md} {
    bottom: 9px;
  }
  ${({ theme }) => theme.mediaQueries.lg} {
    bottom: -30px;
  }
`
const Header = styled(S.StyledHeading)`
  font-size: 20px;
  ${({ theme }) => theme.mediaQueries.sm} {
    font-size: 40px;
  }
`

const TradingCompetition = styled(S.StyledSubheading)`
  font-size: 16px;
  margin: 10px 0 0 4px;
  align-self: center;
  ${({ theme }) => theme.mediaQueries.sm} {
    font-size: 24px;
  }
`

const CompetitionBanner = () => {
  const { t } = useTranslation()
  const { isDesktop, isMobile } = useMatchBreakpoints()
  return (
    <S.Wrapper>
      <S.Inner>
        <S.LeftWrapper>
          <Flex>
            <Image
              src={modWhiteLogo}
              alt="ModLogo"
              width={isMobile ? '68px' : '112px'}
              height={isMobile ? '18px' : '33px'}
            />
            <TradingCompetition>{t('Trading Competition')}</TradingCompetition>
          </Flex>
          <Header width={['150px', '150px', 'auto']}>{t('$120,000 in Prizes!')}</Header>
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
            <Image src={modImage} alt="CompetitionBanner" width={632} height={338} placeholder="blur" />
          ) : (
            <Image src={modMobileImage} alt="CompetitionBanner" width={206} height={201} placeholder="blur" />
          )}
        </RightWrapper>
      </S.Inner>
    </S.Wrapper>
  )
}

export default memo(CompetitionBanner)
