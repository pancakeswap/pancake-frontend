import { useTranslation } from '@pancakeswap/localization'
import { styled } from 'styled-components'
import { Flex, Heading, Text } from '@pancakeswap/uikit'
import getTimePeriods from '@pancakeswap/utils/getTimePeriods'

const FlexGap = styled(Flex)<{ gap: string }>`
  gap: ${({ gap }) => gap};
  width: fit-content;
`

const FlexContainer = styled(FlexGap)`
  border-bottom: dotted 1px white;
`

const StyledTimerText = styled(Heading)`
  background: linear-gradient(180deg, #8051d6 0%, #492286 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`

const StyledWhiteText = styled(Text)`
  color: white;
  margin-bottom: 0px;
  align-self: flex-end;

  ${({ theme }) => theme.mediaQueries.md} {
    margin-bottom: 3px;
  }
`

const Timer: React.FC<React.PropsWithChildren<{ secondsRemaining: number; text: string }>> = ({
  secondsRemaining,
  text,
}) => {
  const { t } = useTranslation()
  const { days, hours, minutes } = getTimePeriods(secondsRemaining)

  return (
    <>
      <FlexContainer mt="32px" gap="8px" alignItems="center">
        <FlexGap gap="4px" alignItems="baseline">
          {days ? (
            <>
              <StyledTimerText scale="xl">{days}</StyledTimerText>
              <StyledTimerText>{t('d')}</StyledTimerText>
            </>
          ) : null}
          {days || hours ? (
            <>
              <StyledTimerText scale="xl">{hours}</StyledTimerText>
              <StyledTimerText color="secondary">{t('h')}</StyledTimerText>
            </>
          ) : null}
          <>
            <StyledTimerText scale="xl">{minutes}</StyledTimerText>
            <StyledTimerText color="secondary">{t('m')}</StyledTimerText>
          </>
        </FlexGap>
        <StyledWhiteText bold>{text}</StyledWhiteText>
      </FlexContainer>
    </>
  )
}

export const LockTimer: React.FC<React.PropsWithChildren<{ lockTime: number }>> = ({ lockTime }) => {
  const { t } = useTranslation()

  const secondsRemaining = lockTime - Date.now() / 1000

  return <Timer secondsRemaining={secondsRemaining} text={t('until the next pot lock')} />
}
