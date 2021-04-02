import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { Flex, Skeleton, PocketWatchIcon, Text } from '@pancakeswap-libs/uikit'
import useI18n from 'hooks/useI18n'
import useGetBlockCountdown from 'hooks/useGetBlockCountdown'
import getTimePeriods from 'utils/getTimePeriods'
import { Heading2Text } from '../CompetitionHeadingText'
import { CompetitionSteps, FINISHED, LIVE, CompetitionPhaseProps } from '../../config'
import ProgressStepper from './ProgressStepper'
import Timer from './Timer'
import { GOLDGRADIENT } from '../Section/sectionStyles'

const Wrapper = styled(Flex)`
  width: fit-content;
  height: fit-content;
  background: linear-gradient(180deg, #7645d9 0%, #452a7a 100%);
  border: 1px solid #7645d9;
  box-sizing: border-box;
  border-radius: 0px 0px 24px 24px;
  padding: 16px 24px;
  margin: -30px auto 50px;
  justify-content: space-around;
  ${({ theme }) => theme.mediaQueries.xl} {
    flex-direction: column;
    margin: -38px 0 0 36px;
  }
`

const PocketWatchWrapper = styled(Flex)`
  align-items: center;
  justify-content: center;
  margin-right: 24px;

  svg {
    height: 64px;
    width: 64px;
  }

  ${({ theme }) => theme.mediaQueries.xl} {
    margin-bottom: 16px;
    margin-right: 0;
  }
`

const StyledHeading = styled(Heading2Text)`
  font-size: 24px;
  margin-right: 4px;
`

const TimerHeadingComponent = ({ children }) => (
  <StyledHeading background={GOLDGRADIENT} fill>
    {children}
  </StyledHeading>
)

const TimerBodyComponent = ({ children }) => (
  <Text color="#ffff" fontWeight="600" fontSize="16px" mr="16px">
    {children}
  </Text>
)

const Countdown: React.FC<{ currentPhase: CompetitionPhaseProps }> = ({ currentPhase }) => {
  const TranslateString = useI18n()
  const [secondsUntilNextEvent, setSecondsUntilNextEvent] = useState(0)
  const targetBlockNumber = currentPhase.ends
  const secondsUntilTargetBlock = useGetBlockCountdown(targetBlockNumber)

  const { minutes, hours, days } = getTimePeriods(secondsUntilNextEvent)

  useEffect(() => {
    setSecondsUntilNextEvent(secondsUntilTargetBlock)
  }, [secondsUntilTargetBlock])

  return (
    <Wrapper>
      <PocketWatchWrapper>
        <PocketWatchIcon />
      </PocketWatchWrapper>
      <Flex flexDirection="column" justifyContent="center">
        {!secondsUntilNextEvent ? (
          <Skeleton height={26} width={190} mb="24px" />
        ) : (
          currentPhase.state !== FINISHED && (
            <Flex mb="24px">
              <Timer
                timerStage={
                  currentPhase.state === LIVE ? `${TranslateString(410, 'End')}:` : `${TranslateString(1212, 'Start')}:`
                }
                minutes={minutes}
                hours={hours}
                days={days}
                blockNumber={targetBlockNumber}
                showTooltip
                HeadingTextComponent={TimerHeadingComponent}
                BodyTextComponent={TimerBodyComponent}
              />
            </Flex>
          )
        )}
        {!secondsUntilNextEvent ? (
          <Skeleton height={42} width={190} />
        ) : (
          <ProgressStepper steps={CompetitionSteps} activeStepIndex={currentPhase.step.index} />
        )}
      </Flex>
    </Wrapper>
  )
}

export default Countdown
