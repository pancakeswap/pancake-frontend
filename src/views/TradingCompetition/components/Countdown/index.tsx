import React, { useContext } from 'react'
import styled from 'styled-components'
import { Flex, Skeleton } from '@pancakeswap-libs/uikit'
import useI18n from 'hooks/useI18n'
import getTimePeriods from 'utils/getTimePeriods'
import { CompetitionSteps, FINISHED, LIVE } from '../../config'
import { CompetitionCountdownContext } from '../../contexts/CompetitionCountdownContext'
import ProgressStepper from './ProgressStepper'
import Timer from './Timer'
import { PocketWatch } from '../../svgs'

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

const Countdown = () => {
  const TranslateString = useI18n()
  const { competitionState, timeUntilNextEvent, isLoading } = useContext(CompetitionCountdownContext)
  const { minutes, hours, days } = getTimePeriods(timeUntilNextEvent)

  return (
    <Wrapper>
      <PocketWatchWrapper>
        <PocketWatch />
      </PocketWatchWrapper>
      <Flex flexDirection="column" justifyContent="center">
        {isLoading ? (
          <Skeleton height={26} width={190} mb="24px" />
        ) : (
          competitionState.state !== FINISHED && (
            <Timer
              timerText={
                competitionState.state === LIVE
                  ? `${TranslateString(410, 'End')}:`
                  : `${TranslateString(1212, 'Start')}:`
              }
              minutes={minutes}
              hours={hours}
              days={days}
            />
          )
        )}
        {isLoading ? (
          <Skeleton height={42} width={190} />
        ) : (
          <ProgressStepper steps={CompetitionSteps} activeStepIndex={competitionState.step.index} />
        )}
      </Flex>
    </Wrapper>
  )
}

export default Countdown
