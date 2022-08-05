import { Box, CoinSwitcher, Flex, PocketWatchIcon, Text, CloseIcon } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { useRouter } from 'next/router'
import { useCallback, useState } from 'react'
import { PREDICTION_TOOLTIP_DISMISS_KEY } from 'config/constants'
import { useGetCurrentRoundCloseTimestamp } from 'state/predictions/hooks'
import { PredictionSupportedSymbol } from 'state/types'
import styled, { keyframes } from 'styled-components'
import { useConfig } from '../context/ConfigProvider'
import { formatRoundTime } from '../helpers'
import useCountdown from '../hooks/useCountdown'
import LabelPrice from './LabelPrice'
import usePollOraclePrice from '../hooks/usePollOraclePrice'

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

export const PricePairLabel: React.FC = () => {
  const { token } = useConfig()
  const router = useRouter()
  const { t } = useTranslation()
  const { price } = usePollOraclePrice()
  const [dismissTooltip, setDismissTooltip] = useState(() => {
    if (localStorage?.getItem(PREDICTION_TOOLTIP_DISMISS_KEY)) return true
    return false
  })

  const onDismissTooltip = useCallback(() => {
    localStorage?.setItem(PREDICTION_TOOLTIP_DISMISS_KEY, '1')
    setDismissTooltip(true)
  }, [])

  const onTokenSwitch = useCallback(() => {
    if (router.query.token === PredictionSupportedSymbol.CAKE) {
      router.query.token = PredictionSupportedSymbol.BNB
    } else if (router.query.token === undefined && token.symbol === PredictionSupportedSymbol.CAKE) {
      router.query.token = PredictionSupportedSymbol.BNB
    } else if (router.query.token === undefined && token.symbol === PredictionSupportedSymbol.BNB) {
      router.query.token = PredictionSupportedSymbol.CAKE
    } else if (token.symbol === undefined && router.query.token === undefined) {
      router.query.token = PredictionSupportedSymbol.BNB
    } else {
      router.query.token = PredictionSupportedSymbol.CAKE
    }
    if (!dismissTooltip) onDismissTooltip()

    router.replace(router, undefined, { scroll: false })
  }, [router, token, dismissTooltip, onDismissTooltip])
  return (
    <>
      <Box pl={['20px', '20px', '20px', '20px', '40px']} position="relative" display="inline-block">
        {!dismissTooltip && (
          <Tooltip>
            <Text mr="5px" display="inline-block" verticalAlign="super">
              {t('Switch pairs here.')}
            </Text>
            <CloseIcon cursor="pointer" onClick={onDismissTooltip} />
          </Tooltip>
        )}
        <CoinSwitcher
          isDefaultBnb={router.query.token === 'BNB' || (router.query.token === undefined && token.symbol === 'BNB')}
          onTokenSwitch={onTokenSwitch}
        />
        <Label dir="left" backgroundOpacity={!dismissTooltip}>
          <Title bold textTransform="uppercase">
            {`${token.symbol}USD`}
          </Title>
          <LabelPrice price={price} />
        </Label>
      </Box>
    </>
  )
}

interface TimerLabelProps {
  interval: string
  unit: 'm' | 'h' | 'd'
}

export const TimerLabel: React.FC<TimerLabelProps> = ({ interval, unit }) => {
  const currentRoundCloseTimestamp = useGetCurrentRoundCloseTimestamp()
  const { secondsRemaining } = useCountdown(currentRoundCloseTimestamp)
  const countdown = formatRoundTime(secondsRemaining)
  const { t } = useTranslation()

  if (!currentRoundCloseTimestamp) {
    return null
  }

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
        <Interval fontSize="12px">{`${interval}${t(unit)}`}</Interval>
      </Label>
      <Token right={0}>
        <PocketWatchIcon />
      </Token>
    </Box>
  )
}
