import { useTranslation } from '@pancakeswap/localization'
import { Box, Flex, PocketWatchIcon, Text } from '@pancakeswap/uikit'
import { useGetCurrentRoundCloseTimestamp, useGetIntervalTimeInMinutes } from 'state/predictions/hooks'
import { keyframes, styled } from 'styled-components'
import { formatRoundTime } from '../helpers'
import useCountdown from '../hooks/useCountdown'

const Token = styled(Box)`
  margin-top: -24px;
  position: absolute;
  top: 50%;
  z-index: 30;

  & > svg {
    height: 48px;
    width: 48px;
  }

  ${({ theme }) => theme.mediaQueries.lg} {
    margin-top: -32px;

    & > svg {
      height: 64px;
      width: 64px;
    }
  }
`

const Title = styled(Text)`
  font-size: 16px;
  line-height: 21px;

  ${({ theme }) => theme.mediaQueries.lg} {
    font-size: 20px;
    line-height: 22px;
  }
`

const ClosingTitle = styled(Text)`
  font-size: 9px;
  line-height: 21px;

  ${({ theme }) => theme.mediaQueries.sm} {
    font-size: 16px;
  }

  ${({ theme }) => theme.mediaQueries.lg} {
    font-size: 20px;
    line-height: 22px;
  }
`

const Interval = styled(Text)`
  ${({ theme }) => theme.mediaQueries.lg} {
    text-align: center;
    width: 32px;
  }
`

const tooltipAnimation = keyframes`
  0%{
    opacity:0;
  }
  20%{
    opacity:1;
  }
  30%{
    transform: translateX(5px);
  }
  40%{
    transform: translateX(0px);
  }
  50%{
    transform: translateX(5px);
  }
  60%{
    transform: translateX(5px);
  }
  100%{
    opacity:1;
  }
`

export const Tooltip = styled.div`
  position: absolute;
  top: -5px;
  left: 55px;
  border-radius: 16px;
  padding: 16px;
  background: ${({ theme }) => theme.tooltip.background};
  box-shadow: ${({ theme }) => theme.tooltip.boxShadow};
  white-space: nowrap;
  opacity: 0;
  z-index: 100;
  animation: ${tooltipAnimation} 3s forwards ease-in-out;
  ${Text},svg {
    color: ${({ theme }) => theme.tooltip.text};
  }
  ${({ theme }) => theme.mediaQueries.md} {
    top: -10px;
    left: 81px;
  }

  &::before {
    content: '';
    position: absolute;
    top: 21px;
    left: -6px;
    width: 15px;
    height: 15px;
    border-radius: 3px;
    background: ${({ theme }) => theme.tooltip.background};
    transform: rotate(45deg);
  }
`

const Label = styled(Flex)<{ dir: 'left' | 'right'; backgroundOpacity?: boolean }>`
  position: relative;
  z-index: 1;
  background-color: ${({ theme }) => theme.card.background};
  box-shadow: ${({ theme }) => theme.shadows.level1};
  align-items: ${({ dir }) => (dir === 'right' ? 'flex-end' : 'flex-start')};
  border-radius: ${({ dir }) => (dir === 'right' ? '8px 8px 8px 24px' : '8px 8px 24px 8px')};
  flex-direction: column;
  overflow: initial;
  padding: ${({ dir }) => (dir === 'right' ? '0 28px 0 8px' : '0 8px 0 24px')};

  ${({ theme }) => theme.mediaQueries.lg} {
    background-color: ${({ theme, backgroundOpacity }) => (backgroundOpacity ? 'transparent' : theme.card.background)};
    align-items: center;
    border-radius: ${({ theme }) => theme.radii.card};
    flex-direction: row;
    padding: ${({ dir }) => (dir === 'right' ? '8px 40px 8px 8px' : '8px 8px 8px 40px')};
    transition: 0.3s background-color ease-in-out;
    will-change: background-color;
  }
`

export const TimerLabel = () => {
  const { t } = useTranslation()
  const interval = useGetIntervalTimeInMinutes()
  const currentRoundCloseTimestamp = useGetCurrentRoundCloseTimestamp()
  const { secondsRemaining } = useCountdown(currentRoundCloseTimestamp ?? 0)

  if (!currentRoundCloseTimestamp) {
    return null
  }

  const countdown = formatRoundTime(secondsRemaining)

  return (
    <Box pr="24px" position="relative">
      <Label dir="right">
        {secondsRemaining !== 0 ? (
          <Title bold color="secondary">
            {countdown}
          </Title>
        ) : (
          <ClosingTitle bold color="secondary">
            {t('Closing')}
          </ClosingTitle>
        )}
        <Interval fontSize="12px">{`${interval}${t('m')}`}</Interval>
      </Label>
      <Token right={0}>
        <PocketWatchIcon />
      </Token>
    </Box>
  )
}
