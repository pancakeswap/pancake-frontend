import {
  ArrowForwardIcon,
  Button,
  Heading,
  Skeleton,
  Text,
  useMatchBreakpoints,
  NextLinkFromReactRouter,
} from '@pancakeswap/uikit'
import BigNumber from 'bignumber.js'
import { FetchStatus, LotteryStatus } from 'config/constants/types'
import { useTranslation } from '@pancakeswap/localization'
import Image from 'next/legacy/image'
import { memo } from 'react'
import { usePriceCakeBusd } from 'state/farms/hooks'
import { LotteryResponse } from 'state/types'
import styled from 'styled-components'
import useSWR from 'swr'
import { getBalanceNumber } from '@pancakeswap/utils/formatBalance'
import getTimePeriods from '@pancakeswap/utils/getTimePeriods'
import Timer from 'views/Lottery/components/Countdown/Timer'
import useGetNextLotteryEvent from 'views/Lottery/hooks/useGetNextLotteryEvent'
import useNextEventCountdown from './hooks/useNextEventCountdown'
import { lotteryImage, lotteryMobileImage } from './images'
import * as S from './Styled'

const RightWrapper = styled.div`
  position: absolute;
  right: 0;
  bottom: -8px;
  ${({ theme }) => theme.mediaQueries.sm} {
    right: 1px;
    bottom: 1px;
  }
  ${({ theme }) => theme.mediaQueries.md} {
    right: 0px;
    bottom: 8px;
  }
  ${({ theme }) => theme.mediaQueries.lg} {
    right: 0px;
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
    white-space: nowrap;
    transform: scale(0.88);
    transform-origin: top left;
  }
`

export const StyledSubheading = styled(Heading)`
  font-size: 20px;
  color: white;
  ${({ theme }) => theme.mediaQueries.xs} {
    font-size: 24px;
    &.lottery {
      font-size: 20px;
    }
  }
  ${({ theme }) => theme.mediaQueries.sm} {
    -webkit-text-stroke: unset;
  }
  margin-bottom: 8px;
`
const isLotteryLive = (status: LotteryStatus) => status === LotteryStatus.OPEN

const LotteryPrice: React.FC<React.PropsWithChildren> = () => {
  const { data } = useSWR<LotteryResponse>(['currentLottery'])
  const cakePriceBusd = usePriceCakeBusd()
  const prizeInBusd = new BigNumber(data.amountCollectedInCake).times(cakePriceBusd)
  const prizeTotal = getBalanceNumber(prizeInBusd)
  const { t } = useTranslation()

  if (isLotteryLive(data.status)) {
    return (
      <>
        {prizeInBusd.isNaN() ? (
          <Skeleton height={20} width={90} display="inline-block" />
        ) : (
          t('Win $%prize% in Lottery', {
            prize: prizeTotal.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }),
          })
        )}
      </>
    )
  }
  return null
}

const LotteryCountDownTimer = () => {
  const { data } = useSWR<LotteryResponse>(['currentLottery'])
  const endTimeAsInt = parseInt(data.endTime, 10)
  const { nextEventTime } = useGetNextLotteryEvent(endTimeAsInt, data.status)
  const secondsRemaining = useNextEventCountdown(nextEventTime)
  const { days, hours, minutes, seconds } = getTimePeriods(secondsRemaining)
  if (isLotteryLive(data.status))
    return <Timer wrapperClassName="custom-timer" seconds={seconds} minutes={minutes} hours={hours} days={days} />
  return null
}

const LotteryBanner = () => {
  const { t } = useTranslation()
  const { isDesktop } = useMatchBreakpoints()
  const { data, status } = useSWR<LotteryResponse>(['currentLottery'])

  return (
    <S.Wrapper>
      <S.Inner>
        <S.LeftWrapper>
          {status === FetchStatus.Fetched && isLotteryLive(data.status) ? (
            <>
              <StyledSubheading className="lottery" style={{ textShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)' }}>
                <LotteryPrice />
              </StyledSubheading>
              <TimerWrapper>
                <LotteryCountDownTimer />
              </TimerWrapper>
            </>
          ) : (
            <>
              <S.StyledSubheading>{t('Lottery')}</S.StyledSubheading>
              <S.StyledHeading scale="xl">{t('Preparing')}</S.StyledHeading>
            </>
          )}
          <NextLinkFromReactRouter to="/lottery">
            <Button>
              <Text color="invertedContrast" bold fontSize="16px" mr="4px">
                {status === FetchStatus.Fetched && isLotteryLive(data.status) ? t('Play Now') : t('Check Now')}
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
              width={190}
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
