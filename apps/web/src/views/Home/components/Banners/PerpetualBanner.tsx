import { useTranslation } from '@pancakeswap/localization'
import {
  ArrowForwardIcon,
  Button,
  Link,
  Text,
  useIsomorphicEffect,
  useMatchBreakpoints,
  useModal,
} from '@pancakeswap/uikit'
import USCitizenConfirmModal from 'components/Modal/USCitizenConfirmModal'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { useUserNotUsCitizenAcknowledgement } from 'hooks/useUserIsUsCitizenAcknowledgement'
import Image from 'next/legacy/image'
import { memo, useMemo, useRef } from 'react'
import styled, { useTheme } from 'styled-components'
import { getPerpetualUrl } from 'utils/getPerpetualUrl'
import { perpetualImage, perpetualMobileImage } from './images'
import * as S from './Styled'

const RightWrapper = styled.div`
  position: absolute;
  min-height: 100%;
  right: 0;
  bottom: 0px;
  ${({ theme }) => theme.mediaQueries.sm} {
    bottom: 8.2px;
  }
  ${({ theme }) => theme.mediaQueries.md} {
    bottom: 9px;
  }
  ${({ theme }) => theme.mediaQueries.lg} {
    bottom: -2px;
  }
`
const Header = styled(S.StyledHeading)`
  font-size: 20px;
  min-height: 44px;
  ${({ theme }) => theme.mediaQueries.sm} {
    font-size: 40px;
    min-height: auto;
  }
`

const HEADING_ONE_LINE_HEIGHT = 27

const PerpetualBanner = () => {
  const {
    t,
    currentLanguage: { code },
  } = useTranslation()
  const { isDesktop, isMobile } = useMatchBreakpoints()
  const { isDark } = useTheme()
  const { chainId } = useActiveChainId()

  const perpetualUrl = useMemo(() => getPerpetualUrl({ chainId, languageCode: code, isDark }), [chainId, code, isDark])
  const headerRef = useRef<HTMLDivElement>(null)
  const [onUSCitizenModalPresent] = useModal(<USCitizenConfirmModal />, true, false, 'usCitizenConfirmModal')
  const [userNotUsCitizenAcknowledgement] = useUserNotUsCitizenAcknowledgement()

  useIsomorphicEffect(() => {
    const target = headerRef.current
    target.style.fontSize = '' // reset
    target.style.lineHeight = ''
    if (!target || !isMobile) return
    if (target.offsetHeight > HEADING_ONE_LINE_HEIGHT) {
      target.style.fontSize = '18px'
      target.style.lineHeight = `${HEADING_ONE_LINE_HEIGHT}px`
    }
  }, [isMobile, code])

  return (
    <S.Wrapper>
      <S.Inner>
        <S.LeftWrapper>
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
        </RightWrapper>
      </S.Inner>
    </S.Wrapper>
  )
}

export default memo(PerpetualBanner)
