import { memo } from 'react'
import styled from 'styled-components'
import Image from 'next/image'
import { Flex, FlexGap, useMatchBreakpoints, Link } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'

import { ASSET_CDN } from 'config/constants/endpoints'

import { Wrapper, Inner } from './Styled'
import bg from './images/spain-meetup-bg.png'
import bunny from './images/spain-meetup-bunny.png'
import ticketBtn from './images/spain-meetup-ticket-btn.png'
import { Countdown } from './Countdown'

const pancakeSwapLogo = `${ASSET_CDN}/web/banners/ethXpancakeswap.png`

const BgWrapper = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  overflow: hidden;
  height: 100%;
  width: 100%;
  border-radius: 32px;
  z-index: 1;
`

const ContentWrapper = styled(FlexGap)`
  position: relative;
  z-index: 2;
`

const StyledHeading = styled.div`
  position: relative;
  font-family: 'Kanit';
  font-style: normal;
  font-weight: 800;
  font-size: 1rem;
  line-height: 98%;
  letter-spacing: 0.01em;
  font-feature-settings: 'liga' off;
  background: linear-gradient(180deg, #ffffff 0%, #fcef79 100%);

  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  &::after {
    letter-spacing: 0.01em;
    background: linear-gradient(180deg, #ffffff 0%, #fcef79 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    content: attr(data-text);
    -webkit-text-stroke: 3px #341a57;
    position: absolute;
    left: 0;
    top: 0;
    z-index: -1;
  }

  ${({ theme }) => theme.mediaQueries.md} {
    font-size: 1.75rem;

    &::after {
      -webkit-text-stroke-width: 6px;
    }
  }
`

const HeadLine = styled.div`
  position: relative;
  font-family: 'Kanit';
  font-style: normal;
  font-weight: 900;
  font-size: 3rem;
  line-height: 98%;
  letter-spacing: 0.01em;
  background: linear-gradient(166.02deg, #d06b6b -5.1%, #ffeb37 75.24%);

  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  &::after {
    letter-spacing: 0.01em;
    background: linear-gradient(166.02deg, #d06b6b -5.1%, #ffeb37 75.24%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    content: attr(data-text);
    -webkit-text-stroke: 6px #341a57;
    position: absolute;
    left: 0;
    top: 0;
    z-index: -1;
  }

  ${({ theme }) => theme.mediaQueries.md} {
    font-size: 4rem;
    &::after {
      -webkit-text-stroke-width: 9px;
    }
  }
`

const BunnyContainer = styled.div`
  pointer-events: none;
  position: absolute;
  right: -2rem;
  bottom: -1.68em;
  z-index: 2;

  ${({ theme }) => theme.mediaQueries.md} {
    right: 0;
  }
`

const TicketBtnContainer = styled.div`
  position: absolute;
  right: 2rem;
  bottom: 2rem;
  z-index: 1;

  ${({ theme }) => theme.mediaQueries.md} {
    right: 10.125rem;
    bottom: 0.5rem;
  }
`

export const SpainMeetupBanner = memo(function SpainMeetupBanner() {
  const { t } = useTranslation()
  const { isMobile, isDesktop } = useMatchBreakpoints()

  return (
    <Wrapper>
      <Inner>
        <BgWrapper>
          <Image fill src={bg} alt="spain meetup bg" objectFit="cover" objectPosition="left" />
        </BgWrapper>
        <ContentWrapper gap="1rem" width="100%">
          <FlexGap gap={isMobile ? '1rem' : '0.5rem'} flexDirection="column">
            <Image
              src={pancakeSwapLogo}
              alt="pancakeSwapLogo"
              width={isMobile ? 100 : 132}
              height={isMobile ? 15 : 22}
              unoptimized
            />
            <StyledHeading data-text={t('PancakeSwap Meetup')}>{t('PancakeSwap Meetup')}</StyledHeading>
            <Flex ml={isMobile ? 0 : '6rem'}>
              <HeadLine data-text={t('Spain')}>{t('Spain')}</HeadLine>
            </Flex>
          </FlexGap>
          {isDesktop && (
            <FlexGap>
              <Countdown startTime={1702659600} />
            </FlexGap>
          )}
          <Flex height="100%">
            <BunnyContainer>
              <Image src={bunny} alt="bunny" height={isMobile ? 120 : 240} unoptimized />
            </BunnyContainer>
            <TicketBtnContainer>
              <Link
                href="https://www.eventbrite.com/e/entradas-pancakeswap-meetup-in-spain-764126180977?aff=oddtdtcreator"
                external
                style={{ textDecoration: 'none' }}
              >
                <Image src={ticketBtn} alt="get ticket button" height={isMobile ? 48 : 68} unoptimized />
              </Link>
            </TicketBtnContainer>
          </Flex>
        </ContentWrapper>
      </Inner>
    </Wrapper>
  )
})
