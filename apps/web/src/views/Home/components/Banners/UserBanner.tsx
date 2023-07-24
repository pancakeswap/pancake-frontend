import { useTranslation } from '@pancakeswap/localization'
import { useMatchBreakpoints } from '@pancakeswap/uikit'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { memo } from 'react'
import styled, { useTheme } from 'styled-components'
import UserInfoBanner from '../UserBanner'
import * as S from './Styled'

const StyledInner = styled(S.Inner)`
  padding: 0;
  height: 100%;
  max-height: auto;
  > div {
    width: 100%;
    min-height: 188px;
    border-radius: 32px;
  }
`

const PerpetualBanner = () => {
  const { t } = useTranslation()
  const { isDesktop, isMobile } = useMatchBreakpoints()
  const { isDark } = useTheme()
  const { chainId } = useActiveChainId()

  return (
    <S.Wrapper
      style={{
        background: 'linear-gradient(180deg, rgba(67, 69, 117, 0.80) 0%, rgba(102, 87, 141, 0.80) 100%)',
      }}
    >
      <StyledInner>
        <UserInfoBanner />
        {/* <S.LeftWrapper>
          <S.StyledSubheading ref={headerRef}>{t('Perpetual Futures')}</S.StyledSubheading>
          <Header width={['160px', '160px', 'auto']}>{t('Up to 100× Leverage')}</Header>
          <Link
            href={perpetualUrl}
            external
            onClick={(e) => {
              if (!userNotUsCitizenAcknowledgement) {
                e.stopPropagation()
                e.preventDefault()
                onUSCitizenModalPresent()
              }
            }}
          >
            <Button>
              <Text color="invertedContrast" bold fontSize="16px" mr="4px">
                {t('Trade Now')}
              </Text>
              <ArrowForwardIcon color="invertedContrast" />
            </Button>
          </Link>
        </S.LeftWrapper>
        <RightWrapper>
          {isDesktop ? (
            <Image src={perpetualImage} alt="PerpetualBanner" width={392} height={232} placeholder="blur" />
          ) : (
            <Image src={perpetualMobileImage} alt="PerpetualBanner" width={208} height={208} placeholder="blur" />
          )}
        </RightWrapper> */}
      </StyledInner>
    </S.Wrapper>
  )
}

export default memo(PerpetualBanner)
