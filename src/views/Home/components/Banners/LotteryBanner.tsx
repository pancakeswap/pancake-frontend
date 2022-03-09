import { ArrowForwardIcon, Button, Heading, Skeleton, Text, useMatchBreakpoints } from '@pancakeswap/uikit'
import { NextLinkFromReactRouter } from 'components/NextLink'
import { LotteryStatus } from 'config/constants/types'
import { useTranslation } from 'contexts/Localization'
import Image from 'next/image'
import { memo } from 'react'
import { usePriceCakeBusd } from 'state/farms/hooks'
import { useLottery } from 'state/lottery/hooks'
import styled from 'styled-components'
import { getBalanceNumber } from 'utils/formatBalance'
import getTimePeriods from 'utils/getTimePeriods'
import Timer from 'views/Lottery/components/Countdown/Timer'
import useGetNextLotteryEvent from 'views/Lottery/hooks/useGetNextLotteryEvent'
import useNextEventCountdown from 'views/Lottery/hooks/useNextEventCountdown'
import { lotteryImage, lotteryMobileImage } from './images'
import * as S from './Styled'

const RightWrapper = styled.div`
  position: absolute;
  right: 0;
  bottom: -8px;
  ${({ theme }) => theme.mediaQueries.sm} {
    bottom: -5px;
  }
`
const TimerWrapper = styled.div`
  ${({ theme }) => theme.mediaQueries.sm} {
    margin-bottom: 16px;
  }
  margin-bottom: 8px;
  .custom-timer {
    background: url('/images/decorations/countdownBg.png');
    background-repeat: no-repeat;
    background-size: 100% 100%;
    padding: 0px 10px 7px;
    display: inline-flex;
  }
`

export const StyledSubheading = styled(Heading)`
  font-size: 20px;
  color: white;
  ${({ theme }) => theme.mediaQueries.xs} {
    font-size: 24px;
  }
  ${({ theme }) => theme.mediaQueries.sm} {
    -webkit-text-stroke: unset;
  }
  margin-bottom: 8px;
`

const LotteryPrice: React.FC = () => {
  const {
    currentRound: { amountCollectedInCake, status },
  } = useLottery()
  const cakePriceBusd = usePriceCakeBusd()
  const prizeInBusd = amountCollectedInCake.times(cakePriceBusd)
  const prizeTotal = getBalanceNumber(prizeInBusd)
  const { t } = useTranslation()

  if (status === LotteryStatus.OPEN) {
    return (
      <>
        {prizeInBusd.isNaN() ? (
          <Skeleton height={20} width={90} display="inline-block" />
        ) : (
          t('Win $ %prize% in Lottery', { prize: prizeTotal.toFixed(0) })
        )}
      </>
    )
  }
  return null
}

const LotteryCountDownTimer = () => {
  const {
    currentRound: { status, endTime },
  } = useLottery()
  const endTimeAsInt = parseInt(endTime, 10)
  const { nextEventTime } = useGetNextLotteryEvent(endTimeAsInt, status)
  const secondsRemaining = useNextEventCountdown(nextEventTime)
  const { days, hours, minutes, seconds } = getTimePeriods(secondsRemaining)
  return <Timer wrapperClassName="custom-timer" seconds={seconds} minutes={minutes} hours={hours} days={days} />
}

const LotteryBanner = () => {
  const { t } = useTranslation()
  const { isDesktop } = useMatchBreakpoints()
  return (
    <S.Wrapper>
      <S.Inner>
        <S.LeftWrapper>
          <StyledSubheading>
            <LotteryPrice />
          </StyledSubheading>
          <TimerWrapper>
            <LotteryCountDownTimer />
          </TimerWrapper>
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
          {isDesktop ? (
            <Image src={lotteryImage} alt="LotteryBanner" width={1112} height={192 + 32} placeholder="blur" />
          ) : (
            <Image
              className="mobile"
              src={lotteryMobileImage}
              alt="LotteryBanner"
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
