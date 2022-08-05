import styled from 'styled-components'
import { useMemo } from 'react'
import { format } from 'date-fns'
import { useTranslation } from 'contexts/Localization'
import { LogoIcon, CheckmarkCircleIcon, CircleOutlineIcon, Flex, Text } from '@pancakeswap/uikit'

const sharedFlexStyles = `
  min-width: 86px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`

const ExpiredWrapper = styled(Flex)`
  ${sharedFlexStyles}

  svg {
    fill: ${({ theme }) => theme.colors.textSubtle};
  }
`

const ActiveWrapper = styled(Flex)`
  ${sharedFlexStyles}
`

const FutureWrapper = styled(Flex)`
  ${sharedFlexStyles}

  svg {
    fill: ${({ theme }) => theme.colors.textDisabled};
  }
`

const StyledText = styled(Text)`
  margin: 4px 0;
  font-weight: 600;
  font-size: 12px;
  color: ${({ theme }) => theme.colors.secondary};
`

const StyledDateText = styled(Text)`
  font-size: 12px;
  line-height: 120%;
  min-height: 29px;
  text-align: center;
  color: ${({ theme }) => theme.colors.textSubtle};
`

interface CountdownProps {
  index: number
  stepText: string
  timeStamp: number
  activeStepIndex: number
}

const Step: React.FC<CountdownProps> = ({ index, stepText, timeStamp, activeStepIndex }) => {
  const { t } = useTranslation()
  const isExpired = index < activeStepIndex
  const isActive = index === activeStepIndex
  const isFuture = index > activeStepIndex

  const timeFormat = useMemo(() => {
    if (timeStamp === 0) {
      return t('Now')
    }
    return format(timeStamp, 'MM/dd/yyyy HH:mm')
  }, [t, timeStamp])

  if (isExpired) {
    return (
      <ExpiredWrapper>
        <CheckmarkCircleIcon />
        <StyledText textTransform="uppercase">{stepText}</StyledText>
        <StyledDateText>{timeFormat}</StyledDateText>
      </ExpiredWrapper>
    )
  }

  if (isActive) {
    return (
      <ActiveWrapper>
        <LogoIcon />
        <StyledText textTransform="uppercase">{stepText}</StyledText>
        <StyledDateText>{timeFormat}</StyledDateText>
      </ActiveWrapper>
    )
  }

  if (isFuture) {
    return (
      <FutureWrapper>
        <CircleOutlineIcon />
        <StyledText textTransform="uppercase">{stepText}</StyledText>
        <StyledDateText>{timeFormat}</StyledDateText>
      </FutureWrapper>
    )
  }

  return <span>Er</span>
}

export default Step
