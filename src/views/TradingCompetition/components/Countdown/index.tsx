import React from 'react'
import styled from 'styled-components'
import { Flex } from '@pancakeswap-libs/uikit'
import useI18n from 'hooks/useI18n'
import ProgressStepper from './ProgressStepper'
import Timer from './Timer'
import { PocketWatch } from '../../svgs'

const Wrapper = styled(Flex)`
  background: linear-gradient(180deg, #7645d9 0%, #452a7a 100%);
  border: 1px solid #7645d9;
  box-sizing: border-box;
  border-radius: 0px 0px 24px 24px;
  padding: 16px 24px;
  margin-top: -30px;
  margin-bottom: 50px;
  justify-content: space-around;
  ${({ theme }) => theme.mediaQueries.lg} {
    flex-direction: column;
    margin-top: -38px;
    margin-bottom: 0;
    margin-left: 36px;
  }
`

const PocketWatchWrapper = styled(Flex)`
  align-items: center;
  justify-content: center;
  svg {
    height: 64px;
    width: 64px;
  }

  ${({ theme }) => theme.mediaQueries.lg} {
    margin-bottom: 24px;
  }
`

const Countdown = () => {
  const TranslateString = useI18n()
  const steps = [
    `${TranslateString(999, 'Entry')}`,
    `${TranslateString(1198, 'Live')}`,
    `${TranslateString(410, 'End')}`,
  ]
  const activeStepIndex = 1

  // 00:00 07.04.2021 UTC
  const competitionStartTime = 1617750000000

  // 00:00 14.04.2021 UTC
  const competitionEndTime = 1618354800000

  return (
    <Wrapper>
      <PocketWatchWrapper>
        <PocketWatch />
      </PocketWatchWrapper>
      <Flex flexDirection="column">
        <Timer competitionStartTime={competitionStartTime} competitionEndTime={competitionEndTime} />
        <ProgressStepper steps={steps} activeStepIndex={activeStepIndex} />
      </Flex>
    </Wrapper>
  )
}

export default Countdown
