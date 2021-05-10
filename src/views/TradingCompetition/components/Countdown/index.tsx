import React from 'react'
import styled from 'styled-components'
import { Flex, Skeleton, PocketWatchIcon, Text } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import Timer from 'components/Timer'
import getTimePeriods from 'utils/getTimePeriods'
import { CompetitionSteps, LIVE } from 'config/constants/trading-competition/easterPhases'
import { Heading2Text } from '../CompetitionHeadingText'
import { CompetitionPhaseProps } from '../../types'
import ProgressStepper from './ProgressStepper'
import { GOLDGRADIENT } from '../Section/sectionStyles'

const Wrapper = styled(Flex)`
  width: fit-content;
  height: fit-content;
  background: linear-gradient(180deg, #7645d9 0%, #452a7a 100%);
  border: 1px solid #7645d9;
  box-sizing: border-box;
  border-radius: 0px 0px 24px 24px;
  padding: 16px 18px;
  margin: -30px auto 50px;
  justify-content: space-around;

  ${({ theme }) => theme.mediaQueries.sm} {
    padding: 16px 24px;
  }

  ${({ theme }) => theme.mediaQueries.xl} {
    flex-direction: column;
    margin: -38px 0 0 36px;
  }
`

const PocketWatchWrapper = styled(Flex)`
  align-items: center;
  justify-content: center;
  margin-right: 12px;

  svg {
    height: 48px;
    width: 48px;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    margin-right: 24px;

    svg {
      height: 64px;
      width: 64px;
    }
  }

  ${({ theme }) => theme.mediaQueries.xl} {
    margin-bottom: 16px;
    margin-right: 0;
  }
`

const StyledHeading = styled(Heading2Text)`
  font-size: 24px;
  margin-right: 2px;

  ${({ theme }) => theme.mediaQueries.sm} {
    margin-right: 4px;
  }
`

const TimerHeadingComponent = ({ children }) => (
  <StyledHeading background={GOLDGRADIENT} $fill>
    {children}
  </StyledHeading>
)

const TimerBodyComponent = ({ children }) => (
  <Text bold color="#ffff" fontSize="16px" mr={{ _: '8px', sm: '16px' }}>
    {children}
  </Text>
)

const Countdown: React.FC<{ currentPhase: CompetitionPhaseProps; hasCompetitionEnded: boolean }> = ({
  currentPhase,
  hasCompetitionEnded,
}) => {
  const { t } = useTranslation()
  const finishMs = currentPhase.ends
  const currentMs = Date.now()
  const secondsUntilNextEvent = (finishMs - currentMs) / 1000

  const { minutes, hours, days } = getTimePeriods(secondsUntilNextEvent)

  const renderTimer = () => {
    if (hasCompetitionEnded) {
      return (
        <StyledHeading background={GOLDGRADIENT} $fill>
          {t('Finished')}!
        </StyledHeading>
      )
    }
    return (
      <Timer
        timerStage={currentPhase.state === LIVE ? `${t('End')}:` : `${t('Start')}:`}
        minutes={minutes}
        hours={hours}
        days={days}
        HeadingTextComponent={TimerHeadingComponent}
        BodyTextComponent={TimerBodyComponent}
      />
    )
  }

  return (
    <Wrapper>
      <PocketWatchWrapper>
        <PocketWatchIcon />
      </PocketWatchWrapper>
      <Flex flexDirection="column" justifyContent="center">
        {!secondsUntilNextEvent ? (
          <Skeleton height={26} width={190} mb="24px" />
        ) : (
          <Flex mb="24px" justifyContent="center" alignItems="center">
            {renderTimer()}
          </Flex>
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
