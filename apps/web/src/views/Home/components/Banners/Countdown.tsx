import { Box, useMatchBreakpoints } from '@pancakeswap/uikit'
import styled from 'styled-components'
import { useCountdown } from '@pancakeswap/hooks'
import { useTranslation } from '@pancakeswap/localization'

const CountDownWrapper = styled.div`
  display: flex;
  background-color: #082814;
  font-family: Kanit;
  font-size: 18px;
  font-style: normal;
  font-weight: 600;
  line-height: 90%;
  color: white;
  padding: 8px;
  border-radius: 8px;
  margin-top: 5px;
  gap: 0px;
  flex-direction: column;
  width: max-content;
  ${({ theme }) => theme.mediaQueries.sm} {
    flex-direction: row;
    gap: 8px;
    font-size: 20px;
    line-height: 110%; /* 22px */
  }
`

type CountdownProps = {
  startTime: number
}

export const Countdown: React.FC<CountdownProps> = ({ startTime }) => {
  const { t } = useTranslation()
  const { isMobile } = useMatchBreakpoints()
  const countdown = useCountdown(startTime)
  if (!countdown) {
    return null
  }
  const hours = countdown?.hours < 10 ? `0${countdown?.hours}` : countdown?.hours
  const minutes = countdown?.minutes < 10 ? `0${countdown?.minutes}` : countdown?.minutes
  const days = countdown?.days < 10 ? `0${countdown?.days}` : countdown?.days
  return (
    <CountDownWrapper>
      <Box style={{ fontSize: isMobile ? '12px' : '20px' }}>{t('Starts in')}</Box>
      <Box>
        {days}
        {t('d')} : {hours}
        {t('h')} : {minutes}
        {t('m')}
      </Box>
    </CountDownWrapper>
  )
}
