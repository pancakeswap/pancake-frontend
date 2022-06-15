import { useTranslation } from 'contexts/Localization'
import styled from 'styled-components'
import { Flex, Heading, Text } from '@pancakeswap/uikit'
import getTimePeriods from 'utils/getTimePeriods'

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
  margin-bottom: 3px;
  align-self: flex-end;
`

export const BannerTimer: React.FC = () => {
  const { t } = useTranslation()
  // TODO: Pottery
  const secondsUntilStart = 1655002229
  const timeUntil = getTimePeriods(secondsUntilStart)
  return (
    <>
      <FlexContainer mt="32px" gap="8px" alignItems="center">
        <FlexGap gap="4px" alignItems="baseline">
          {timeUntil.days ? (
            <>
              <StyledTimerText scale="xl">{timeUntil.days}</StyledTimerText>
              <StyledTimerText>{t('d')}</StyledTimerText>
            </>
          ) : null}
          {timeUntil.days || timeUntil.hours ? (
            <>
              <StyledTimerText scale="xl">{timeUntil.hours}</StyledTimerText>
              <StyledTimerText color="secondary">{t('h')}</StyledTimerText>
            </>
          ) : null}
          <>
            <StyledTimerText scale="xl">{timeUntil.minutes}</StyledTimerText>
            <StyledTimerText color="secondary">{t('m')}</StyledTimerText>
          </>
        </FlexGap>
        <StyledWhiteText bold>{t('until the next draw')}</StyledWhiteText>
      </FlexContainer>
    </>
  )
}
