import styled from 'styled-components'
import { format } from 'date-fns'
import { LogoIcon, CheckmarkCircleIcon, CircleOutlineIcon, Flex, Text } from '@pancakeswap/uikit'
import { CountdownProps } from '../../types'

const sharedFlexStyles = `
  min-width: 78px;
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
  margin-bottom: 4px;
  font-weight: 600;
  font-size: 12px;
  color: ${({ theme }) => theme.colors.secondary};
`

const StyledDateText = styled(Text)`
  margin-bottom: 14px;
  font-size: 12px;
  line-height: 120%;
  text-align: center;
  color: ${({ theme }) => theme.colors.textSubtle};
`

const Step: React.FC<CountdownProps> = ({ index, stepText, activeStepIndex }) => {
  const isExpired = index < activeStepIndex
  const isActive = index === activeStepIndex
  const isFuture = index > activeStepIndex

  if (isExpired) {
    return (
      <ExpiredWrapper>
        <StyledText>{stepText}</StyledText>
        <StyledDateText>{format(1652250897000, 'MM/dd/yyyy HH:mm')}</StyledDateText>
        <CheckmarkCircleIcon />
      </ExpiredWrapper>
    )
  }

  if (isActive) {
    return (
      <ActiveWrapper>
        <StyledText>{stepText}</StyledText>
        <StyledDateText>{format(1652250897000, 'MM/dd/yyyy HH:mm')}</StyledDateText>
        <LogoIcon />
      </ActiveWrapper>
    )
  }

  if (isFuture) {
    return (
      <FutureWrapper>
        <StyledText>{stepText}</StyledText>
        <StyledDateText>{format(1652250897000, 'MM/dd/yyyy HH:mm')}</StyledDateText>
        <CircleOutlineIcon />
      </FutureWrapper>
    )
  }

  return <span>Er</span>
}

export default Step
