import { useCountdown } from '@pancakeswap/hooks'
import { useTranslation } from '@pancakeswap/localization'
import { Flex, InfoIcon, Text, useTooltip } from '@pancakeswap/uikit'
import { useMemo } from 'react'
import { styled } from 'styled-components'

const CountdownContainer = styled(Flex)`
  flex-direction: column;
  padding: 12px;
  border-bottom: solid 1px ${({ theme }) => theme.colors.cardBorder};

  ${({ theme }) => theme.mediaQueries.sm} {
    padding: 24px 12px;
  }
`

export const Countdown = ({ endDateTime }: { endDateTime: number }) => {
  const { t } = useTranslation()

  const { targetRef, tooltip, tooltipVisible } = useTooltip(
    <Text>
      {t('When the Quest time expires, the users who are eligible to get the reward will be randomly drawn')}
    </Text>,
    {
      placement: 'top',
    },
  )

  const countdown = useCountdown(endDateTime)

  const isTimeEnd = useMemo(() => new Date().getTime() / 1000 >= endDateTime, [endDateTime])

  if (!countdown) {
    return null
  }

  const days = isTimeEnd ? '0' : countdown?.days < 10 ? `0${countdown?.days}` : countdown?.days
  const hours = isTimeEnd ? '0' : countdown?.hours < 10 ? `0${countdown?.hours}` : countdown?.hours
  const minutes = isTimeEnd ? '0' : countdown?.minutes < 10 ? `0${countdown?.minutes}` : countdown?.minutes
  const seconds = isTimeEnd ? '0' : countdown?.seconds < 10 ? `0${countdown?.seconds}` : countdown?.seconds

  return (
    <CountdownContainer>
      <Flex m="auto" ref={targetRef}>
        <Text bold mr="4px">
          {t('Lucky Draw')}
        </Text>
        <InfoIcon color="textSubtle" style={{ alignSelf: 'center' }} />
      </Flex>
      {tooltipVisible && tooltip}
      <Flex justifyContent="center">
        <Flex width="40px" flexDirection="column" alignItems="center">
          <Text fontSize={['28px']} bold line-height="32px">
            {days}
          </Text>
          <Text fontSize={['12px']} color="textSubtle" bold line-height="14px">
            {t('Days')}
          </Text>
        </Flex>
        <Text fontSize={['28px']} m="0 8px" color="textSubtle" bold>
          :
        </Text>
        <Flex width="40px" flexDirection="column" alignItems="center">
          <Text fontSize={['28px']} bold line-height="32px">
            {hours}
          </Text>
          <Text fontSize={['12px']} color="textSubtle" bold line-height="14px">
            {t('Hours')}
          </Text>
        </Flex>
        <Text fontSize={['28px']} m="0 8px" color="textSubtle" bold>
          :
        </Text>
        <Flex width="40px" flexDirection="column" alignItems="center">
          <Text fontSize={['28px']} bold line-height="32px">
            {minutes}
          </Text>
          <Text fontSize={['12px']} color="textSubtle" bold line-height="14px">
            {t('Minutes')}
          </Text>
        </Flex>
        <Text fontSize={['28px']} m="0 8px" color="textSubtle" bold>
          :
        </Text>
        <Flex width="40px" flexDirection="column" alignItems="center">
          <Text fontSize={['28px']} bold line-height="32px">
            {seconds}
          </Text>
          <Text fontSize={['12px']} color="textSubtle" bold line-height="14px">
            {t('Seconds')}
          </Text>
        </Flex>
      </Flex>
    </CountdownContainer>
  )
}
